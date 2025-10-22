/**
 * Telar - Digital Storytelling Framework
 * Main JavaScript file
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('Telar initialized');

  // Initialize panel triggers
  initializePanelTriggers();
});

/**
 * Initialize panel trigger buttons
 */
function initializePanelTriggers() {
  const triggers = document.querySelectorAll('.panel-trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      const panelId = this.dataset.panel;
      const panel = document.getElementById(panelId);

      if (panel) {
        const bsOffcanvas = new bootstrap.Offcanvas(panel);
        bsOffcanvas.show();
      }
    });
  });
}

/**
 * Panel stacking system
 * Handles multiple panel layers (Layer 1 -> Layer 2 -> Glossary)
 */
class PanelStack {
  constructor() {
    this.stack = [];
  }

  push(panelId) {
    this.stack.push(panelId);
  }

  pop() {
    return this.stack.pop();
  }

  getCurrent() {
    return this.stack[this.stack.length - 1];
  }
}

// Export for use in chapter pages
window.Telar = {
  PanelStack: new PanelStack()
};
