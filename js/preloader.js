// Preloaded frames for faster loading
export function getPreloadedFrames() {
    // Create an array to store all frame paths
    const frames = [];
    
    // We know we have 2033 frames (0000 to 2032) based on previous implementations
    for (let i = 0; i < 2033; i++) {
        // Format frame number with leading zeros (0000, 0001, etc.)
        const frameNumber = i.toString().padStart(4, '0');
        frames.push(`frames/frame_${frameNumber}.webp`);
    }
    
    console.log(`Prepared ${frames.length} frame paths for preloading`);
    return frames;
}
