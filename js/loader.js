// Loading screen functionality
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
        
        // Start the loading animation
        startLoadingAnimation();
        
        // Now we can load the video after user interaction
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