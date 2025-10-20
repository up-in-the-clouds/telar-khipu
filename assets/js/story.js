/**
 * Telar Story - UniversalViewer + Scrollama Integration
 * Handles scrollytelling interactions for story pages
 */

let scroller;
let currentObject = null;
let currentViewerCard = null; // Currently active viewer card
let currentStepNumber = null; // Track current step to prevent duplicate processing
let panelStack = [];
let objectsIndex = {}; // Quick lookup for object data
let isPanelOpen = false; // Track if any panel is open
let scrollLockActive = false; // Track if scroll-lock is active

// Viewer card management
let viewerCards = []; // Array of { objectId, element, uvInstance, osdViewer, isReady, pendingZoom }
let viewerCardCounter = 0;
const MAX_VIEWER_CARDS = 3;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  buildObjectsIndex();
  initializeFirstViewer();
  initializeScrollama();
  initializePanels();
  initializeScrollLock();
});

/**
 * Build index of objects for quick lookup
 */
function buildObjectsIndex() {
  const objects = window.objectsData || [];
  objects.forEach(obj => {
    objectsIndex[obj.object_id] = obj;
  });
}

/**
 * Initialize first viewer card on page load
 */
function initializeFirstViewer() {
  const firstObjectId = window.storyData?.firstObject;

  if (!firstObjectId) {
    console.error('No first object specified in story data');
    return;
  }

  console.log('Initializing first viewer for object:', firstObjectId);

  // Set current object
  currentObject = firstObjectId;

  // Get first step coordinates from story data
  const firstStep = window.storyData?.steps?.[0];
  const x = firstStep ? parseFloat(firstStep.x) : undefined;
  const y = firstStep ? parseFloat(firstStep.y) : undefined;
  const zoom = firstStep ? parseFloat(firstStep.zoom) : undefined;

  // Create first viewer card with z-index 1
  currentViewerCard = createViewerCard(firstObjectId, 1, x, y, zoom);
  currentViewerCard.element.classList.add('card-active');
}

/**
 * Create a new viewer card for an object
 */
function createViewerCard(objectId, zIndex, x, y, zoom) {
  const container = document.getElementById('viewer-cards-container');

  // Create card element - stays off-screen initially
  const cardElement = document.createElement('div');
  cardElement.className = 'viewer-card card-below';
  cardElement.style.zIndex = zIndex;
  cardElement.dataset.object = objectId;

  // Create viewer instance container
  const viewerId = `viewer-instance-${viewerCardCounter}`;
  const viewerDiv = document.createElement('div');
  viewerDiv.className = 'viewer-instance';
  viewerDiv.id = viewerId;

  cardElement.appendChild(viewerDiv);
  container.appendChild(cardElement);

  console.log(`Created viewer card for ${objectId} with z-index ${zIndex}, will snap to x=${x}, y=${y}, zoom=${zoom}`);

  // Get manifest URL
  const manifestUrl = getManifestUrl(objectId);
  if (!manifestUrl) {
    console.error('Could not determine manifest URL for:', objectId);
    return null;
  }

  // Initialize UV in this card
  const urlAdaptor = new UV.IIIFURLAdaptor();
  const data = urlAdaptor.getInitialData({
    manifest: manifestUrl,
    embedded: true
  });

  const uvInstance = UV.init(viewerId, data);
  urlAdaptor.bindTo(uvInstance);

  // Track the card with pending position
  const viewerCard = {
    objectId,
    element: cardElement,
    uvInstance,
    osdViewer: null,
    isReady: false,
    pendingZoom: (!isNaN(x) && !isNaN(y) && !isNaN(zoom)) ? { x, y, zoom, snap: true } : null,
    zIndex
  };

  // Listen for UV initialization
  uvInstance.on('created', function() {
    setTimeout(function() {
      if (uvInstance._assignedContentHandler) {
        let newViewer = null;

        // Try direct viewer access FIRST (this path works reliably)
        if (uvInstance._assignedContentHandler.viewer) {
          newViewer = uvInstance._assignedContentHandler.viewer;
          console.log(`Got viewer via direct access for ${objectId}`);
        }
        // Fallback to extension path
        else if (uvInstance._assignedContentHandler.extension) {
          const ext = uvInstance._assignedContentHandler.extension;
          if (ext.centerPanel && ext.centerPanel.viewer) {
            newViewer = ext.centerPanel.viewer;
            console.log(`Got viewer via extension path for ${objectId}`);
          }
        }

        if (newViewer) {
          viewerCard.osdViewer = newViewer;
          viewerCard.isReady = true;
          console.log(`Viewer card for ${objectId} is ready`);

          // Hide UV controls via JavaScript
          setTimeout(() => {
            const leftPanel = cardElement.querySelector('.leftPanel');
            if (leftPanel) {
              leftPanel.style.display = 'none';
              leftPanel.style.visibility = 'hidden';
            }
          }, 100);

          // Execute pending position snap if any
          if (viewerCard.pendingZoom) {
            if (viewerCard.pendingZoom.snap) {
              // Snap immediately (for new object load)
              snapViewerToPosition(viewerCard, viewerCard.pendingZoom.x, viewerCard.pendingZoom.y, viewerCard.pendingZoom.zoom);
            } else {
              // Animate smoothly (for same object)
              animateViewerToPosition(viewerCard, viewerCard.pendingZoom.x, viewerCard.pendingZoom.y, viewerCard.pendingZoom.zoom);
            }
            viewerCard.pendingZoom = null;
          }
        }
      }
    }, 2000);
  });

  viewerCards.push(viewerCard);
  viewerCardCounter++;

  // Cleanup old viewers if we exceed maximum
  if (viewerCards.length > MAX_VIEWER_CARDS) {
    const oldest = viewerCards.shift();
    destroyViewerCard(oldest);
  }

  return viewerCard;
}

/**
 * Get existing viewer card or create new one
 */
function getOrCreateViewerCard(objectId, zIndex, x, y, zoom) {
  // Debug: log current state
  console.log(`getOrCreateViewerCard called for ${objectId}`);
  console.log(`Current viewerCards: ${viewerCards.map(vc => vc.objectId).join(', ')}`);

  // Check if we already have a viewer for this object
  const existing = viewerCards.find(vc => vc.objectId === objectId);

  if (existing) {
    console.log(`Reusing existing viewer card for ${objectId}`);
    // Update z-index if needed
    existing.element.style.zIndex = zIndex;
    existing.zIndex = zIndex;

    // For existing viewers, just snap to new position immediately
    if (!isNaN(x) && !isNaN(y) && !isNaN(zoom)) {
      if (existing.isReady) {
        snapViewerToPosition(existing, x, y, zoom);
      } else {
        existing.pendingZoom = { x, y, zoom, snap: true };
      }
    }

    return existing;
  }

  // Create new viewer card
  console.log(`Creating new viewer card for ${objectId}`);
  return createViewerCard(objectId, zIndex, x, y, zoom);
}

/**
 * Destroy a viewer card and clean up resources
 */
function destroyViewerCard(viewerCard) {
  console.log(`Destroying viewer card for ${viewerCard.objectId}`);

  // Remove from DOM
  if (viewerCard.element && viewerCard.element.parentNode) {
    viewerCard.element.parentNode.removeChild(viewerCard.element);
  }

  // TODO: Properly dispose UV instance if API provides method
  // For now, just remove reference
  viewerCard.uvInstance = null;
  viewerCard.osdViewer = null;
}

/**
 * Get manifest URL for an object
 */
function getManifestUrl(objectId) {
  const object = objectsIndex[objectId];

  if (!object) {
    console.warn('Object not found:', objectId);
    // Fallback to local IIIF
    return buildLocalInfoJsonUrl(objectId);
  }

  // If object has iiif_manifest field and it's not empty, use it
  if (object.iiif_manifest && object.iiif_manifest.trim() !== '') {
    return object.iiif_manifest;
  }

  // Otherwise use local IIIF
  return buildLocalInfoJsonUrl(objectId);
}

/**
 * Build local IIIF manifest.json URL
 */
function buildLocalInfoJsonUrl(objectId) {
  // Get the site's base URL from the page
  // For /telar/stories/story-1/, we want /telar
  const pathParts = window.location.pathname.split('/').filter(p => p);

  // Find the baseurl by removing the last 2 path segments (stories/story-1)
  let basePath = '';
  if (pathParts.length >= 2) {
    basePath = '/' + pathParts.slice(0, -2).join('/');
  }

  const manifestUrl = `${window.location.origin}${basePath}/iiif/objects/${objectId}/manifest.json`;
  console.log('Building local IIIF manifest URL:', manifestUrl);

  return manifestUrl;
}

/**
 * Initialize Scrollama for step detection
 */
function initializeScrollama() {
  scroller = scrollama();

  scroller
    .setup({
      step: '.story-step',
      offset: 0.5,
      debug: false
    })
    .onStepEnter(handleStepEnter)
    .onStepExit(handleStepExit);

  // Handle window resize
  window.addEventListener('resize', scroller.resize);
}

/**
 * Handle step enter event
 */
function handleStepEnter(response) {
  const step = response.element;
  const stepNumber = parseInt(step.dataset.step);

  // Add active class for border highlight
  step.classList.add('is-active');

  // Get step data
  const objectId = step.dataset.object;
  const x = parseFloat(step.dataset.x);
  const y = parseFloat(step.dataset.y);
  const zoom = parseFloat(step.dataset.zoom);
  const region = step.dataset.region;

  // Check if we need to switch objects or just pan/zoom current object
  if (objectId && objectId !== currentObject) {
    // Switching to different object - pass target position for off-screen snap
    switchToObject(objectId, stepNumber, x, y, zoom);
    currentObject = objectId;
  } else {
    // Same object - smooth animate to new position
    if (currentViewerCard && !isNaN(x) && !isNaN(y) && !isNaN(zoom)) {
      console.log(`Same object animation: x=${x}, y=${y}, zoom=${zoom}, isReady=${currentViewerCard.isReady}`);
      if (currentViewerCard.isReady) {
        animateViewerToPosition(currentViewerCard, x, y, zoom);
      } else {
        console.warn('Viewer not ready, queueing zoom');
        // Queue the zoom operation for when viewer is ready
        currentViewerCard.pendingZoom = { x, y, zoom, snap: false };
        // Set up a watcher to process when ready
        const checkReady = setInterval(() => {
          if (currentViewerCard.isReady) {
            clearInterval(checkReady);
            if (currentViewerCard.pendingZoom && !currentViewerCard.pendingZoom.snap) {
              animateViewerToPosition(currentViewerCard, currentViewerCard.pendingZoom.x, currentViewerCard.pendingZoom.y, currentViewerCard.pendingZoom.zoom);
              currentViewerCard.pendingZoom = null;
            }
          }
        }, 100);
      }
    } else if (currentViewerCard && region) {
      if (currentViewerCard.isReady) {
        setTimeout(() => animateViewerToRegion(currentViewerCard, region), 300);
      }
    }
  }

  // Update viewer info
  updateViewerInfo(stepNumber);
}

/**
 * Handle step exit event
 */
function handleStepExit(response) {
  const step = response.element;
  step.classList.remove('is-active');
}

/**
 * Switch to a different IIIF object using viewer cards
 */
function switchToObject(objectId, stepNumber, x, y, zoom) {
  console.log(`Switching to object: ${objectId} at step ${stepNumber} with position x=${x}, y=${y}, zoom=${zoom}`);

  // Get or create viewer card for this object
  const newViewerCard = getOrCreateViewerCard(objectId, stepNumber, x, y, zoom);

  // Wait for viewer to be ready and positioned before sliding up
  const startTime = Date.now();
  const MAX_WAIT_TIME = 5000; // 5 seconds max

  const slideUpWhenReady = () => {
    const elapsed = Date.now() - startTime;

    if (newViewerCard.isReady) {
      console.log(`Viewer ready, sliding up card for ${objectId}`);
      // Slide up the new viewer card
      newViewerCard.element.classList.remove('card-below');
      newViewerCard.element.classList.add('card-active');

      // Keep old viewer card underneath (don't slide it away)
      if (currentViewerCard && currentViewerCard !== newViewerCard) {
        currentViewerCard.element.classList.remove('card-active');
        // It stays at translateY(0), covered by higher z-index
      }

      // Update current viewer card reference
      currentViewerCard = newViewerCard;
    } else if (elapsed < MAX_WAIT_TIME) {
      console.log(`Viewer not ready yet, waiting... (${elapsed}ms elapsed)`);
      setTimeout(slideUpWhenReady, 100);
    } else {
      console.warn(`Viewer for ${objectId} failed to load after 5 seconds, sliding up anyway`);
      // Slide up anyway to prevent black screen
      newViewerCard.element.classList.remove('card-below');
      newViewerCard.element.classList.add('card-active');

      if (currentViewerCard && currentViewerCard !== newViewerCard) {
        currentViewerCard.element.classList.remove('card-active');
      }

      currentViewerCard = newViewerCard;
    }
  };

  // Start checking if ready
  slideUpWhenReady();
}

/**
 * Animate a viewer card to specific position using OpenSeadragon
 */
function animateViewerToPosition(viewerCard, x, y, zoom) {
  if (!viewerCard || !viewerCard.osdViewer) {
    console.warn('Viewer card or OpenSeadragon viewer not ready for animation');
    return;
  }

  console.log(`Animating viewer to position: x=${x}, y=${y}, zoom=${zoom} over 36 seconds`);

  const osdViewer = viewerCard.osdViewer;
  const viewport = osdViewer.viewport;

  // Get home zoom for reference
  const homeZoom = viewport.getHomeZoom();

  // Get image aspect ratio
  const imageBounds = viewport.getHomeBounds();

  // OpenSeadragon viewport coordinates: image bounds give us the frame
  // We need to position within that frame using our 0-1 coordinates
  const point = {
    x: imageBounds.x + (x * imageBounds.width),
    y: imageBounds.y + (y * imageBounds.height)
  };

  // Calculate the actual zoom level
  // Our zoom values (1, 2.5, 3, etc.) are relative to home zoom
  const actualZoom = homeZoom * zoom;

  console.log(`OSD coordinates - point: ${point.x}, ${point.y}, zoom: ${actualZoom}, homeZoom: ${homeZoom}`);

  // Configure OpenSeadragon viewer for smooth animations
  osdViewer.gestureSettingsMouse.clickToZoom = false;
  osdViewer.gestureSettingsTouch.clickToZoom = false;

  // Set animation parameters directly on the viewer
  const originalAnimationTime = osdViewer.animationTime;
  const originalSpringStiffness = osdViewer.springStiffness;

  osdViewer.animationTime = 36.0;  // Seconds for animation - extremely slow, cinematic
  osdViewer.springStiffness = 0.8;  // Lower = smoother, less bouncy

  console.log(`Set animation time to ${osdViewer.animationTime}s, spring stiffness to ${osdViewer.springStiffness}`);

  // Use viewport methods with immediate flag set to false for smooth animation
  viewport.panTo(point, false);
  viewport.zoomTo(actualZoom, point, false);

  // Reset after animation
  setTimeout(() => {
    osdViewer.animationTime = originalAnimationTime;
    osdViewer.springStiffness = originalSpringStiffness;
  }, 36100);
}

/**
 * Snap viewer to position immediately (no animation) - for initial load
 */
function snapViewerToPosition(viewerCard, x, y, zoom) {
  if (!viewerCard || !viewerCard.osdViewer) {
    console.warn('Viewer card or OpenSeadragon viewer not ready for snap');
    return;
  }

  const osdViewer = viewerCard.osdViewer;
  const viewport = osdViewer.viewport;

  // Get home zoom for reference
  const homeZoom = viewport.getHomeZoom();

  // Get image aspect ratio
  const imageBounds = viewport.getHomeBounds();

  // Calculate point
  const point = {
    x: imageBounds.x + (x * imageBounds.width),
    y: imageBounds.y + (y * imageBounds.height)
  };

  // Calculate zoom
  const actualZoom = homeZoom * zoom;

  console.log(`Snapping to position immediately: x=${x}, y=${y}, zoom=${zoom}`);

  // Use immediate flag (true) to snap instantly
  viewport.panTo(point, true);
  viewport.zoomTo(actualZoom, point, true);
}

/**
 * Animate viewer card to named region using OpenSeadragon
 * Region format: "x,y,width,height" (normalized 0-1 coordinates)
 */
function animateViewerToRegion(viewerCard, region) {
  if (!viewerCard || !viewerCard.osdViewer) {
    console.warn('Viewer card or OpenSeadragon viewer not ready');
    return;
  }

  console.log('Animating to region:', region);

  const parts = region.split(',').map(parseFloat);
  if (parts.length !== 4) {
    console.warn('Invalid region format, expected x,y,width,height');
    return;
  }

  const [x, y, width, height] = parts;
  const rect = { x: x, y: y, width: width, height: height };

  viewerCard.osdViewer.viewport.fitBounds(rect, true);
}

/**
 * Update viewer info overlay
 */
function updateViewerInfo(stepNumber) {
  const infoElement = document.getElementById('current-object-title');
  if (infoElement) {
    infoElement.textContent = `Step ${stepNumber}`;
  }
}

/**
 * Initialize panel system
 */
function initializePanels() {
  // Layer 1 panel triggers
  document.querySelectorAll('[data-panel="layer1"]').forEach(trigger => {
    trigger.addEventListener('click', function() {
      const stepNumber = this.dataset.step;
      // Clear stack and open layer1
      panelStack = [];
      openPanel('layer1', stepNumber);
    });
  });

  // Layer 2 panel triggers (using delegation since buttons are added dynamically)
  document.addEventListener('click', function(e) {
    if (e.target.matches('[data-panel="layer2"]')) {
      const stepNumber = e.target.dataset.step;
      // Open layer2 on top of layer1
      openPanel('layer2', stepNumber);
    }
  });

  // Layer 1 back button - closes the panel
  const layer1Back = document.getElementById('panel-layer1-back');
  if (layer1Back) {
    layer1Back.addEventListener('click', function() {
      closePanel('layer1');
    });
  }

  // Layer 2 back button - goes back to layer1
  const layer2Back = document.getElementById('panel-layer2-back');
  if (layer2Back) {
    layer2Back.addEventListener('click', function() {
      closePanel('layer2');
      // Layer 1 should still be visible underneath
    });
  }

  // Glossary back button
  const glossaryBack = document.getElementById('panel-glossary-back');
  if (glossaryBack) {
    glossaryBack.addEventListener('click', function() {
      closePanel('glossary');
      // Return to previous panel if exists
      if (panelStack.length > 0) {
        const previous = panelStack[panelStack.length - 1];
        // Panel should still be open
      }
    });
  }
}

/**
 * Open a panel with content
 */
function openPanel(panelType, contentId) {
  const panelId = `panel-${panelType}`;
  const panel = document.getElementById(panelId);

  if (!panel) return;

  // Get content from story data
  const content = getPanelContent(panelType, contentId);

  if (content) {
    // Update panel content
    document.getElementById(`${panelId}-title`).textContent = content.title;
    document.getElementById(`${panelId}-content`).innerHTML = content.html;

    // Track current panel
    if (panelType === 'layer1') {
      panelStack = [{ type: panelType, id: contentId }];
    } else {
      // Layer 2 or glossary - keep layer1 in stack
      panelStack.push({ type: panelType, id: contentId });
    }

    // Open panel
    const bsOffcanvas = new bootstrap.Offcanvas(panel);
    bsOffcanvas.show();

    // Activate scroll lock
    isPanelOpen = true;
    activateScrollLock();
  }
}

/**
 * Close a panel
 */
function closePanel(panelType) {
  const panelId = `panel-${panelType}`;
  const panel = document.getElementById(panelId);

  if (!panel) return;

  const bsOffcanvas = bootstrap.Offcanvas.getInstance(panel);
  if (bsOffcanvas) {
    bsOffcanvas.hide();
  }

  // Check if all panels are closed
  setTimeout(() => {
    const anyPanelOpen = document.querySelector('.offcanvas.show');
    if (!anyPanelOpen) {
      isPanelOpen = false;
      deactivateScrollLock();
    }
  }, 350); // Wait for Bootstrap animation to complete
}

/**
 * Get panel content from story data
 */
function getPanelContent(panelType, contentId) {
  // This will be populated from the story's YAML/JSON data
  const steps = window.storyData?.steps || [];
  const step = steps.find(s => s.step == contentId);

  if (!step) return null;

  if (panelType === 'layer1') {
    let html = formatPanelContent({
      text: step.layer1_text,
      media: step.layer1_media
    });

    // Add layer2 button if layer2 has content
    if ((step.layer2_title && step.layer2_title.trim() !== '') || (step.layer2_text && step.layer2_text.trim() !== '')) {
      const buttonLabel = (step.layer2_button && step.layer2_button.trim() !== '') ? step.layer2_button : 'Go deeper';
      html += `<p><button class="panel-trigger" data-panel="layer2" data-step="${contentId}">${buttonLabel} →</button></p>`;
    }

    return {
      title: step.layer1_title || 'Layer 1',
      html: html
    };
  } else if (panelType === 'layer2') {
    return {
      title: step.layer2_title || 'Layer 2',
      html: formatPanelContent({
        text: step.layer2_text,
        media: step.layer2_media
      })
    };
  } else if (panelType === 'glossary') {
    // Fetch from glossary data
    return {
      title: 'Glossary Term',
      html: '<p>Glossary content...</p>'
    };
  }

  return null;
}

/**
 * Format panel content (text + media)
 */
function formatPanelContent(panelData) {
  if (!panelData) return '<p>No content available.</p>';

  let html = '';

  // Get the base URL from the current path
  const pathParts = window.location.pathname.split('/').filter(p => p);
  let basePath = '';
  
  // Extract baseurl similar to buildLocalInfoJsonUrl logic
  if (pathParts.length >= 2) {
    basePath = '/' + pathParts.slice(0, -2).join('/');
  }

  if (panelData.text) {
    // Text is already HTML from markdown conversion
    // Fix image URLs within the text content
    html += fixImageUrls(panelData.text, basePath);
  }

  if (panelData.media && panelData.media.trim() !== '') {
    // Check if the media URL starts with "/" (site-relative)
    let mediaUrl = panelData.media;
    if (mediaUrl.startsWith('/') && !mediaUrl.startsWith('//')) {
      // Prepend the base path
      mediaUrl = basePath + mediaUrl;
    }
    
    html += `<img src="${mediaUrl}" alt="Panel image" class="img-fluid">`;
  }

  return html;
}

/**
 * Fix image URLs in HTML content to include baseurl
 */
function fixImageUrls(htmlContent, basePath) {
  // Create a temporary div to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  // Find all img tags
  const images = tempDiv.querySelectorAll('img');
  images.forEach(img => {
    const src = img.getAttribute('src');
    if (src && src.startsWith('/') && !src.startsWith('//')) {
      // Prepend the base path to site-relative URLs
      img.setAttribute('src', basePath + src);
    }
  });
  
  return tempDiv.innerHTML;
}

/**
 * Initialize scroll-lock system
 * Auto-closes panels when user continues scrolling
 */
function initializeScrollLock() {
  const narrativeColumn = document.querySelector('.narrative-column');
  if (!narrativeColumn) return;

  let scrollTimeout;

  narrativeColumn.addEventListener('scroll', function() {
    if (!isPanelOpen) return;

    // Clear existing timeout
    clearTimeout(scrollTimeout);

    // Set timeout to close panels if scrolling continues
    scrollTimeout = setTimeout(() => {
      if (isPanelOpen) {
        closeAllPanels();
      }
    }, 300); // Close after 300ms of scrolling
  });
}

/**
 * Activate scroll lock
 * Prevents step changes while panel is open
 */
function activateScrollLock() {
  scrollLockActive = true;
}

/**
 * Deactivate scroll lock
 * Allows step changes when panel is closed
 */
function deactivateScrollLock() {
  scrollLockActive = false;
}

/**
 * Close all open panels
 */
function closeAllPanels() {
  const openPanels = document.querySelectorAll('.offcanvas.show');
  openPanels.forEach(panel => {
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(panel);
    if (bsOffcanvas) {
      bsOffcanvas.hide();
    }
  });

  isPanelOpen = false;
  deactivateScrollLock();
}

// Export for debugging
window.TelarStory = {
  viewerCards,
  currentViewerCard,
  scroller,
  switchToObject,
  animateViewerToPosition,
  openPanel,
  getManifestUrl,
  closeAllPanels,
  createViewerCard,
  getOrCreateViewerCard
};
