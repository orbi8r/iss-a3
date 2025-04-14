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
});