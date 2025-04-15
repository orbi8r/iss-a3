// Slideshow functionality
let currentIndex = 0;
let framesArray = [];
let isPlaying = false;
let playDirection = 1; // 1 for forward, -1 for backward
let playInterval = null;
let buttonHoldTimer = null;
const holdThreshold = 200; // 0.2 seconds in milliseconds
const playbackFPS = 60; // Frames per second for fast forward/rewind
const slideElement = document.getElementById("slide");
const frameCounter = document.getElementById("frame-counter");

// Initialize the slideshow with frames
export function initSlideshow(frames) {
    // Fix for the 2034th frame bug - ensure we stop at 2033 frames
    if (frames.length > 2033) {
        console.log(`Limiting frames from ${frames.length} to 2033 frames to fix last frame bug`);
        framesArray = frames.slice(0, 2033);
    } else {
        framesArray = frames;
    }
    
    // Initialize slideshow frame counter
    frameCounter.textContent = `Frame: 1/${framesArray.length}`;
    
    // Initialize the slider
    initializeSlider(framesArray.length);
    
    // Preload all frames upfront
    preloadAllFrames();
    
    // Show first frame
    showImage(0);
    
    // Set up event listeners
    setupEventListeners();
}

// Initialize the slider element
function initializeSlider(frameCount) {
    const slider = document.getElementById('frame-slider');
    slider.max = frameCount - 1;
    slider.value = 0;
    
    slider.addEventListener('input', function() {
        const frameIndex = parseInt(this.value);
        showImage(frameIndex);
    });
    
    // Add keyboard event listeners for fast navigation
    document.addEventListener('keydown', function(event) {
        // Only process keyboard events when loading is complete
        if (document.getElementById("loading-screen").style.display === "none") {
            handleKeyboardNavigation(event);
        }
    });
}

// Handle keyboard navigation with support for holding keys
let keyIsDown = {
    ArrowLeft: false,
    ArrowRight: false
};
let keyHoldTimer = null;

function handleKeyboardNavigation(event) {
    const key = event.key;
    
    // Only process arrow keys
    if (key !== 'ArrowLeft' && key !== 'ArrowRight') return;
    
    // Prevent default to avoid scrolling page
    event.preventDefault();
    
    // If key is already down, don't process again
    if (keyIsDown[key]) return;
    
    // Mark key as down
    keyIsDown[key] = true;
    
    // Initial frame change on key press
    if (key === 'ArrowLeft') {
        prevImage();
    } else if (key === 'ArrowRight') {
        nextImage();
    }
    
    // Start hold timer for continuous playback
    clearTimeout(keyHoldTimer);
    keyHoldTimer = setTimeout(() => {
        if (keyIsDown['ArrowLeft']) {
            startPlayback(-1);
        } else if (keyIsDown['ArrowRight']) {
            startPlayback(1);
        }
    }, holdThreshold);
}

// Preload all frames upfront to ensure they're always available
function preloadAllFrames() {
    console.log(`Preloading all ${framesArray.length} frames to keep in memory`);
    
    // Create Image objects for all frames to ensure they stay loaded
    const imagePromises = [];
    
    for (let i = 0; i < framesArray.length; i++) {
        if (framesArray[i]) {
            const img = new Image();
            
            // Create a promise for each image load
            const promise = new Promise((resolve) => {
                img.onload = () => resolve(i);
                img.onerror = () => {
                    console.error(`Failed to load frame ${i}`);
                    resolve(i); // Resolve anyway to continue
                };
            });
            
            img.src = framesArray[i];
            // Replace the data URL with the Image object
            framesArray[i] = img;
            imagePromises.push(promise);
        }
    }
    
    // Log when all images are fully loaded
    Promise.all(imagePromises).then(() => {
        console.log("All frames are fully preloaded and permanently kept in memory");
    });
}

// Show a specific image
export function showImage(index) {
    // If we're at the edge of the frames, loop around when needed
    if (index < 0) {
        index = framesArray.length - 1; // Loop to end when going past the beginning
    } else if (index >= framesArray.length) {
        index = 0; // Loop to beginning when going past the end
    }
    
    // Double check frame exists
    if (!framesArray[index]) {
        console.error(`Frame at index ${index} is undefined`);
        return;
    }
    
    // Display the preloaded image
    if (framesArray[index] instanceof HTMLImageElement) {
        slideElement.src = framesArray[index].src;
    } else {
        // Fallback for frames that might still be data URLs
        slideElement.src = framesArray[index];
    }
    
    currentIndex = index;
    frameCounter.textContent = `Frame: ${index + 1}/${framesArray.length}`;
    
    // Update slider if it exists
    const slider = document.getElementById('frame-slider');
    if (slider) slider.value = index;
}

// Go to previous image
export function prevImage() {
    if (!framesArray.length) return;
    
    // Simply call showImage with the previous index
    // The showImage function now handles looping properly
    showImage(currentIndex - 1);
}

// Go to next image
export function nextImage() {
    if (!framesArray.length) return;
    
    // Simply call showImage with the next index
    // The showImage function now handles looping properly
    showImage(currentIndex + 1);
}

// Start continuous playback - improved implementation using requestAnimationFrame for smoother playback
function startPlayback(direction) {
    // If already playing in the same direction, don't restart
    if (isPlaying && playDirection === direction) return;
    
    // If playing in a different direction, stop current playback first
    if (isPlaying) {
        stopPlayback();
    }
    
    isPlaying = true;
    playDirection = direction;
    
    let lastTimestamp = 0;
    const frameInterval = 1000 / playbackFPS; // Time between frames in ms
    
    // Use requestAnimationFrame for smoother playback
    function playbackFrame(timestamp) {
        if (!isPlaying) return; // Stop if playback has been canceled
        
        // Check if enough time has passed to show next frame
        if (!lastTimestamp || (timestamp - lastTimestamp) >= frameInterval) {
            lastTimestamp = timestamp;
            
            // Show next/prev frame based on direction
            if (direction === 1) {
                nextImage();
            } else {
                prevImage();
            }
        }
        
        // Continue the animation loop
        playInterval = requestAnimationFrame(playbackFrame);
    }
    
    // Start the animation loop immediately with the first frame
    if (direction === 1) {
        nextImage();
    } else {
        prevImage();
    }
    
    // Continue with subsequent frames via animation frame
    playInterval = requestAnimationFrame(playbackFrame);
    
    console.log(`Started ${direction === 1 ? 'forward' : 'backward'} playback at ${playbackFPS} fps`);
}

// Stop continuous playback
function stopPlayback() {
    if (!isPlaying) return;
    
    isPlaying = false;
    
    // Cancel animation frame if using requestAnimationFrame
    if (playInterval) {
        cancelAnimationFrame(playInterval);
        playInterval = null;
    }
    
    console.log('Stopped playback');
}

// Clear any pending hold timer
function clearHoldTimer() {
    if (buttonHoldTimer) {
        clearTimeout(buttonHoldTimer);
        buttonHoldTimer = null;
    }
}

// Set up event listeners for navigation
function setupEventListeners() {
    // Remove the duplicate keydown event listener from here since we now handle it in initializeSlider
    // with improved hold functionality

    // Add wheel/scroll event for frame navigation - restoring original behavior
    document.addEventListener("wheel", function(e) {
        if (document.getElementById("loading-screen").style.display === "none") { // Only if loading is complete
            if (e.deltaY > 0) {
                nextImage(); // Scroll down - next frame (original behavior)
            } else {
                prevImage(); // Scroll up - previous frame (original behavior)
            }
            e.preventDefault(); // Prevent page scrolling
        }
    }, { passive: false });

    // Add keyup event to handle releasing arrow keys
    document.addEventListener("keyup", function(e) {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            // Mark key as no longer down
            keyIsDown[e.key] = false;
            
            // Stop any playback that was triggered by this key
            stopPlayback();
            clearTimeout(keyHoldTimer);
        }
    });

    // Event listeners for navigation buttons with mousedown/mouseup for continuous playback
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");
    
    // Track if the button was held long enough to trigger continuous playback
    let wasButtonHeld = false;
    
    // Hold down handling for left button
    prevButton.addEventListener("mousedown", function(e) {
        if (e.button === 0) { // Left mouse button
            wasButtonHeld = false;
            
            // Start a timer to detect a hold
            clearHoldTimer();
            buttonHoldTimer = setTimeout(() => {
                wasButtonHeld = true;
                startPlayback(-1);
            }, holdThreshold);
        }
    });
    
    // Hold down handling for right button
    nextButton.addEventListener("mousedown", function(e) {
        if (e.button === 0) { // Left mouse button
            wasButtonHeld = false;
            
            // Start a timer to detect a hold
            clearHoldTimer();
            buttonHoldTimer = setTimeout(() => {
                wasButtonHeld = true;
                startPlayback(1);
            }, holdThreshold);
        }
    });
    
    // Handle click events (for when button wasn't held)
    prevButton.addEventListener("click", function(e) {
        if (!wasButtonHeld) {
            prevImage();
        }
    });
    
    nextButton.addEventListener("click", function(e) {
        if (!wasButtonHeld) {
            nextImage();
        }
    });
    
    // Stop playback and clear timers when mouse up or mouse leave
    const stopEvents = ["mouseup", "mouseleave"];
    stopEvents.forEach(event => {
        prevButton.addEventListener(event, function() {
            clearHoldTimer();
            stopPlayback();
        });
        
        nextButton.addEventListener(event, function() {
            clearHoldTimer();
            stopPlayback();
        });
    });
    
    // Also handle touch events for mobile
    prevButton.addEventListener("touchstart", function(e) {
        e.preventDefault(); // Prevent default touch behavior
        wasButtonHeld = false;
        
        // Start a timer to detect a hold
        clearHoldTimer();
        buttonHoldTimer = setTimeout(() => {
            wasButtonHeld = true;
            startPlayback(-1);
        }, holdThreshold);
    });
    
    nextButton.addEventListener("touchstart", function(e) {
        e.preventDefault(); // Prevent default touch behavior
        wasButtonHeld = false;
        
        // Start a timer to detect a hold
        clearHoldTimer();
        buttonHoldTimer = setTimeout(() => {
            wasButtonHeld = true;
            startPlayback(1);
        }, holdThreshold);
    });
    
    // Handle touch end for mobile
    prevButton.addEventListener("touchend", function() {
        clearHoldTimer();
        if (!wasButtonHeld) {
            prevImage();
        }
        stopPlayback();
    });
    
    nextButton.addEventListener("touchend", function() {
        clearHoldTimer();
        if (!wasButtonHeld) {
            nextImage();
        }
        stopPlayback();
    });
}