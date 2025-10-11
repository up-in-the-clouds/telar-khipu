/**
 * Telar Chapter - OpenSeadragon + Scrollama Integration
 * Handles scrollytelling interactions for chapter pages
 */

let viewer;
let scroller;
let currentObject = null;
let panelStack = [];

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initializeViewer();
  initializeScrollama();
  initializePanels();
});

/**
 * Initialize OpenSeadragon viewer with IIIF support
 */
function initializeViewer() {
  // Get first object from chapter data
  const firstObjectId = window.chapterData?.firstObject;

  if (!firstObjectId) {
    console.error('No first object specified in chapter data');
    return;
  }

  // Build IIIF info.json URL
  const infoJsonUrl = buildInfoJsonUrl(firstObjectId);

  // Initialize viewer
  viewer = OpenSeadragon({
    id: 'viewer-container',
    prefixUrl: 'https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.1.0/images/',
    tileSources: infoJsonUrl,
    minZoomLevel: 0.5,
    maxZoomLevel: 5,
    visibilityRatio: 1.0,
    animationTime: 1.5,
    showNavigationControl: true,
    showZoomControl: true,
    showHomeControl: true,
    showFullPageControl: true,
    defaultZoomLevel: 1
  });

  viewer.addHandler('open', function() {
    console.log('Viewer opened successfully');
    currentObject = firstObjectId;
  });

  viewer.addHandler('open-failed', function(event) {
    console.error('Failed to open IIIF image:', event.message);
    // Fallback: show error message in viewer
    document.getElementById('viewer-container').innerHTML =
      '<div class="d-flex align-items-center justify-content-center h-100 text-white">' +
      '<div class="text-center"><h3>Image Loading Error</h3>' +
      '<p>Unable to load IIIF image. Please check the object configuration.</p></div></div>';
  });
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

  // Animate to new position
  if (viewer && !isNaN(x) && !isNaN(y) && !isNaN(zoom)) {
    animateToPosition(x, y, zoom);
  } else if (region) {
    // If region is specified instead of x/y/zoom
    animateToRegion(region);
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
  if (!viewer) return;

  const infoJsonUrl = buildInfoJsonUrl(objectId);

  viewer.open(infoJsonUrl);
  currentObject = objectId;

  console.log('Switched to object:', objectId);
}

/**
 * Animate viewer to specific position
 */
function animateToPosition(x, y, zoom) {
  if (!viewer) return;

  // Create OpenSeadragon point (note: OSD uses [x, y] not [lat, lng])
  const point = new OpenSeadragon.Point(x, y);

  // Animate to position
  viewer.viewport.zoomTo(zoom, null, true);
  viewer.viewport.panTo(point, true);
}

/**
 * Animate viewer to named region
 * Region format: "x,y,width,height" (normalized 0-1)
 */
function animateToRegion(region) {
  if (!viewer) return;

  const parts = region.split(',').map(parseFloat);
  if (parts.length !== 4) return;

  const [x, y, width, height] = parts;
  const rect = new OpenSeadragon.Rect(x, y, width, height);

  viewer.viewport.fitBounds(rect, true);
}

/**
 * Build IIIF info.json URL from object ID
 */
function buildInfoJsonUrl(objectId) {
  // Check if it's an external IIIF URL
  if (objectId.startsWith('http://') || objectId.startsWith('https://')) {
    return objectId;
  }

  // Build local IIIF path
  const baseUrl = window.location.origin + '/iiif/objects/';
  return `${baseUrl}${objectId}/info.json`;
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
      openPanel('layer1', stepNumber);
    });
  });

  // Layer 2 back button
  const layer2Back = document.getElementById('panel-layer2-back');
  if (layer2Back) {
    layer2Back.addEventListener('click', function() {
      closePanel('layer2');
      openPanel('layer1', panelStack[panelStack.length - 1]);
    });
  }

  // Glossary back button
  const glossaryBack = document.getElementById('panel-glossary-back');
  if (glossaryBack) {
    glossaryBack.addEventListener('click', function() {
      closePanel('glossary');
      // Reopen previous panel if exists
      if (panelStack.length > 0) {
        const previous = panelStack.pop();
        openPanel(previous.type, previous.id);
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

  // Get content from chapter data
  const content = getPanelContent(panelType, contentId);

  if (content) {
    // Update panel content
    document.getElementById(`${panelId}-title`).textContent = content.title;
    document.getElementById(`${panelId}-content`).innerHTML = content.html;

    // Add to stack
    panelStack.push({ type: panelType, id: contentId });

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
 * Get panel content from chapter data
 */
function getPanelContent(panelType, contentId) {
  // This will be populated from the chapter's YAML/JSON data
  // For now, return placeholder
  const steps = window.chapterData?.steps || [];
  const step = steps.find(s => s.id === contentId);

  if (!step) return null;

  if (panelType === 'layer1') {
    return {
      title: step.layer1?.title || 'Layer 1',
      html: formatPanelContent(step.layer1)
    };
  } else if (panelType === 'layer2') {
    return {
      title: step.layer2?.title || 'Layer 2',
      html: formatPanelContent(step.layer2)
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

  if (panelData.media) {
    html += `<img src="${panelData.media}" alt="${panelData.title || ''}" class="img-fluid">`;
  }

  return html;
}

// Export for debugging
window.TelarChapter = {
  viewer,
  scroller,
  switchObject,
  animateToPosition,
  openPanel
};
