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
        
        // Create an array to hold all frames, pre-filled with null values
        const frames = new Array(totalFrames).fill(null);
        
        // Update initial progress
        progressBar.style.width = "0%";
        loadingText.textContent = `0% Complete (0/${totalFrames} frames)`;
        
        // Load frames in parallel with bigger batches
        loadFramesInParallel(framePaths, frames, totalFrames);
    }
    
    // Function to load frames in parallel while maintaining order
    function loadFramesInParallel(framePaths, frames, totalFrames, batchSize = 50) {
        let totalLoaded = 0;
        let batchesProcessing = 0;
        const maxConcurrentBatches = 4; // Limit concurrent batches to prevent overwhelming the browser
        
        // Process frames in batches
        function processBatch(startIndex) {
            const endIndex = Math.min(startIndex + batchSize, framePaths.length);
            batchesProcessing++;
            
            // Load all frames in this batch simultaneously
            const batchPromises = [];
            
            for (let i = startIndex; i < endIndex; i++) {
                // Create promise for each frame
                const promise = new Promise((resolve) => {
                    const img = new Image();
                    
                    img.onload = function() {
                        // Store the frame at its correct index position to maintain order
                        frames[i] = img.src;
                        totalLoaded++;
                        
                        // Update progress after each frame loads
                        const progress = Math.round((totalLoaded / totalFrames) * 100);
                        progressBar.style.width = progress + "%";
                        loadingText.textContent = `${progress}% Complete (${totalLoaded}/${totalFrames} frames)`;
                        
                        resolve();
                    };
                    
                    img.onerror = function() {
                        console.error(`Failed to load frame: ${framePaths[i]}`);
                        // Keep null at this position
                        totalLoaded++;
                        resolve();
                    };
                    
                    img.src = framePaths[i];
                });
                
                batchPromises.push(promise);
            }
            
            // When all frames in this batch are loaded
            Promise.all(batchPromises).then(() => {
                batchesProcessing--;
                
                // Start the next batch if there are more frames to load
                const nextBatchIndex = endIndex;
                if (nextBatchIndex < framePaths.length && batchesProcessing < maxConcurrentBatches) {
                    processBatch(nextBatchIndex);
                }
                
                // Check if all batches are complete
                if (totalLoaded >= totalFrames || (nextBatchIndex >= framePaths.length && batchesProcessing === 0)) {
                    // All frames have been loaded
                    console.log("All frames loaded successfully");
                    
                    // Clean up any null frames (failed loads)
                    const validFrames = frames.filter(frame => frame !== null);
                    
                    console.log(`Initializing slideshow with ${validFrames.length} frames`);
                    
                    // Hide loading screen and show app
                    loadingScreen.style.display = "none";
                    appContainer.style.display = "flex";
                    
                    // Initialize slideshow with loaded frames
                    initSlideshow(validFrames);
                }
            });
        }
        
        // Start initial batches
        for (let i = 0; i < maxConcurrentBatches; i++) {
            const startIndex = i * batchSize;
            if (startIndex < framePaths.length) {
                processBatch(startIndex);
            }
        }
    }
});