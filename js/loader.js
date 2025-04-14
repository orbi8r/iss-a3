// Loading screen functionality
import { extractFramesFromVideo } from './videoFrameExtractor.js';

// Initialize loading screen with time estimation
export function initLoadingScreen(onStartCallback) {
    // Create start button for user interaction
    const startButton = document.createElement('button');
    startButton.id = 'start-loading-btn';
    startButton.textContent = 'Load Frames';
    startButton.classList.add('start-button');
    document.querySelector('.loading-content').appendChild(startButton);
    
    // Add estimated time remaining element
    const etaDisplay = document.createElement('div');
    etaDisplay.id = 'eta-display';
    etaDisplay.textContent = 'Estimated time: Calculating...';
    document.querySelector('.loading-content').appendChild(etaDisplay);
    
    startButton.addEventListener('click', function() {
        // Remove the button after click
        startButton.remove();
        
        // Start the loading animation
        startLoadingAnimation();
        
        // Now we can start loading frames after user interaction
        if (onStartCallback) onStartCallback();
    });
}

// Create the loading animation
export function startLoadingAnimation() {
    const loadingAnimation = document.createElement('div');
    loadingAnimation.id = 'loading-animation';
    
    // Create film strip elements
    const filmStrip = document.createElement('div');
    filmStrip.className = 'film-strip';
    
    // Add film holes
    const filmTrack = document.createElement('div');
    filmTrack.className = 'film-track';
    
    for (let i = 0; i < 4; i++) {
        const hole = document.createElement('div');
        hole.className = 'film-hole';
        filmTrack.appendChild(hole);
    }
    
    // Add film frames section
    const filmFrames = document.createElement('div');
    filmFrames.className = 'film-frames';
    
    // Add camera lens elements
    const cameraLens = document.createElement('div');
    cameraLens.className = 'camera-lens';
    
    const lensInner = document.createElement('div');
    lensInner.className = 'lens-inner';
    
    const lensReflect = document.createElement('div');
    lensReflect.className = 'lens-reflect';
    
    const lensIris = document.createElement('div');
    lensIris.className = 'lens-iris';
    
    // Add reel elements
    const reelLeft = document.createElement('div');
    reelLeft.className = 'reel reel-left';
    
    const reelRight = document.createElement('div');
    reelRight.className = 'reel reel-right';
    
    // Assemble the structure
    lensInner.appendChild(lensReflect);
    lensInner.appendChild(lensIris);
    cameraLens.appendChild(lensInner);
    
    filmStrip.appendChild(filmTrack);
    filmStrip.appendChild(filmFrames);
    filmStrip.appendChild(cameraLens);
    filmStrip.appendChild(reelLeft);
    filmStrip.appendChild(reelRight);
    
    loadingAnimation.appendChild(filmStrip);
    document.querySelector('.loading-content').prepend(loadingAnimation);
}

// Process video and extract frames with ETA calculation
export async function processVideoFrames(progressCallback) {
    try {
        // Track time for ETA calculation
        const startTime = performance.now();
        let lastUpdateTime = startTime;
        let lastProgress = 0;
        
        // Video path
        const videoPath = './video/WebVideo.mp4';
        
        // Extract frames from video with progress tracking
        const extractedFrames = await extractFramesFromVideo(videoPath, 2033);
        
        // Process each frame with progress updates
        const frames = [];
        
        for (let i = 0; i < extractedFrames.length; i++) {
            // Store the frame
            frames.push(extractedFrames[i]);
            
            // Calculate progress
            const progress = Math.round((i + 1) / extractedFrames.length * 100);
            
            // Only update UI every 1% or 500ms to avoid excessive updates
            const currentTime = performance.now();
            if (progress > lastProgress || (currentTime - lastUpdateTime) > 500) {
                // Calculate ETA
                if (progress > 0) {
                    const elapsedTime = currentTime - startTime;
                    const estimatedTotalTime = elapsedTime / progress * 100;
                    const remainingTime = estimatedTotalTime - elapsedTime;
                    
                    // Format time remaining
                    const etaSeconds = Math.ceil(remainingTime / 1000);
                    let etaText = '';
                    
                    if (etaSeconds < 60) {
                        etaText = `${etaSeconds} seconds remaining`;
                    } else {
                        const minutes = Math.floor(etaSeconds / 60);
                        const seconds = etaSeconds % 60;
                        etaText = `${minutes}m ${seconds}s remaining`;
                    }
                    
                    // Update ETA display
                    const etaDisplay = document.getElementById('eta-display');
                    if (etaDisplay) {
                        etaDisplay.textContent = etaText;
                    }
                }
                
                // Update progress bar through callback
                if (progressCallback) {
                    progressCallback(progress);
                }
                
                lastUpdateTime = currentTime;
                lastProgress = progress;
            }
        }
        
        // Update ETA to complete when done
        const etaDisplay = document.getElementById('eta-display');
        if (etaDisplay) {
            etaDisplay.textContent = 'Loading complete!';
        }
        
        return frames;
    } catch (error) {
        console.error('Error processing video frames:', error);
        throw error;
    }
}