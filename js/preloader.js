// Preloader module for managing frame loading
const TOTAL_FRAMES = 2033; // We know we have 2033 frames (0-2032)
const NUM_WORKERS = 4; // Number of parallel workers to use

// Store loaded frames
let loadedFrames = new Array(TOTAL_FRAMES).fill(null);
let framesToLoad = []; // Array to store all frame paths

// Return paths for all frames that need to be loaded
export function getPreloadedFrames() {
    // Create an array to store all frame paths
    framesToLoad = [];
    
    // We know we have 2033 frames (0000 to 2032) based on previous implementations
    for (let i = 0; i < TOTAL_FRAMES; i++) {
        // Format frame number with leading zeros (0000, 0001, etc.)
        const frameNumber = i.toString().padStart(4, '0');
        // Use proper relative path from root of website
        framesToLoad.push(`./frames/frame_${frameNumber}.webp`);
    }
    
    console.log(`Prepared ${framesToLoad.length} frame paths for preloading`);
    return framesToLoad;
}

// Load all frames using multiple web workers for parallel processing
export function loadAllFramesParallel(progressCallback, completionCallback) {
    console.log(`Starting parallel frame loading with ${NUM_WORKERS} workers`);
    
    // Reset the loaded frames array
    loadedFrames = new Array(TOTAL_FRAMES).fill(null);
    
    // Track progress for each worker
    const workerProgress = new Array(NUM_WORKERS).fill(0);
    const workers = [];
    let completedWorkers = 0;
    
    // Calculate frame ranges for each worker
    const framesPerWorker = Math.ceil(TOTAL_FRAMES / NUM_WORKERS);
    
    // Create and start each worker
    for (let i = 0; i < NUM_WORKERS; i++) {
        const startIndex = i * framesPerWorker;
        const endIndex = Math.min(startIndex + framesPerWorker, TOTAL_FRAMES);
        
        // Create a web worker
        const worker = new Worker('./js/frameLoader.js');
        workers.push(worker);
        
        // Handle messages from the worker
        worker.onmessage = function(e) {
            const { workerIndex, progress, loadedFrames: newFrames, complete } = e.data;
            
            // Update progress for this worker
            if (progress !== undefined) {
                workerProgress[workerIndex] = progress;
                
                // Calculate overall progress (average of all workers)
                const overallProgress = workerProgress.reduce((sum, p) => sum + p, 0) / NUM_WORKERS;
                
                // Call the progress callback
                if (progressCallback) {
                    progressCallback(overallProgress);
                }
            }
            
            // Process newly loaded frames
            if (newFrames && newFrames.length > 0) {
                newFrames.forEach(frame => {
                    if (frame && frame.url) {
                        loadedFrames[frame.index] = frame.url;
                    }
                });
            }
            
            // Handle worker completion
            if (complete) {
                completedWorkers++;
                
                // If all workers are done, call the completion callback
                if (completedWorkers === NUM_WORKERS) {
                    // Check if all frames are loaded
                    const allLoaded = loadedFrames.every(frame => frame !== null);
                    
                    if (allLoaded) {
                        console.log("All frames successfully loaded!");
                        if (completionCallback) {
                            completionCallback(loadedFrames);
                        }
                    } else {
                        console.error("Some frames failed to load");
                        // Try to recover by assigning the previous frame to any missing frames
                        for (let i = 0; i < loadedFrames.length; i++) {
                            if (loadedFrames[i] === null && i > 0) {
                                console.warn(`Replacing missing frame ${i} with previous frame`);
                                loadedFrames[i] = loadedFrames[i - 1];
                            }
                        }
                        
                        // Fallback for the first frame if it's missing
                        if (loadedFrames[0] === null && loadedFrames.some(f => f !== null)) {
                            const firstValidFrame = loadedFrames.find(f => f !== null);
                            loadedFrames[0] = firstValidFrame;
                        }
                        
                        // Now check again
                        const allFramesNow = loadedFrames.every(frame => frame !== null);
                        
                        if (allFramesNow) {
                            console.log("Recovered from missing frames, proceeding with available frames");
                            if (completionCallback) {
                                completionCallback(loadedFrames);
                            }
                        } else {
                            console.error("Critical frame loading failure, can't proceed");
                        }
                    }
                }
            }
        };
        
        // Start the worker with its assigned frames
        worker.postMessage({
            framePaths: framesToLoad,
            startIndex,
            endIndex,
            workerIndex: i
        });
        
        console.log(`Worker ${i} started, handling frames ${startIndex} to ${endIndex-1}`);
    }
    
    return {
        // Return a function to check if all frames are loaded
        areAllFramesLoaded: () => {
            return loadedFrames.every(frame => frame !== null);
        },
        // Return the current loaded frames
        getLoadedFrames: () => {
            return [...loadedFrames];
        }
    };
}
