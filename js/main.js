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
        loadingText.textContent = `Phase 1: 0% Complete (0/${totalFrames} frames) - Downloading`;
        
        // Two-phase loading system
        // Phase 1: Initial loading of all frames
        // Phase 2: Verification to ensure all frames are properly loaded
        loadFramesInParallel(framePaths, frames, totalFrames)
            .then(loadedFrames => {
                // After initial loading is complete, start verification phase
                verifyFramesLoaded(loadedFrames, totalFrames);
            })
            .catch(error => {
                console.error("Error during frame loading:", error);
                loadingText.textContent = "Error loading frames. Please check console for details.";
            });
    }
    
    // Function to verify all frames are fully loaded and ready
    function verifyFramesLoaded(frames, totalFrames) {
        const validFrames = frames.filter(frame => frame !== null);
        
        // Check if we have all frames
        if (validFrames.length < totalFrames * 0.98) { // Allow 2% margin for potentially corrupted frames
            console.error(`Only ${validFrames.length} out of ${totalFrames} frames were loaded successfully.`);
            loadingText.textContent = `Warning: Only ${validFrames.length} out of ${totalFrames} frames were loaded.`;
        }
        
        // Start verification phase
        loadingText.textContent = `Phase 2: Verifying ${validFrames.length} frames...`;
        progressBar.style.width = "0%";
        
        console.log("Beginning verification phase to ensure all frames are fully loaded");
        
        // Create actual Image objects for all frames to ensure they are ready
        const imageObjects = [];
        let verifiedCount = 0;
        
        // Verify in smaller batches to avoid memory issues
        const verifyBatchSize = 100;
        let currentBatch = 0;
        const totalBatches = Math.ceil(validFrames.length / verifyBatchSize);
        
        function verifyNextBatch() {
            const batchStart = currentBatch * verifyBatchSize;
            const batchEnd = Math.min(batchStart + verifyBatchSize, validFrames.length);
            
            if (batchStart >= validFrames.length) {
                // All batches verified
                console.log(`All ${imageObjects.length} frames verified and ready`);
                completeLoading(imageObjects);
                return;
            }
            
            const batchPromises = [];
            
            for (let i = batchStart; i < batchEnd; i++) {
                const img = new Image();
                const promise = new Promise((resolve) => {
                    img.onload = function() {
                        imageObjects[i] = img; // Store the actual image object
                        verifiedCount++;
                        
                        // Update verification progress
                        const progress = Math.round((verifiedCount / validFrames.length) * 100);
                        progressBar.style.width = progress + "%";
                        loadingText.textContent = `Phase 2: ${progress}% Verified (${verifiedCount}/${validFrames.length})`;
                        
                        resolve();
                    };
                    
                    img.onerror = function() {
                        console.error(`Verification failed for frame ${i}`);
                        resolve(); // Continue even if verification fails
                    };
                });
                
                img.src = validFrames[i]; // Load the image
                batchPromises.push(promise);
            }
            
            // When this batch is verified, move to the next batch
            Promise.all(batchPromises).then(() => {
                currentBatch++;
                setTimeout(verifyNextBatch, 10); // Small delay to prevent UI freezing
            });
        }
        
        // Start verification process
        verifyNextBatch();
    }
    
    // Finalize loading and initialize slideshow
    function completeLoading(verifiedFrames) {
        // Filter out any null/undefined frames
        const finalFrames = verifiedFrames.filter(frame => frame !== null && frame !== undefined);
        
        console.log(`Initializing slideshow with ${finalFrames.length} verified frames`);
        
        // Show completion message and finish loading
        loadingText.textContent = `Loading complete! ${finalFrames.length} frames ready.`;
        
        // Add a short delay before showing the app to ensure UI responsiveness
        setTimeout(() => {
            // Hide loading screen and show app
            loadingScreen.style.display = "none";
            appContainer.style.display = "flex";
            
            // Initialize slideshow with verified frames
            initSlideshow(finalFrames);
        }, 1000);
    }
    
    // Function to load frames in parallel while maintaining order
    function loadFramesInParallel(framePaths, frames, totalFrames, batchSize = 50) {
        return new Promise((resolveAll, rejectAll) => {
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
                            loadingText.textContent = `Phase 1: ${progress}% Complete (${totalLoaded}/${totalFrames} frames) - Downloading`;
                            
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
                        // All frames have been loaded in Phase 1
                        console.log("Phase 1 complete: All frames initially loaded");
                        resolveAll(frames);
                    }
                }).catch(error => {
                    console.error("Error in batch processing:", error);
                    if (batchesProcessing > 0) batchesProcessing--;
                    // Continue with next batches despite errors
                    const nextBatchIndex = endIndex;
                    if (nextBatchIndex < framePaths.length && batchesProcessing < maxConcurrentBatches) {
                        processBatch(nextBatchIndex);
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
        });
    }
});