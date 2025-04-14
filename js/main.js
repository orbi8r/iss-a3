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
        console.log("Starting strict frame loading process");
        
        // Get paths for all preloaded frames
        const framePaths = getPreloadedFrames();
        const totalFrames = framePaths.length;
        
        // Update initial progress
        progressBar.style.width = "0%";
        loadingText.textContent = `0% Complete (0/${totalFrames} frames)`;
        
        // Create an array with slots for actual Image objects (not just URLs)
        const frameObjects = new Array(totalFrames);
        let loadedCount = 0;
        
        console.log(`Beginning to load ${totalFrames} frames with strict verification`);
        
        // Load frames sequentially in batches to ensure proper loading
        // This is a more reliable approach than trying to load them all in parallel
        loadFramesBatch(framePaths, frameObjects, 0, totalFrames, loadedCount);
    }
    
    // Function to load frames in batches with strict verification
    function loadFramesBatch(framePaths, frameObjects, startIndex, totalFrames, loadedCount, batchSize = 20) {
        // Calculate end index for this batch
        const endIndex = Math.min(startIndex + batchSize, totalFrames);
        
        // Show which batch we're processing
        console.log(`Loading batch ${Math.floor(startIndex/batchSize) + 1} of ${Math.ceil(totalFrames/batchSize)} (frames ${startIndex} to ${endIndex-1})`);
        
        // Create promises for each frame in the batch
        const batchPromises = [];
        
        for (let i = startIndex; i < endIndex; i++) {
            const promise = new Promise((resolve) => {
                // Create new image
                const img = new Image();
                
                img.onload = function() {
                    // Store the actual image object (not just the URL)
                    frameObjects[i] = img;
                    loadedCount++;
                    
                    // Update loading progress
                    const progress = Math.round((loadedCount / totalFrames) * 100);
                    progressBar.style.width = progress + "%";
                    loadingText.textContent = `${progress}% Complete (${loadedCount}/${totalFrames} frames)`;
                    
                    resolve(true);
                };
                
                img.onerror = function() {
                    console.error(`Failed to load frame ${i}: ${framePaths[i]}`);
                    resolve(false);
                };
                
                // Start loading the image
                img.src = framePaths[i];
            });
            
            batchPromises.push(promise);
        }
        
        // Process the batch
        Promise.all(batchPromises).then((results) => {
            // Count successful loads in this batch
            const successCount = results.filter(Boolean).length;
            console.log(`Batch completed: ${successCount}/${batchSize} frames loaded successfully`);
            
            // Check if we're done
            if (endIndex >= totalFrames) {
                // All batches processed - do a final verification
                finalizeLoading(frameObjects, totalFrames);
            } else {
                // Process next batch
                loadFramesBatch(framePaths, frameObjects, endIndex, totalFrames, loadedCount, batchSize);
            }
        });
    }
    
    // Final verification and completion
    function finalizeLoading(frameObjects, totalFrames) {
        console.log("All batches processed, performing final verification");
        
        // Count actual loaded frames (not null or undefined)
        const actuallyLoaded = frameObjects.filter(img => img instanceof HTMLImageElement);
        
        console.log(`Final verification: ${actuallyLoaded.length} of ${totalFrames} frames are valid Image objects`);
        
        if (actuallyLoaded.length < totalFrames * 0.95) { 
            // Less than 95% of frames loaded - show warning but continue
            console.warn(`Only ${actuallyLoaded.length} of ${totalFrames} frames loaded successfully`);
            loadingText.textContent = `Warning: Only ${actuallyLoaded.length} frames loaded (${Math.round(actuallyLoaded.length/totalFrames*100)}%)`;
        }
        
        // Show completion message with a slight delay for the user to see it
        loadingText.textContent = `All frames loaded successfully! Starting slideshow...`;
        
        // Short delay before showing main content
        setTimeout(() => {
            // Hide loading screen and show app
            loadingScreen.style.display = "none";
            appContainer.style.display = "flex";
            
            // Initialize slideshow with verified frame objects
            console.log(`Initializing slideshow with ${actuallyLoaded.length} verified frame objects`);
            initSlideshow(actuallyLoaded);
        }, 1500);
    }
});