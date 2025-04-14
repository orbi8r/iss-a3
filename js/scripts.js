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
    let totalFrames = 0;
    let framesLoaded = 0;
    
    // FPS calculation
    const videoFPS = 30; // We'll attempt to determine this from the video

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
        loadVideo();
    });

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
        
        // Initialize slideshow frame counter
        frameCounter.textContent = "Frame: 0/" + totalFrames;
        
        // Start extracting frames
        extractFrames(timestamps);
    }

    // Function to extract frames using Promise for better control
    function extractFrames(timestamps) {
        if (timestamps.length === 0) {
            // All frames extracted. Initialize slideshow.
            loadingScreen.style.display = "none";
            slideshow.style.display = "flex";
            
            // Initialize the slider now that we know how many frames
            initializeSlider(frames.length);
            
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

    // Initialize the slider element
    function initializeSlider(frameCount) {
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

    function showImage(index) {
        if (index < 0 || index >= frames.length) return;
        slideElement.src = frames[index];
        currentIndex = index;
        frameCounter.textContent = `Frame: ${index + 1}/${frames.length}`;
        
        // Update slider if it exists
        const slider = document.getElementById('frame-slider');
        if (slider) slider.value = index;
    }

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
        if (loadingScreen.style.display === "none") { // Only if loading is complete
            if (e.deltaY > 0) {
                nextImage(); // Scroll down - next frame
            } else {
                prevImage(); // Scroll up - previous frame
            }
            e.preventDefault(); // Prevent page scrolling
        }
    }, { passive: false });

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
    
    // Cute loading animation function
    function startLoadingAnimation() {
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
});
