// Event tracking functionality (Q2)
let eventLogs = [];

// Function to log events to both console and panel
function logEvent(type, target) {
    const timestamp = new Date().toISOString();
    const targetType = getElementType(target);
    const eventLog = `${timestamp}, ${type}, ${targetType}`;
    
    // Log to console
    console.log(eventLog);
    
    // Add to event logs array
    eventLogs.push(eventLog);
    
    // Update panel content if it exists
    updateConsolePanel();
}

// Helper function to determine the type of element clicked
function getElementType(element) {
    if (!element) return 'unknown';
    
    // Check for common element types
    if (element.tagName === 'BUTTON') return 'button';
    if (element.tagName === 'A') return 'link';
    if (element.tagName === 'IMG') return 'image';
    if (element.tagName === 'INPUT') {
        return element.type ? `${element.type} input` : 'input';
    }
    if (element.tagName === 'SELECT') return 'dropdown';
    if (element.tagName === 'TEXTAREA') return 'text area';
    
    // Check for common classes/ids
    if (element.classList.contains('panel-header')) return 'panel header';
    if (element.classList.contains('control-button')) return 'control button';
    if (element.id === 'frame-slider') return 'slider';
    
    // If no specific type is identified, return the tag name
    return element.tagName.toLowerCase();
}

// Function to update the console panel with event logs
function updateConsolePanel() {
    const consolePanel = document.getElementById('panel-content-1');
    if (consolePanel) {
        // Get or create scrollable container
        let scrollableContent = consolePanel.querySelector('.scrollable-content');
        if (!scrollableContent) {
            scrollableContent = document.createElement('div');
            scrollableContent.className = 'scrollable-content';
            consolePanel.appendChild(scrollableContent);
        }
        
        // Create formatted HTML from logs
        const logsHtml = eventLogs.map(log => `<div class="log-entry">${log}</div>`).join('');
        scrollableContent.innerHTML = `<div class="event-logs">${logsHtml}</div>`;
        
        // Auto-scroll to bottom of logs
        scrollableContent.scrollTop = scrollableContent.scrollHeight;
    }
}

// Set up event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Track page view on load
    logEvent('view', document.body);
    
    // Track all clicks
    document.addEventListener('click', function(event) {
        logEvent('click', event.target);
    });
    
    // Track scroll events on panels
    document.addEventListener('wheel', function(event) {
        const target = event.target.closest('.scrollable-content');
        if (target) {
            logEvent('scroll', target);
        }
    });
    
    // Track mouse movement for hover effects
    let lastLogTime = 0;
    document.addEventListener('mousemove', function(event) {
        // Throttle logging to once per second to avoid flooding logs
        const now = Date.now();
        if (now - lastLogTime > 1000) {
            logEvent('mousemove', event.target);
            lastLogTime = now;
        }
    });
});

export { logEvent, eventLogs };