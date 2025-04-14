// Panels functionality for expandable left sidebar
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
                    // Activate this panel
                    header.classList.add('active');
                    content.classList.add('active');
                    panel.classList.add('active');
                }
            } else {
                // Deactivate all other panels
                header.classList.remove('active');
                content.classList.remove('active');
                panel.classList.remove('active');
            }
        });
    }
    
    // Embed CV in Panel 2
    loadCV();
});

// Function to load CV into panel 2
function loadCV() {
    const cvPanel = document.getElementById('panel-content-2');
    if (!cvPanel) return;
    
    // Create CV embed
    const cvEmbed = document.createElement('embed');
    cvEmbed.src = './resume/resume.pdf';
    cvEmbed.type = 'application/pdf';
    cvEmbed.className = 'cv-embed';
    cvEmbed.style.width = '100%';
    cvEmbed.style.height = '100%';
    cvEmbed.style.borderRadius = '10px';
    
    // Add fallback message for browsers that don't support embedding PDFs
    const fallbackMessage = document.createElement('p');
    fallbackMessage.className = 'cv-fallback';
    fallbackMessage.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i> 
        Your browser doesn't support embedded PDFs. 
        <a href="./resume/resume.pdf" target="_blank">Click here to view the CV</a>.
    `;
    fallbackMessage.style.textAlign = 'center';
    fallbackMessage.style.padding = '20px';
    fallbackMessage.style.color = '#a0a8c0';
    
    // Create a wrapper div
    const embedWrapper = document.createElement('div');
    embedWrapper.className = 'cv-wrapper';
    embedWrapper.style.height = '100%';
    embedWrapper.style.backgroundColor = '#262a33';
    embedWrapper.style.borderRadius = '10px';
    embedWrapper.style.overflow = 'hidden';
    
    // Add objects to the panel
    embedWrapper.appendChild(cvEmbed);
    embedWrapper.appendChild(fallbackMessage);
    cvPanel.appendChild(embedWrapper);
}