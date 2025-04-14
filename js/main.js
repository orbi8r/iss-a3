// Main application logic
import { initSlideshow, showImage, prevImage, nextImage } from './slideshow.js';
import { initLoadingScreen, startLoadingAnimation } from './loader.js';

document.addEventListener("DOMContentLoaded", function () {
    // Get elements
    const video = document.getElementById("source-video");
    const canvas = document.getElementById("hidden-canvas");
    const ctx = canvas.getContext("2d");
    const slideshow = document.getElementById("slideshow");
    const loadingScreen = document.getElementById("loading-screen");
    const progressBar = document.getElementById("progress-bar");
    const loadingText = document.getElementById("loading-text");
    const frames = [];
    let totalFrames = 0;
    let framesLoaded = 0;
    
    // FPS calculation
    const videoFPS = 30; // We'll attempt to determine this from the video

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
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
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

    function extractAllFrames() {
        // Calculate frame time step based on FPS (assuming 30fps if not detected)
        const frameTime = 1 / videoFPS;
        video.pause();
        
        // Create an array of all frame times
        const timestamps = [];
        for (let time = 0; time < video.duration; time += frameTime) {
            timestamps.push(parseFloat(time.toFixed(3)));
        }
        
        totalFrames = timestamps.length;
        console.log(`Will extract ${totalFrames} frames at ${frameTime}s intervals (${videoFPS} fps)`);
        
        // Start extracting frames
        extractFrames(timestamps);
    }

    // Function to extract frames using Promise for better control
    function extractFrames(timestamps) {
        if (timestamps.length === 0) {
            // All frames extracted. Initialize slideshow.
            loadingScreen.style.display = "none";
            slideshow.style.display = "flex";
            
            // Initialize the slideshow with the frames
            initSlideshow(frames);
            
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
                    // Store frame as data URL image
                    frames.push(canvas.toDataURL("image/jpeg", 0.8)); // Added quality parameter
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
                // Process next timestamp - slight delay to avoid overloading
                setTimeout(() => extractFrames(timestamps), 10);
            })
            .catch(err => {
                console.error("Frame extraction error:", err);
                // Continue anyway to be resilient
                setTimeout(() => extractFrames(timestamps), 10);
            });
    }
});