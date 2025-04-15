// Loading screen functionality
import { toggleMusic } from './audio.js';

// Global variable to track loading progress
let loadingStuckTimeout;
let loadingStarted = false;

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
    
    // Add pulse animation ONLY to the EST element, not other text elements
    const loadingEst = document.getElementById('loading-est');
    
    // Remove any existing animation from EST before adding the new one
    loadingEst.style.animation = '';
    
    // Only add the pulse effect to the EST element
    loadingEst.style.animation = 'pulse 2s infinite';
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
    
    // If progress has advanced beyond 0%, clear the stuck timeout
    if (progress > 0 && loadingStuckTimeout) {
        clearTimeout(loadingStuckTimeout);
        loadingStuckTimeout = null;
    }
}

// Function to create and display warning message
function showLoadingStuckWarning() {
    // Check if warning already exists
    if (document.getElementById('loading-stuck-warning')) return;
    
    const warningElement = document.createElement('div');
    warningElement.id = 'loading-stuck-warning';
    warningElement.innerHTML = `
        <div class="warning-icon"><i class="fas fa-exclamation-triangle"></i></div>
        <div class="warning-message">
            <h3>Loading appears to be stuck</h3>
            <p>If progress remains at 0% for more than 10 seconds, please try refreshing the page.</p>
            <button id="refresh-page-btn">Refresh Page</button>
        </div>
    `;
    
    // Add styling
    warningElement.style.position = 'absolute';
    warningElement.style.top = '20px';
    warningElement.style.left = '50%';
    warningElement.style.transform = 'translateX(-50%)';
    warningElement.style.backgroundColor = 'rgba(220, 53, 69, 0.9)';
    warningElement.style.color = 'white';
    warningElement.style.padding = '15px 20px';
    warningElement.style.borderRadius = '10px';
    warningElement.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
    warningElement.style.zIndex = '1000';
    warningElement.style.display = 'flex';
    warningElement.style.alignItems = 'center';
    warningElement.style.maxWidth = '90%';
    warningElement.style.backdropFilter = 'blur(10px)';
    warningElement.style.border = '1px solid rgba(255, 255, 255, 0.1)';
    
    // Style the icon
    const warningIcon = warningElement.querySelector('.warning-icon');
    warningIcon.style.fontSize = '24px';
    warningIcon.style.marginRight = '15px';
    warningIcon.style.color = '#FFDD57';
    
    // Style the refresh button
    const refreshButton = warningElement.querySelector('#refresh-page-btn');
    refreshButton.style.backgroundColor = 'white';
    refreshButton.style.color = '#DC3545';
    refreshButton.style.border = 'none';
    refreshButton.style.padding = '8px 15px';
    refreshButton.style.borderRadius = '5px';
    refreshButton.style.marginTop = '10px';
    refreshButton.style.cursor = 'pointer';
    refreshButton.style.fontWeight = 'bold';
    
    // Add refresh button click handler
    refreshButton.addEventListener('click', () => {
        window.location.reload();
    });
    
    // Add to loading screen
    document.getElementById('loading-screen').appendChild(warningElement);
    
    // Add some animation to make it noticeable
    warningElement.animate([
        { opacity: 0, transform: 'translate(-50%, -20px)' },
        { opacity: 1, transform: 'translate(-50%, 0)' }
    ], {
        duration: 500,
        easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
    });
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
        
        // Set a timeout to check if loading gets stuck at 0%
        loadingStarted = true;
        loadingStuckTimeout = setTimeout(() => {
            // Check if progress is still at 0%
            const progressBar = document.getElementById('progress-bar');
            const currentWidth = parseFloat(progressBar.style.width) || 0;
            
            if (currentWidth === 0) {
                showLoadingStuckWarning();
            }
        }, 10000); // Check after 10 seconds
        
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