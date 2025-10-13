/**
 * Telar Story - UniversalViewer + Scrollama Integration
 * Handles scrollytelling interactions for story pages
 */

let uvInstance;
let osdViewer; // OpenSeadragon viewer from UV
let scroller;
let currentObject = null;
let panelStack = [];
let objectsIndex = {}; // Quick lookup for object data
let isViewerReady = false; // Track if UV is fully initialized
let pendingZoom = null; // Queue zoom operations if viewer isn't ready
let isPanelOpen = false; // Track if any panel is open
let scrollLockActive = false; // Track if scroll-lock is active

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  buildObjectsIndex();
  initializeViewer();
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
 * Initialize UniversalViewer with IIIF support
 */
function initializeViewer() {
  // Get first object from story data
  const firstObjectId = window.storyData?.firstObject;

  if (!firstObjectId) {
    console.error('No first object specified in story data');
    return;
  }

  // Set current object immediately to prevent unnecessary switching
  currentObject = firstObjectId;

  // Get manifest URL for first object
  const manifestUrl = getManifestUrl(firstObjectId);

  if (!manifestUrl) {
    console.error('Could not determine manifest URL for:', firstObjectId);
    return;
  }

  console.log('Initializing UniversalViewer with:', manifestUrl);

  // Initialize UniversalViewer
  var urlAdaptor = new UV.IIIFURLAdaptor();
  const data = urlAdaptor.getInitialData({
    manifest: manifestUrl,
    embedded: true
  });

  uvInstance = UV.init('viewer-container', data);
  urlAdaptor.bindTo(uvInstance);

  // Listen for UV events to access OpenSeadragon
  uvInstance.on('created', function() {
    // Wait for OpenSeadragon to be fully initialized
    setTimeout(function() {
      if (uvInstance._assignedContentHandler) {
        // Try to get viewer directly
        if (uvInstance._assignedContentHandler.viewer) {
          osdViewer = uvInstance._assignedContentHandler.viewer;
          isViewerReady = true;

          // Execute any pending zoom operation
          if (pendingZoom) {
            animateToPosition(pendingZoom.x, pendingZoom.y, pendingZoom.zoom);
            pendingZoom = null;
          }
        } else if (uvInstance._assignedContentHandler.extension) {
          // Get viewer through extension
          const ext = uvInstance._assignedContentHandler.extension;

          if (ext.centerPanel && ext.centerPanel.viewer) {
            osdViewer = ext.centerPanel.viewer;
            isViewerReady = true;

            if (pendingZoom) {
              animateToPosition(pendingZoom.x, pendingZoom.y, pendingZoom.zoom);
              pendingZoom = null;
            }
          }
        }
      }
    }, 3000);
  });
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
  const stepNumber = step.dataset.step;

  // Add active class
  step.classList.add('is-active');

  // Get step data
  const objectId = step.dataset.object;
  const x = parseFloat(step.dataset.x);
  const y = parseFloat(step.dataset.y);
  const zoom = parseFloat(step.dataset.zoom);
  const region = step.dataset.region;


  // Check if we need to switch objects
  if (objectId && objectId !== currentObject) {
    switchObject(objectId);
  }

  // Animate to new position
  if (!isNaN(x) && !isNaN(y) && !isNaN(zoom)) {
    if (isViewerReady) {
      // Viewer is ready, animate immediately
      setTimeout(() => animateToPosition(x, y, zoom), 100);
    } else {
      // Queue the zoom operation for when viewer is ready
      pendingZoom = { x, y, zoom };
    }
  } else if (region) {
    // If region is specified instead of x/y/zoom
    if (isViewerReady) {
      setTimeout(() => animateToRegion(region), 300);
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
 * Switch to a different IIIF object
 */
function switchObject(objectId) {
  if (!uvInstance) return;

  const manifestUrl = getManifestUrl(objectId);

  console.log('Switching to object:', objectId, 'manifest:', manifestUrl);

  // Update UV with new manifest
  var urlAdaptor = new UV.IIIFURLAdaptor();
  const data = urlAdaptor.getInitialData({
    manifest: manifestUrl,
    embedded: true
  });

  // Reload UV with new manifest
  uvInstance.set(data);
  currentObject = objectId;

  // Wait for OSD to be ready again
  setTimeout(function() {
    const extension = uvInstance.extension;
    if (extension && extension.centerPanel && extension.centerPanel.viewer) {
      osdViewer = extension.centerPanel.viewer;
      console.log('OpenSeadragon viewer updated');
    }
  }, 1000);
}

/**
 * Animate viewer to specific position using OpenSeadragon directly
 */
function animateToPosition(x, y, zoom) {
  if (!osdViewer) {
    console.warn('OpenSeadragon viewer not ready');
    return;
  }

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

  // Configure OpenSeadragon viewer for smooth animations
  // These settings control the physics of the animation
  osdViewer.gestureSettingsMouse.clickToZoom = false;
  osdViewer.gestureSettingsTouch.clickToZoom = false;

  // Set animation parameters directly on the viewer
  const originalAnimationTime = osdViewer.animationTime;
  const originalSpringStiffness = osdViewer.springStiffness;

  osdViewer.animationTime = 36.0;  // Seconds for animation - extremely slow, cinematic (3x slower)
  osdViewer.springStiffness = 0.8;  // Lower = smoother, less bouncy (very fluid)

  // Use viewport methods with immediate flag set to false for smooth animation
  viewport.panTo(point, false);  // false = don't snap immediately
  viewport.zoomTo(actualZoom, point, false);  // false = animate smoothly

  // Reset after animation
  setTimeout(() => {
    osdViewer.animationTime = originalAnimationTime;
    osdViewer.springStiffness = originalSpringStiffness;
  }, 36100);
}

/**
 * Animate viewer to named region using OpenSeadragon
 * Region format: "x,y,width,height" (normalized 0-1 coordinates)
 */
function animateToRegion(region) {
  if (!osdViewer) {
    console.warn('OpenSeadragon viewer not ready');
    return;
  }

  console.log('Animating to region:', region);

  const parts = region.split(',').map(parseFloat);
  if (parts.length !== 4) {
    console.warn('Invalid region format, expected x,y,width,height');
    return;
  }

  const [x, y, width, height] = parts;
  // Use a simple object instead of OpenSeadragon.Rect
  const rect = { x: x, y: y, width: width, height: height };

  osdViewer.viewport.fitBounds(rect, true);
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

  if (panelData.text) {
    html += `<p>${panelData.text}</p>`;
  }

  if (panelData.media && panelData.media.trim() !== '') {
    html += `<img src="${panelData.media}" alt="Panel image" class="img-fluid">`;
  }

  return html;
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
  uvInstance,
  osdViewer,
  scroller,
  switchObject,
  animateToPosition,
  openPanel,
  getManifestUrl,
  closeAllPanels
};
