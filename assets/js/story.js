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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  buildObjectsIndex();
  initializeViewer();
  initializeScrollama();
  initializePanels();
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
    console.log('UniversalViewer created');
    currentObject = firstObjectId;
  });

  // Access the underlying OpenSeadragon viewer
  // UV uses the uv-seadragon-extension for images
  uvInstance.on('openseadragonExtension.opened', function() {
    console.log('OpenSeadragon extension ready');

    // Access OSD viewer through UV's extension
    // The extension stores the viewer in its centerPanel
    const extension = uvInstance.extension;
    if (extension && extension.centerPanel && extension.centerPanel.viewer) {
      osdViewer = extension.centerPanel.viewer;
      console.log('OpenSeadragon viewer accessed:', osdViewer);
    }
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

  console.log('Step entered:', stepNumber, { objectId, x, y, zoom });

  // Check if we need to switch objects
  if (objectId && objectId !== currentObject) {
    switchObject(objectId);
  }

  // Animate to new position (wait a bit for viewer to be ready)
  setTimeout(function() {
    if (osdViewer && !isNaN(x) && !isNaN(y) && !isNaN(zoom)) {
      animateToPosition(x, y, zoom);
    } else if (region) {
      // If region is specified instead of x/y/zoom
      animateToRegion(region);
    }
  }, 500);

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
 * Animate viewer to specific position using UV xywh parameter
 */
function animateToPosition(x, y, zoom) {
  if (!uvInstance) {
    console.warn('UniversalViewer not ready');
    return;
  }

  // Get current canvas dimensions from the manifest
  // We need to convert normalized coordinates (0-1) to pixel coordinates
  const extension = uvInstance.extension;
  if (!extension || !extension.helper || !extension.helper.getCurrentCanvas()) {
    console.warn('Cannot get current canvas');
    return;
  }

  const canvas = extension.helper.getCurrentCanvas();
  const imageWidth = canvas.getWidth();
  const imageHeight = canvas.getHeight();

  console.log('Canvas dimensions:', imageWidth, 'x', imageHeight);

  // Convert normalized x, y, zoom to xywh region
  // x, y are center point (0-1 range)
  // zoom is zoom level where 1 = fit to screen, higher = more zoomed in

  // Calculate visible region width/height based on zoom
  // Lower zoom = larger visible region
  const regionWidth = imageWidth / zoom;
  const regionHeight = imageHeight / zoom;

  // Convert center point to top-left corner
  const regionX = (x * imageWidth) - (regionWidth / 2);
  const regionY = (y * imageHeight) - (regionHeight / 2);

  // Ensure region stays within image bounds
  const boundedX = Math.max(0, Math.min(regionX, imageWidth - regionWidth));
  const boundedY = Math.max(0, Math.min(regionY, imageHeight - regionHeight));

  const xywh = `${Math.round(boundedX)},${Math.round(boundedY)},${Math.round(regionWidth)},${Math.round(regionHeight)}`;

  console.log('Zooming to region:', xywh);

  // Use UV's URL adaptor to navigate to the region
  var urlAdaptor = new UV.IIIFURLAdaptor();
  const currentData = uvInstance.getSettings();
  const manifestUrl = getManifestUrl(currentObject);

  const data = urlAdaptor.getInitialData({
    manifest: manifestUrl,
    embedded: true,
    xywh: xywh
  });

  uvInstance.set(data);
}

/**
 * Animate viewer to named region using xywh
 * Region format: "x,y,width,height" (can be normalized 0-1 or pixel coordinates)
 */
function animateToRegion(region) {
  if (!uvInstance) {
    console.warn('UniversalViewer not ready');
    return;
  }

  console.log('Animating to region:', region);

  const manifestUrl = getManifestUrl(currentObject);
  var urlAdaptor = new UV.IIIFURLAdaptor();

  const data = urlAdaptor.getInitialData({
    manifest: manifestUrl,
    embedded: true,
    xywh: region
  });

  uvInstance.set(data);
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

    // Add layer2 button if layer2 exists
    if (step.layer2_title && step.layer2_title.trim() !== '') {
      html += `<p><button class="panel-trigger" data-panel="layer2" data-step="${contentId}">${step.layer2_title} →</button></p>`;
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

// Export for debugging
window.TelarStory = {
  uvInstance,
  osdViewer,
  scroller,
  switchObject,
  animateToPosition,
  openPanel,
  getManifestUrl
};
