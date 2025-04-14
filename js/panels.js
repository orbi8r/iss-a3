// Panels functionality for expandable left sidebar
document.addEventListener('DOMContentLoaded', function() {
    // Get all panel headers
    const panelHeaders = document.querySelectorAll('.panel-header');
    
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
        
        // Loop through all panels
        headers.forEach(header => {
            const headerId = header.getAttribute('data-panel');
            const content = document.getElementById(`panel-content-${headerId}`);
            
            if (headerId === panelId) {
                // If this is the clicked panel
                if (header.classList.contains('active')) {
                    // If already active, do nothing (keep it open)
                    return;
                } else {
                    // Activate this panel
                    header.classList.add('active');
                    content.classList.add('active');
                }
            } else {
                // Deactivate all other panels
                header.classList.remove('active');
                content.classList.remove('active');
            }
        });
    }
});