// Main application logic
import { initSlideshow } from './slideshow.js';
import { initLoadingScreen } from './loader.js';
import { getPreloadedFrames } from './preloader.js';

document.addEventListener("DOMContentLoaded", function () {
    // Get elements
    const appContainer = document.getElementById("app-container");
    const loadingScreen = document.getElementById("loading-screen");
    const progressBar = document.getElementById("progress-bar");
    const loadingText = document.getElementById("loading-text");
    
    // Initialize the loading screen
    initLoadingScreen(loadFrames);
    
    // Load frames directly from the preloaded WebP files
    function loadFrames() {
        console.log("Starting to load preloaded frames");
        
        // Get paths for all preloaded frames
        const framePaths = getPreloadedFrames();
        const totalFrames = framePaths.length;
        console.log(`Found ${totalFrames} frames to load`);
        
        // Set up frame loading
        let framesLoaded = 0;
        const frames = [];
        
        // Update initial progress
        progressBar.style.width = "0%";
        loadingText.textContent = `0% Complete (0/${totalFrames} frames)`;
        
        // Load each frame with preloading for smooth playback
        loadFramesInBatches(framePaths, 0, frames, totalFrames);
    }
    
    // Function to load frames in smaller batches to prevent browser from freezing
    function loadFramesInBatches(framePaths, startIndex, frames, totalFrames, batchSize = 20) {
        const endIndex = Math.min(startIndex + batchSize, framePaths.length);
        
        // Load a batch of frames
        loadFrameBatch(framePaths, startIndex, endIndex, frames, totalFrames)
            .then(updatedFrames => {
                // Update progress
                const framesLoaded = updatedFrames.length;
                const progress = Math.round((framesLoaded / totalFrames) * 100);
                progressBar.style.width = progress + "%";
                loadingText.textContent = `${progress}% Complete (${framesLoaded}/${totalFrames} frames)`;
                
                // Check if we've loaded all frames
                if (endIndex >= framePaths.length) {
                    console.log("All frames loaded successfully");
                    
                    // Hide loading screen and show app
                    loadingScreen.style.display = "none";
                    appContainer.style.display = "flex";
                    
                    // Initialize slideshow with loaded frames
                    initSlideshow(updatedFrames);
                } else {
                    // Load the next batch (use setTimeout to prevent UI freezing)
                    setTimeout(() => {
                        loadFramesInBatches(framePaths, endIndex, updatedFrames, totalFrames, batchSize);
                    }, 0);
                }
            })
            .catch(error => {
                console.error("Error loading frames:", error);
                loadingText.textContent = "Error loading frames. Please check console for details.";
            });
    }
    
    // Load a batch of frames returning a promise
    function loadFrameBatch(framePaths, startIndex, endIndex, frames, totalFrames) {
        return new Promise((resolve) => {
            let currentIndex = startIndex;
            
            function loadNextFrame() {
                if (currentIndex >= endIndex) {
                    resolve(frames);
                    return;
                }
                
                const img = new Image();
                
                img.onload = function() {
                    frames.push(img.src);
                    currentIndex++;
                    loadNextFrame();
                };
                
                img.onerror = function() {
                    console.error(`Failed to load frame: ${framePaths[currentIndex]}`);
                    // Add null placeholder to maintain frame order
                    frames.push(null);
                    currentIndex++;
                    loadNextFrame();
                };
                
                // Set the image source to load it
                img.src = framePaths[currentIndex];
            }
            
            // Start loading the first frame in the batch
            loadNextFrame();
        });
    }
});