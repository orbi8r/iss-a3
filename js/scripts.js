document.addEventListener("DOMContentLoaded", function () {
    // Get elements
    const video = document.getElementById("source-video");
    const canvas = document.getElementById("hidden-canvas");
    const ctx = canvas.getContext("2d");
    const slideElement = document.getElementById("slide");
    const slideshow = document.getElementById("slideshow");
    const loadingScreen = document.getElementById("loading-screen");
    const progressBar = document.getElementById("progress-bar");
    const loadingText = document.getElementById("loading-text");
    const frameCounter = document.getElementById("frame-counter");
    const frames = [];
    let currentIndex = 0;
    let frameInterval = 0.5; // seconds; adjust for more/less frames (smaller = more frames)
    let totalFrames = 0;
    let framesLoaded = 0;

    // Load the video and handle errors
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
        const duration = video.duration;
        
        // Calculate timestamps for frame extraction
        const timestamps = [];
        for (let t = 0; t <= duration; t += frameInterval) {
            timestamps.push(parseFloat(t.toFixed(2)));
        }
        
        totalFrames = timestamps.length;
        console.log(`Will extract ${totalFrames} frames at ${frameInterval}s intervals`);
        
        // Initialize slideshow frame counter
        frameCounter.textContent = "Frame: 0/" + totalFrames;
        
        // Start extracting frames
        extractFrames(timestamps);
    });

    // Function to extract frames using Promise for better control
    function extractFrames(timestamps) {
        if (timestamps.length === 0) {
            // All frames extracted. Initialize slideshow.
            loadingScreen.style.display = "none";
            slideshow.style.display = "flex";
            showImage(0);
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

    function showImage(index) {
        slideElement.src = frames[index];
        currentIndex = index;
        frameCounter.textContent = `Frame: ${index + 1}/${frames.length}`;
    }

    // Add keyboard controls
    document.addEventListener("keydown", function(e) {
        if (e.key === "ArrowLeft") {
            prevImage();
        } else if (e.key === "ArrowRight") {
            nextImage();
        }
    });

    function prevImage() {
        if (!frames.length) return;
        const newIndex = (currentIndex - 1 + frames.length) % frames.length;
        showImage(newIndex);
    }

    function nextImage() {
        if (!frames.length) return;
        const newIndex = (currentIndex + 1) % frames.length;
        showImage(newIndex);
    }

    // Event listeners for navigation buttons
    document.getElementById("prev").addEventListener("click", prevImage);
    document.getElementById("next").addEventListener("click", nextImage);
});
