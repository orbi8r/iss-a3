// Loading screen functionality
import { toggleMusic } from './audio.js';

// Initialize loading screen components
document.addEventListener('DOMContentLoaded', function() {
    // Get loading screen elements
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.getElementById('progress-bar');
    const loadingText = document.getElementById('loading-text');
    const musicPanel = document.querySelector('.footer-music-loading');
    
    // Initialize loading animations with camera animation
    createFilmStripAnimation(); // Bring back the camera animation
    startLoadingAnimation();
});

// Simulate loading progress before extraction begins
function startLoadingAnimation() {
    // Show initial loading state
    const progressBar = document.getElementById('progress-bar');
    const loadingText = document.getElementById('loading-text');
    
    // Set random initial progress just to show animation
    let progress = 0;
    progressBar.style.width = `${progress}%`;
    loadingText.textContent = `${progress}% Complete`;
    
    // Update the loading EST with a placeholder
    document.getElementById('loading-est').textContent = 'EST: --:--';
    
    // Add pulse animation to loading text elements only (not blue rectangle)
    const loadingContent = document.querySelector('.loading-content');
    
    // Remove any existing animation before adding the new one
    loadingContent.style.animation = '';
    
    // Only add the pulse effect to the text elements
    const textElements = loadingContent.querySelectorAll('h2, #loading-text, #loading-est');
    textElements.forEach(el => {
        el.style.animation = 'pulse 2s infinite';
    });
}

// Export functions
export { startLoadingAnimation };

// Update the loading screen with frame information
export function updateLoadingProgress(framesLoaded, totalFrames) {
    const progress = Math.round((framesLoaded / totalFrames) * 100);
    const progressBar = document.getElementById('progress-bar');
    const loadingText = document.getElementById('loading-text');
    
    // Update progress bar
    progressBar.style.width = `${progress}%`;
    
    // Update text to show both percentage and frame count
    loadingText.textContent = `${progress}% Complete (${framesLoaded}/${totalFrames} frames)`;
}

export function initLoadingScreen(onStartCallback) {
    // Create start button for user interaction
    const startButton = document.createElement('button');
    startButton.id = 'start-extraction-btn';
    startButton.textContent = 'Start Frame Extraction';
    startButton.classList.add('start-button');
    document.querySelector('.loading-content').appendChild(startButton);
    
    startButton.addEventListener('click', function() {
        // Remove the button after click
        startButton.remove();
        
        // Make sure the camera animation is displayed if it wasn't already
        if (!document.getElementById('loading-animation')) {
            createFilmStripAnimation();
        }
        
        // Start the loading animation
        startLoadingAnimation();
        
        // Ensure music starts playing when extraction begins
        // This will use the already initialized audio player from main.js
        toggleMusic();
        
        // Now we can load the video after user interaction
        if (onStartCallback) onStartCallback();
    });
}

// Create the film strip loading animation
export function createFilmStripAnimation() {
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