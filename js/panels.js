// Panels functionality for expandable left sidebar
import { initTextAnalysis } from './textAnalysis.js';

document.addEventListener('DOMContentLoaded', function() {
    // Get all panel elements
    const panels = document.querySelectorAll('.panel');
    const panelHeaders = document.querySelectorAll('.panel-header');
    
    // Set the first panel as active initially
    panels[0].classList.add('active');
    
    // Add click event listeners to each panel header
    panelHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const panelId = header.getAttribute('data-panel');
            togglePanel(panelId);
        });
    });
    
    // Function to toggle panels
    function togglePanel(panelId) {
        // Get all panel headers and content areas
        const headers = document.querySelectorAll('.panel-header');
        const contents = document.querySelectorAll('.panel-content');
        const allPanels = document.querySelectorAll('.panel');
        
        // Loop through all panels
        headers.forEach((header, index) => {
            const headerId = header.getAttribute('data-panel');
            const content = document.getElementById(`panel-content-${headerId}`);
            const panel = allPanels[index];
            
            if (headerId === panelId) {
                // If this is the clicked panel
                if (header.classList.contains('active')) {
                    // If already active, do nothing (keep it open)
                    return;
                } else {
                    // Add transition class for animation
                    content.classList.add('panel-transition');
                    panel.classList.add('panel-transition');
                    
                    // Activate this panel
                    header.classList.add('active');
                    content.classList.add('active');
                    panel.classList.add('active');
                    
                    // Update scrollable contents
                    ensureScrollableContent(content);
                    
                    // Reset transition class after animation completes
                    setTimeout(() => {
                        content.classList.remove('panel-transition');
                        panel.classList.remove('panel-transition');
                    }, 600);
                }
            } else {
                // Add transition class for animation
                if (content.classList.contains('active')) {
                    content.classList.add('panel-transition');
                    panel.classList.add('panel-transition');
                    
                    // Reset transition class after animation completes
                    setTimeout(() => {
                        content.classList.remove('panel-transition');
                        panel.classList.remove('panel-transition');
                    }, 600);
                }
                
                // Deactivate all other panels
                header.classList.remove('active');
                content.classList.remove('active');
                panel.classList.remove('active');
            }
        });
    }
    
    // Initial setup of scrollable wrappers
    setupPanelContents();
    
    // Embed CV in Panel 2
    loadCV();
    
    // Initialize Text Analysis in Panel 3
    initializeTextAnalysis();
    
    // Set up event logs in Panel 1
    initializeEventLogs();
});

// Make sure all active panels have scrollable-content wrappers
function setupPanelContents() {
    const activeContents = document.querySelectorAll('.panel-content');
    activeContents.forEach(content => {
        ensureScrollableContent(content);
    });
}

// Ensure panel content has scrollable wrapper
function ensureScrollableContent(panelContent) {
    // Check if the panel already has a scrollable-content wrapper
    if (!panelContent.querySelector('.scrollable-content')) {
        // Create a scrollable wrapper
        const scrollableWrapper = document.createElement('div');
        scrollableWrapper.className = 'scrollable-content';
        
        // Move all existing children to the wrapper
        while (panelContent.firstChild) {
            scrollableWrapper.appendChild(panelContent.firstChild);
        }
        
        // Add the wrapper to the panel content
        panelContent.appendChild(scrollableWrapper);
    }
}

// Initialize Event Logs in Panel 1
function initializeEventLogs() {
    const panel = document.getElementById('panel-content-1');
    if (!panel) return;
    
    // Clear any existing content
    panel.innerHTML = '';
    
    // Set explicit styles for the panel content
    panel.style.display = 'flex';
    panel.style.flexDirection = 'column';
    panel.style.height = '100%';
    panel.style.width = '100%';
    panel.style.overflow = 'hidden';
    
    // Create an event logs title/header
    const logsHeader = document.createElement('div');
    logsHeader.className = 'logs-header';
    logsHeader.style.marginBottom = '15px';
    logsHeader.innerHTML = `
        <h3 style="color: #eaeaea; margin: 0; font-size: 16px; font-weight: 500;">
            <i class="fas fa-history" style="margin-right: 8px; color: #7289da;"></i>
            Event History
        </h3>
    `;
    panel.appendChild(logsHeader);
    
    // Create logs container
    const logsContainer = document.createElement('div');
    logsContainer.id = 'event-logs-container';
    panel.appendChild(logsContainer);
}

// Initialize Text Analysis in Panel 3
function initializeTextAnalysis() {
    // Call the imported initTextAnalysis function from textAnalysis.js
    initTextAnalysis();
}

// Function to load CV into panel 2
function loadCV() {
    const cvPanel = document.getElementById('panel-content-2');
    if (!cvPanel) return;
    
    // Get or create scrollable container
    let scrollableContent = cvPanel.querySelector('.scrollable-content');
    if (!scrollableContent) {
        scrollableContent = document.createElement('div');
        scrollableContent.className = 'scrollable-content';
        cvPanel.appendChild(scrollableContent);
    }
    
    // Create a container for the embedded CV content
    const cvContainer = document.createElement('div');
    cvContainer.className = 'cv-container';
    
    // Add CV preview and full-screen link
    const cvPreview = document.createElement('div');
    cvPreview.className = 'cv-preview';
    cvPreview.innerHTML = `
        <div class="cv-header">
            <h3><a href="./resume/resume.pdf" target="_blank" class="cv-title-link">Curriculum Vitae</a></h3>
            <a href="./resume/resume.pdf" target="_blank" class="full-screen-link">
                <i class="fas fa-expand"></i> View Full Screen
            </a>
        </div>
    `;
    
    // Create CV embed (PDF only)
    const cvWrapper = document.createElement('div');
    cvWrapper.className = 'cv-wrapper';
    const cvEmbed = document.createElement('embed');
    cvEmbed.src = './resume/resume.pdf';
    cvEmbed.type = 'application/pdf';
    cvEmbed.className = 'cv-embed';
    // Simple fallback message
    const fallbackMessage = document.createElement('div');
    fallbackMessage.className = 'cv-fallback';
    fallbackMessage.innerHTML = `
        <p>Your browser doesn't support embedded PDFs. <a href="./resume/resume.pdf" target="_blank">Click here to view the CV</a>.</p>
    `;
    cvWrapper.appendChild(cvEmbed);
    cvWrapper.appendChild(fallbackMessage);
    cvPreview.appendChild(cvWrapper);
    cvContainer.appendChild(cvPreview);
    scrollableContent.appendChild(cvContainer);
}