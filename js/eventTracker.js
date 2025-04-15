// Event tracking functionality (Q2)
let eventLogs = [];

// Function to track wholesome message changes
export function updateWholesomeMessage(message) {
    logEvent('message_change', { type: 'wholesome', content: message });
}

// Function to log events to both console and panel
function logEvent(type, target) {
    const timestamp = new Date().toISOString();
    let targetType;
    
    // Handle when target is an object with custom data
    if (target && typeof target === 'object' && target.type) {
        targetType = `${target.type}: ${target.content?.substring(0, 20)}...`;
    } else {
        targetType = getElementType(target);
    }
    
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
    if (element.id === 'music-toggle' || element.id === 'loading-music-toggle') return 'music toggle';
    if (element.classList.contains('start-button')) return 'start button';
    
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
        
        // Get or create event logs container
        let logsContainer = scrollableContent.querySelector('.event-logs-container');
        if (!logsContainer) {
            logsContainer = document.createElement('div');
            logsContainer.className = 'event-logs-container';
            scrollableContent.appendChild(logsContainer);
        }
        
        // Create formatted HTML from logs
        const logsHtml = eventLogs.map(log => `<div class="log-entry">${log}</div>`).join('');
        logsContainer.innerHTML = `<div class="event-logs">${logsHtml}</div>`;
        
        // Auto-scroll to bottom of logs
        logsContainer.scrollTop = logsContainer.scrollHeight;
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
        // Find the closest scrollable parent
        let scrollableParent = null;
        let element = event.target;
        
        while (element && !scrollableParent) {
            if (element.classList && 
                (element.classList.contains('scrollable-content') || 
                 element.classList.contains('event-logs-container') ||
                 element.classList.contains('results-section'))) {
                scrollableParent = element;
            }
            element = element.parentElement;
        }
        
        if (scrollableParent) {
            // Only log once in a while to avoid flooding logs
            if (Math.random() < 0.1) { // 10% chance to log scroll events
                logEvent('scroll', scrollableParent);
            }
        } else {
            // If scrolling in main area, log as slideshow scroll
            if (Math.random() < 0.1) { // 10% chance to log scroll events
                logEvent('slideshow_scroll', event.target);
            }
        }
    }, { passive: true });
    
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
    
    // Track music toggle
    const musicToggles = [
        document.getElementById('music-toggle'),
        document.getElementById('loading-music-toggle')
    ];
    
    musicToggles.forEach(toggle => {
        if (toggle) {
            toggle.addEventListener('click', function() {
                logEvent('music_toggle', toggle);
            });
        }
    });
    
    // Track when loading completes
    window.addEventListener('load', function() {
        logEvent('page_loaded', document.body);
    });
});

export { logEvent, eventLogs };