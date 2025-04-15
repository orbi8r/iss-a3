// Main application logic
import { initSlideshow, showImage, prevImage, nextImage } from './slideshow.js';
import { initLoadingScreen, startLoadingAnimation, updateLoadingProgress } from './loader.js';
import { initAudioPlayer, toggleMusic } from './audio.js';
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
    initAudioPlayer();

    // Set up audio toggle buttons for both screens
    const mainMusicToggle = document.getElementById('music-toggle');
    const loadingMusicToggle = document.getElementById('loading-music-toggle');
    
    if (mainMusicToggle) {
        mainMusicToggle.addEventListener('click', toggleMusic);
    }
    
    if (loadingMusicToggle) {
        loadingMusicToggle.addEventListener('click', toggleMusic);
    }

    // Initialize video and canvas
    video = document.getElementById("source-video");
    canvas = document.getElementById("hidden-canvas");
    context = canvas.getContext("2d");

    // Add start button to begin extraction
    const loadingContent = document.querySelector('.loading-content');
    const startButton = document.createElement('button');
    startButton.className = 'start-button';
    startButton.textContent = 'Start Loading';
    startButton.addEventListener('click', () => {
        startButton.remove(); // Remove button after click
        startTime = performance.now(); // Set loading start time
        initVideoExtraction(); // Start video extraction
        toggleMusic(); // Start playing music
    });
    loadingContent.appendChild(startButton);

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
        
        // Check for valid value before setting currentTime to avoid the non-finite error
        if (!isFinite(frameTime) || isNaN(frameTime)) {
            console.error('Invalid frame time calculated:', frameTime);
            console.log('Debug info:', { frameIndex, totalFrames, duration: video.duration });
            
            // Skip this frame or use fallback value
            frameIndex++;
            if (frameIndex < totalFrames) {
                setTimeout(extract, extractionInterval);
            } else {
                completeLoading();
            }
            return;
        }
        
        video.currentTime = frameTime;
        
        // Wait for the video to update to the new time
        video.addEventListener('seeked', function onSeeked() {
            // Draw the current frame to canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Convert canvas to image data URL
            const frameDataUrl = canvas.toDataURL('image/jpeg', 0.8);
            frames.push(frameDataUrl);
            
            // Update progress and show frame count
            const progress = Math.floor((frameIndex + 1) / totalFrames * 100);
            
            // Use the updateLoadingProgress function from loader.js
            updateLoadingProgress(frameIndex + 1, totalFrames);
            
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

// Ensure EST is always right-aligned and visually clear
function updateEstimatedTime(currentIndex, totalFrames) {
    const currentTime = performance.now();
    const elapsedTime = (currentTime - startTime) / 1000; // in seconds
    if (currentIndex > 0) {
        const timePerFrame = elapsedTime / currentIndex;
        const remainingFrames = totalFrames - currentIndex;
        const estimatedRemainingTime = remainingFrames * timePerFrame;
        const minutes = Math.floor(estimatedRemainingTime / 60);
        const seconds = Math.floor(estimatedRemainingTime % 60);
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        const estElem = document.getElementById('loading-est');
        if (estElem) {
            estElem.textContent = `EST: ${formattedTime}`;
            estElem.style.textAlign = 'right';
            estElem.style.fontWeight = 'bold';
        }
    }
}

// Animate the music panel from loading to main screen
function animateMusicPanelToMain() {
    const musicPanel = document.querySelector('.footer-music-loading');
    if (musicPanel) {
        musicPanel.classList.add('animate-to-main');
        // After animation, hide the loading music panel and show the main footer
        setTimeout(() => {
            musicPanel.style.display = 'none';
            const mainFooter = document.querySelector('.footer-section');
            if (mainFooter) mainFooter.style.opacity = '1';
        }, 1000); // Match CSS transition duration
    }
}

// Complete the loading process and show the main application
function completeLoading() {
    loadingComplete = true;
    animateMusicPanelToMain();
    
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
    currentFrame--;
    // Loop to the end if we go before the first frame
    if (currentFrame < 1) {
        currentFrame = totalFrames;
    }
    displayFrame(currentFrame);
}

// Go to the next frame
function nextFrame() {
    currentFrame++;
    // Loop to the beginning if we go past the last frame
    if (currentFrame > totalFrames) {
        currentFrame = 1;
    }
    displayFrame(currentFrame);
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