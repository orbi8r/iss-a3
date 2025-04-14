// Main application logic
import { initSlideshow } from './slideshow.js';
import { initLoadingScreen } from './loader.js';
import { getPreloadedFrames, loadAllFramesParallel } from './preloader.js';

document.addEventListener("DOMContentLoaded", function () {
    // Get elements
    const appContainer = document.getElementById("app-container");
    const loadingScreen = document.getElementById("loading-screen");
    const progressBar = document.getElementById("progress-bar");
    const loadingText = document.getElementById("loading-text");
    
    // Initialize the loading screen
    initLoadingScreen(loadFrames);
    
    // Load frames in parallel using Web Workers
    function loadFrames() {
        console.log("Starting to load frames in parallel");
        
        // Get the total number of frames to load
        const framePaths = getPreloadedFrames();
        const totalFrames = framePaths.length;
        console.log(`Found ${totalFrames} frames to load`);
        
        // Set initial progress
        progressBar.style.width = "0%";
        loadingText.textContent = `0% Complete (0/${totalFrames} frames)`;
        
        // Start the parallel loading process
        const frameLoader = loadAllFramesParallel(
            // Progress callback
            (progress) => {
                const percent = Math.round(progress * 100);
                const framesLoaded = Math.round(progress * totalFrames);
                
                // Update UI
                progressBar.style.width = percent + "%";
                loadingText.textContent = `${percent}% Complete (${framesLoaded}/${totalFrames} frames)`;
            },
            // Completion callback
            (frames) => {
                console.log("All frames loaded successfully");
                
                // Ensure all frames are loaded before proceeding
                if (frameLoader.areAllFramesLoaded()) {
                    // Hide loading screen and show app
                    loadingScreen.style.display = "none";
                    appContainer.style.display = "flex";
                    
                    // Initialize slideshow with loaded frames
                    initSlideshow(frames);
                } else {
                    // Display error message if not all frames are loaded
                    loadingText.textContent = "Error: Not all frames could be loaded. Please refresh and try again.";
                    console.error("Failed to load all frames, can't proceed");
                }
            }
        );
    }
});