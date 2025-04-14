// Video frame extractor
// This module extracts webp frames from a video file during loading

// Function to extract frames from video
export async function extractFramesFromVideo(videoPath, totalFramesToExtract = 2033) {
    return new Promise((resolve, reject) => {
        console.log(`Starting to extract frames from video: ${videoPath}`);
        
        // Create video element to load the video
        const video = document.createElement('video');
        video.crossOrigin = "anonymous";
        video.src = videoPath;
        
        // Event handlers
        video.onloadedmetadata = function() {
            const duration = video.duration;
            const frameInterval = duration / totalFramesToExtract;
            const frames = [];
            
            console.log(`Video duration: ${duration}s, extracting ${totalFramesToExtract} frames`);
            
            // Create a canvas for frame extraction
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            
            // Set canvas size based on first frame
            video.addEventListener('loadeddata', function() {
                // Set canvas dimensions to match video
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                
                // Start frame extraction
                extractFrame(0);
            });
            
            // Function to extract a single frame
            function extractFrame(frameIndex) {
                if (frameIndex >= totalFramesToExtract) {
                    console.log(`Completed extracting ${frames.length} frames`);
                    resolve(frames);
                    return;
                }
                
                // Calculate the time position in the video
                const timePosition = frameIndex * frameInterval;
                
                // Seek to the time position
                video.currentTime = timePosition;
                
                // When the seek is complete, draw the frame
                video.onseeked = function() {
                    // Draw video frame to canvas
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    
                    // Convert canvas to WebP format
                    // Note: Quality set to 0.92 for good balance of quality and size
                    const webpDataUrl = canvas.toDataURL('image/webp', 0.92);
                    
                    // Add the frame to our collection
                    frames.push(webpDataUrl);
                    
                    // Update progress - can be used for loading progress updates
                    const progress = Math.round((frames.length / totalFramesToExtract) * 100);
                    
                    // Extract the next frame
                    extractFrame(frameIndex + 1);
                };
            }
        };
        
        // Handle errors
        video.onerror = function() {
            reject(new Error(`Failed to load video: ${videoPath}`));
        };
        
        // Start loading the video
        video.load();
    });
}

// Function to get a preloaded frame URL (for backward compatibility)
export function getFrameURL(index, frameCount = 2033) {
    // This function maintains compatibility with the old preloader
    // But it's not used directly as we now load frames from video
    const frameNumber = index.toString().padStart(4, '0');
    return `./frames/frame_${frameNumber}.webp`;
}