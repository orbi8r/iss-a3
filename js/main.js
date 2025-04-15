// Main application logic
import { initSlideshow, showImage, prevImage, nextImage } from './slideshow.js';
import { initLoadingScreen, startLoadingAnimation } from './loader.js';
import { initAudioPlayer, toggleMusic, initAudio } from './audio.js';
import { initTextAnalysis } from './textAnalysis.js';
// No need to explicitly import eventTracker as it sets up its own listeners on DOMContentLoaded

// Global variables
let video, canvas, context;
let totalFrames = 0;
let frameSlider, prevBtn, nextBtn;
let currentFrame = 1;
let frames = [];
let startTime;
let loadingComplete = false;

document.addEventListener("DOMContentLoaded", function () {
    initApp();
});

// Initialize audio, video extraction, and UI
function initApp() {
    // Initialize audio controls
    initAudio();

    // Set up audio toggle buttons for both screens
    const mainMusicToggle = document.getElementById('music-toggle');
    const loadingMusicToggle = document.getElementById('loading-music-toggle');
    
    mainMusicToggle.addEventListener('click', toggleMusic);
    loadingMusicToggle.addEventListener('click', toggleMusic);

    // Initialize video and canvas
    video = document.getElementById("source-video");
    canvas = document.getElementById("hidden-canvas");
    context = canvas.getContext("2d");

    // Set loading start time
    startTime = performance.now();

    // Initialize video once it's loaded
    video.addEventListener("loadeddata", () => {
        initVideoExtraction();
    });

    // Add mouse move event for hover effects
    document.addEventListener("mousemove", handleMouseMove);
}

// Initialize the hover effect that follows mouse movement
function handleMouseMove(e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calculate the center of the viewport
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Calculate how far the mouse is from the center as a percentage
    const distanceX = (mouseX - centerX) / centerX;
    const distanceY = (mouseY - centerY) / centerY;
    
    // Apply the effect to panels with a subtle rotation
    const maxRotation = 2; // Maximum rotation in degrees
    document.querySelectorAll('.panel, .footer-section, .content-frame, .scroll-control, .footer-music-loading').forEach(element => {
        // Check if mouse is over the element for stronger effect
        const rect = element.getBoundingClientRect();
        const isHovered = (
            mouseX >= rect.left && 
            mouseX <= rect.right && 
            mouseY >= rect.top && 
            mouseY <= rect.bottom
        );
        
        // Apply stronger effect if hovered
        const multiplier = isHovered ? 2 : 1;
        
        // Set CSS custom properties for the hover effect
        element.style.setProperty('--rotateY', (distanceX * maxRotation * multiplier) + 'deg');
        element.style.setProperty('--rotateX', (distanceY * -maxRotation * multiplier) + 'deg');
    });
}

// Initialize the video extraction process
function initVideoExtraction() {
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Calculate total frames
    const fps = 30; // Assuming 30fps
    totalFrames = Math.floor(video.duration * fps);
    
    // Update UI with total frames info
    document.getElementById('frame-counter').textContent = `Frame: 1/${totalFrames}`;
    
    // Extract frames
    extractFrames();
}

// Extract frames from the video
function extractFrames() {
    const extractionInterval = 100; // Time between extractions in ms
    let frameIndex = 0;
    
    const extract = () => {
        // Set video to the current time
        const frameTime = (frameIndex / totalFrames) * video.duration;
        video.currentTime = frameTime;
        
        // Wait for the video to update to the new time
        video.addEventListener('seeked', function onSeeked() {
            // Draw the current frame to canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Convert canvas to image data URL
            const frameDataUrl = canvas.toDataURL('image/jpeg', 0.8);
            frames.push(frameDataUrl);
            
            // Update progress
            const progress = Math.floor((frameIndex + 1) / totalFrames * 100);
            document.getElementById('progress-bar').style.width = `${progress}%`;
            document.getElementById('loading-text').textContent = `${progress}% Complete`;
            
            // Estimate remaining time
            updateEstimatedTime(frameIndex, totalFrames);
            
            // Remove event listener to avoid duplicates
            video.removeEventListener('seeked', onSeeked);
            
            // Continue to next frame or finish
            frameIndex++;
            if (frameIndex < totalFrames) {
                setTimeout(extract, extractionInterval);
            } else {
                completeLoading();
            }
        }, { once: true });
    };
    
    // Start extraction
    extract();
}

// Calculate and display estimated loading time
function updateEstimatedTime(currentIndex, totalFrames) {
    const currentTime = performance.now();
    const elapsedTime = (currentTime - startTime) / 1000; // in seconds
    
    // Calculate estimated total time based on progress so far
    if (currentIndex > 0) {
        const timePerFrame = elapsedTime / currentIndex;
        const remainingFrames = totalFrames - currentIndex;
        const estimatedRemainingTime = remainingFrames * timePerFrame;
        
        // Format the time
        const minutes = Math.floor(estimatedRemainingTime / 60);
        const seconds = Math.floor(estimatedRemainingTime % 60);
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('loading-est').textContent = `EST: ${formattedTime}`;
    }
}

// Complete the loading process and show the main application
function completeLoading() {
    loadingComplete = true;
    
    // Create a reference to the music control in loading screen
    const musicPanel = document.querySelector('.footer-music-loading');
    
    // Animate the music panel to its final position
    musicPanel.classList.add('animate-to-main');
    
    // Fade out loading screen
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.transition = 'opacity 1s ease';
    loadingScreen.style.opacity = '0';
    
    // Show the app after a delay to allow for transitions
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        const appContainer = document.getElementById('app-container');
        appContainer.style.display = 'flex';
        
        // Initialize the UI controls
        initControls();
        
        // Display the first frame
        displayFrame(currentFrame);
    }, 1000);
}

// Initialize UI controls
function initControls() {
    frameSlider = document.getElementById('frame-slider');
    prevBtn = document.getElementById('prev');
    nextBtn = document.getElementById('next');
    
    // Set up slider
    frameSlider.min = 1;
    frameSlider.max = totalFrames;
    frameSlider.value = 1;
    
    // Add event listeners
    frameSlider.addEventListener('input', handleSliderChange);
    prevBtn.addEventListener('click', prevFrame);
    nextBtn.addEventListener('click', nextFrame);
    
    // Add keyboard support
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Initialize scroll controls with panel-specific behavior
    initScrollBehavior();
}

// Initialize scroll behavior for panels
function initScrollBehavior() {
    // Get all panel contents that need scrolling
    const panelContents = document.querySelectorAll('.panel-content.active');
    
    // Add scroll event listener to document
    document.addEventListener('wheel', (event) => {
        // Check if mouse is over any panel
        let isOverPanel = false;
        let targetPanel = null;
        
        // Check each panel to see if mouse is over it
        panelContents.forEach(panel => {
            const rect = panel.getBoundingClientRect();
            if (
                event.clientX >= rect.left && 
                event.clientX <= rect.right && 
                event.clientY >= rect.top && 
                event.clientY <= rect.bottom
            ) {
                isOverPanel = true;
                targetPanel = panel;
            }
        });
        
        if (isOverPanel && targetPanel) {
            // If over a panel, scroll that panel
            event.preventDefault();
            targetPanel.scrollTop += event.deltaY;
        } else {
            // If not over a panel, control the slideshow
            event.preventDefault();
            if (event.deltaY > 0) {
                nextFrame();
            } else {
                prevFrame();
            }
        }
    }, { passive: false });
}

// Handle slider changes
function handleSliderChange() {
    currentFrame = parseInt(frameSlider.value);
    displayFrame(currentFrame);
}

// Display the specified frame
function displayFrame(frameIndex) {
    // Update the current frame number (1-based index)
    document.getElementById('frame-counter').textContent = `Frame: ${frameIndex}/${totalFrames}`;
    
    // Update slider position
    frameSlider.value = frameIndex;
    
    // Display the frame
    const slide = document.getElementById('slide');
    slide.src = frames[frameIndex - 1]; // Adjust for 0-based array
}

// Go to the previous frame
function prevFrame() {
    if (currentFrame > 1) {
        currentFrame--;
        displayFrame(currentFrame);
    }
}

// Go to the next frame
function nextFrame() {
    if (currentFrame < totalFrames) {
        currentFrame++;
        displayFrame(currentFrame);
    }
}

// Handle keyboard navigation with arrow keys
function handleKeyboardNavigation(event) {
    switch (event.key) {
        case 'ArrowLeft':
            prevFrame();
            break;
        case 'ArrowRight':
            nextFrame();
            break;
    }
}

// Export functions for use in other modules
export { displayFrame };