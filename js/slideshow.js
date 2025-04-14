// Slideshow functionality
let currentIndex = 0;
let framesArray = [];
const slideElement = document.getElementById("slide");
const frameCounter = document.getElementById("frame-counter");

// Initialize the slideshow with frames
export function initSlideshow(frames) {
    framesArray = frames;
    
    // Initialize slideshow frame counter
    frameCounter.textContent = "Frame: 0/" + frames.length;
    
    // Initialize the slider
    initializeSlider(frames.length);
    
    // Show first frame
    showImage(0);
    
    // Set up event listeners
    setupEventListeners();
}

// Initialize the slider element
function initializeSlider(frameCount) {
    const slideshow = document.getElementById("slideshow");
    const sliderContainer = document.createElement('div');
    sliderContainer.id = 'slider-container';
    
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.id = 'frame-slider';
    slider.min = 0;
    slider.max = frameCount - 1;
    slider.value = 0;
    
    slider.addEventListener('input', function() {
        const frameIndex = parseInt(this.value);
        showImage(frameIndex);
    });
    
    sliderContainer.appendChild(slider);
    slideshow.appendChild(sliderContainer);
}

// Show a specific image
export function showImage(index) {
    if (index < 0 || index >= framesArray.length) return;
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
    const newIndex = (currentIndex - 1 + framesArray.length) % framesArray.length;
    showImage(newIndex);
}

// Go to next image
export function nextImage() {
    if (!framesArray.length) return;
    const newIndex = (currentIndex + 1) % framesArray.length;
    showImage(newIndex);
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

    // Event listeners for navigation buttons
    document.getElementById("prev").addEventListener("click", prevImage);
    document.getElementById("next").addEventListener("click", nextImage);
}