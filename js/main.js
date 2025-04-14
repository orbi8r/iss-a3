// Main application logic
import { initSlideshow } from './slideshow.js';
import { initLoadingScreen, processVideoFrames } from './loader.js';
import { initTextAnalysis } from './textAnalysis.js';
import { initAudioPlayer } from './audio.js'; // Import audio player

document.addEventListener("DOMContentLoaded", function () {
    // Get elements
    const appContainer = document.getElementById("app-container");
    const loadingScreen = document.getElementById("loading-screen");
    const progressBar = document.getElementById("progress-bar");
    const loadingText = document.getElementById("loading-text");
    
    // Initialize audio player (will start playing on user interaction)
    initAudioPlayer();
    
    // Initialize the loading screen
    initLoadingScreen(startVideoProcessing);
    
    // Initialize CV panel with embedded PDF
    initCVPanel();
    
    // Initialize Text Analysis panel
    initTextAnalysis();
    
    // Process video and extract frames
    async function startVideoProcessing() {
        console.log("Starting video processing");
        
        try {
            // Process video frames with progress updates
            const frames = await processVideoFrames((progress) => {
                // Update progress UI
                progressBar.style.width = progress + "%";
                loadingText.textContent = `${progress}% Complete`;
            });
            
            console.log(`Successfully extracted ${frames.length} frames from video`);
            
            // Hide loading screen and show app
            loadingScreen.style.display = "none";
            appContainer.style.display = "flex";
            
            // Initialize slideshow with extracted frames
            initSlideshow(frames);
        } catch (error) {
            console.error("Error processing video:", error);
            loadingText.textContent = "Error processing video. Please try again.";
        }
    }
    
    // Function to initialize the CV panel with embedded PDF
    function initCVPanel() {
        const cvPanel = document.getElementById('panel-content-2');
        if (cvPanel) {
            // Create iframe to embed the PDF
            const iframe = document.createElement('iframe');
            iframe.src = 'resume/resume.pdf';
            iframe.width = '100%';
            iframe.height = '100%';
            iframe.style.border = 'none';
            
            // Add iframe to the panel
            cvPanel.appendChild(iframe);
        }
    }
});