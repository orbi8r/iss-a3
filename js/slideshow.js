// Slideshow functionality
let currentIndex = 0;
let framesArray = [];
let isPlaying = false;
let playDirection = 1; // 1 for forward, -1 for backward
let playInterval = null;
const playbackFPS = 60; // Frames per second for fast forward/rewind
const slideElement = document.getElementById("slide");
const frameCounter = document.getElementById("frame-counter");

// Initialize the slideshow with frames
export function initSlideshow(frames) {
    framesArray = frames;
    
    // Fix for the 2034th frame bug - ensure we don't exceed the actual frames available
    if (frames.length > 0) {
        // Ensure the frames array doesn't include any undefined/null frames
        framesArray = frames.filter(frame => frame);
    }
    
    // Initialize slideshow frame counter
    frameCounter.textContent = `Frame: 1/${framesArray.length}`;
    
    // Initialize the slider
    initializeSlider(framesArray.length);
    
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
}

// Show a specific image
export function showImage(index) {
    // Add safety check for the bug at the end of the video
    if (index < 0 || index >= framesArray.length) return;
    
    // Double check frame exists
    if (!framesArray[index]) {
        console.error(`Frame at index ${index} is undefined`);
        return;
    }
    
    slideElement.src = framesArray[index];
    currentIndex = index;
    frameCounter.textContent = `Frame: ${index + 1}/${framesArray.length}`;
    
    // Update slider if it exists
    const slider = document.getElementById('frame-slider');
    if (slider) slider.value = index;
}

// Go to previous image
export function prevImage() {
    if (!framesArray.length) return;
    
    let newIndex = currentIndex - 1;
    if (newIndex < 0) newIndex = framesArray.length - 1;
    
    showImage(newIndex);
}

// Go to next image
export function nextImage() {
    if (!framesArray.length) return;
    
    let newIndex = currentIndex + 1;
    if (newIndex >= framesArray.length) newIndex = 0;
    
    showImage(newIndex);
}

// Start continuous playback
function startPlayback(direction) {
    if (isPlaying) return;
    
    isPlaying = true;
    playDirection = direction;
    
    playInterval = setInterval(() => {
        if (direction === 1) {
            nextImage();
        } else {
            prevImage();
        }
    }, 1000 / playbackFPS);
}

// Stop continuous playback
function stopPlayback() {
    if (!isPlaying) return;
    
    isPlaying = false;
    clearInterval(playInterval);
    playInterval = null;
}

// Set up event listeners for navigation
function setupEventListeners() {
    // Add keyboard controls
    document.addEventListener("keydown", function(e) {
        if (e.key === "ArrowLeft") {
            prevImage();
        } else if (e.key === "ArrowRight") {
            nextImage();
        }
    });

    // Add wheel/scroll event for frame navigation
    document.addEventListener("wheel", function(e) {
        if (document.getElementById("loading-screen").style.display === "none") { // Only if loading is complete
            if (e.deltaY > 0) {
                nextImage(); // Scroll down - next frame
            } else {
                prevImage(); // Scroll up - previous frame
            }
            e.preventDefault(); // Prevent page scrolling
        }
    }, { passive: false });

    // Event listeners for navigation buttons with mousedown/mouseup for continuous playback
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");
    
    // Regular click for single frame navigation
    prevButton.addEventListener("click", prevImage);
    nextButton.addEventListener("click", nextImage);
    
    // Hold down for continuous playback
    prevButton.addEventListener("mousedown", function(e) {
        if (e.button === 0) { // Left mouse button
            startPlayback(-1);
        }
    });
    
    nextButton.addEventListener("mousedown", function(e) {
        if (e.button === 0) { // Left mouse button
            startPlayback(1);
        }
    });
    
    // Stop playback when mouse up or mouse leave
    const stopEvents = ["mouseup", "mouseleave"];
    stopEvents.forEach(event => {
        prevButton.addEventListener(event, stopPlayback);
        nextButton.addEventListener(event, stopPlayback);
    });
    
    // Also handle touch events for mobile
    prevButton.addEventListener("touchstart", function() {
        startPlayback(-1);
    });
    
    nextButton.addEventListener("touchstart", function() {
        startPlayback(1);
    });
    
    prevButton.addEventListener("touchend", stopPlayback);
    nextButton.addEventListener("touchend", stopPlayback);
}