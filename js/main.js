// Main application logic
import { initSlideshow, showImage, prevImage, nextImage } from './slideshow.js';
import { initLoadingScreen, startLoadingAnimation } from './loader.js';

document.addEventListener("DOMContentLoaded", function () {
    // Get elements
    const video = document.getElementById("source-video");
    const canvas = document.getElementById("hidden-canvas");
    const ctx = canvas.getContext("2d");
    const appContainer = document.getElementById("app-container");
    const loadingScreen = document.getElementById("loading-screen");
    const progressBar = document.getElementById("progress-bar");
    const loadingText = document.getElementById("loading-text");
    const frames = [];
    let totalFrames = 0;
    let framesLoaded = 0;
    
    // Configuration for optimization
    const videoFPS = 30;
    const resolutionScale = 1.0; // 1.0 = full resolution, 0.5 = half resolution, etc.
    const imageQuality = 0.9; // Higher quality for WebP (0.0 to 1.0)
    
    // Initialize the loading screen
    initLoadingScreen(loadVideo);
    
    // Load the video and handle errors
    function loadVideo() {
        video.addEventListener("error", function(e) {
            console.error("Video error:", e);
            loadingText.textContent = "Error loading video. Please check console for details.";
        });

        // Make sure the video loads
        video.load();

        // After metadata, set canvas dimensions and start extracting frames
        video.addEventListener("loadedmetadata", function () {
            console.log("Video metadata loaded. Duration:", video.duration);
            
            // Scale canvas based on resolution scale
            canvas.width = video.videoWidth * resolutionScale;
            canvas.height = video.videoHeight * resolutionScale;
            
            // Now we can safely call play() after user interaction
            video.muted = true; // Mute the video to further help with autoplay
            
            const playPromise = video.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Video playback started successfully
                    extractAllFrames();
                }).catch(error => {
                    // Auto-play was prevented
                    console.error("Play was prevented:", error);
                    // Provide a fallback method
                    extractAllFrames();
                });
            }
        });
    }

    // Sequential frame extraction with improved reliability
    function extractAllFrames() {
        // Calculate frame time step based on FPS
        const frameTime = 1 / videoFPS;
        video.pause();
        
        // Create an array of all frame times
        const timestamps = [];
        for (let time = 0; time < video.duration; time += frameTime) {
            timestamps.push(parseFloat(time.toFixed(3)));
        }
        
        totalFrames = timestamps.length;
        console.log(`Will extract ${totalFrames} frames at ${frameTime}s intervals (${videoFPS} fps) using single-channel loading`);
        
        // Start extracting frames
        extractFrames(timestamps);
    }

    // Function to extract frames using Promise for better control
    function extractFrames(timestamps) {
        if (timestamps.length === 0) {
            // All frames extracted. Initialize slideshow.
            console.log("All frames extracted successfully. Starting slideshow...");
            loadingScreen.style.display = "none";
            appContainer.style.display = "flex";
            
            // Filter out any null frames
            const validFrames = frames.filter(frame => frame !== null);
            console.log(`Initializing slideshow with ${validFrames.length} frames`);
            
            // Initialize the slideshow with the frames
            initSlideshow(validFrames);
            
            return;
        }
        
        const time = timestamps.shift();
        
        // Update progress
        framesLoaded++;
        const progress = Math.round((framesLoaded / totalFrames) * 100);
        progressBar.style.width = progress + "%";
        loadingText.textContent = `${progress}% Complete (${framesLoaded}/${totalFrames} frames)`;
        
        // Create a promise to handle the seeking and frame capture
        const framePromise = new Promise((resolve, reject) => {
            // Set up one-time event handler for when seeking is complete
            const seekHandler = function() {
                video.removeEventListener("seeked", seekHandler);
                try {
                    // Draw video frame to canvas
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    
                    // Store frame as data URL image - use WebP for better compression
                    const frameData = canvas.toDataURL("image/webp", imageQuality);
                    frames.push(frameData);
                    
                    resolve();
                } catch (err) {
                    console.error("Error capturing frame at time " + time, err);
                    reject(err);
                }
            };
            
            video.addEventListener("seeked", seekHandler);
            
            // If seeking takes too long, we'll time out
            setTimeout(() => {
                video.removeEventListener("seeked", seekHandler);
                reject(new Error("Timeout seeking to " + time));
            }, 5000);
            
            // Seek to desired time
            video.currentTime = time;
        });
        
        // Process the next frame after this one is done
        framePromise
            .then(() => {
                // Process next timestamp without delay for speed
                extractFrames(timestamps);
            })
            .catch(err => {
                console.error("Frame extraction error:", err);
                // Add null placeholder to maintain frame order
                frames.push(null);
                // Continue anyway to be resilient
                extractFrames(timestamps);
            });
    }
});