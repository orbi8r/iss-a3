import cv2
import os
import time
from PIL import Image
import numpy as np
import sys
from pathlib import Path


def extract_frames_from_video(
    video_path, output_dir, fps=30, quality=90, resolution_scale=1.0
):
    """
    Extract frames from a video file and save them as WebP images.

    Parameters:
    - video_path: Path to the video file
    - output_dir: Directory to save the frames
    - fps: Frames per second to extract
    - quality: WebP quality (0-100)
    - resolution_scale: Scale factor for resolution (1.0 = original size)
    """
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)

    # Open the video file
    video = cv2.VideoCapture(video_path)

    # Check if video opened successfully
    if not video.isOpened():
        print(f"Error: Could not open video file {video_path}")
        return

    # Get video properties
    total_frames = int(video.get(cv2.CAP_PROP_FRAME_COUNT))
    video_fps = video.get(cv2.CAP_PROP_FPS)
    video_duration = total_frames / video_fps
    frame_time = 1 / fps

    # Get video dimensions
    width = int(video.get(cv2.CAP_PROP_FRAME_WIDTH) * resolution_scale)
    height = int(video.get(cv2.CAP_PROP_FRAME_HEIGHT) * resolution_scale)

    print(f"Video Duration: {video_duration:.2f} seconds")
    print(f"Original Video FPS: {video_fps}")
    print(f"Extracting at: {fps} FPS")
    print(f"Output Resolution: {width}x{height}")

    # Create timestamps array (same as in JavaScript)
    timestamps = []
    for time_point in np.arange(0, video_duration, frame_time):
        timestamps.append(round(time_point, 3))

    total_frames_to_extract = len(timestamps)
    print(f"Will extract {total_frames_to_extract} frames")

    # Progress tracking
    frames_extracted = 0
    start_time = time.time()
    last_progress_update = start_time

    # Limit to 2033 frames (as done in the website to fix the bug)
    if total_frames_to_extract > 2033:
        print(
            f"Limiting frames from {total_frames_to_extract} to 2033 frames to fix the last frame bug"
        )
        timestamps = timestamps[:2033]
        total_frames_to_extract = 2033

    # Extract frames
    for i, timestamp in enumerate(timestamps):
        # Set the frame position
        video.set(cv2.CAP_PROP_POS_MSEC, timestamp * 1000)

        # Read the frame
        success, frame = video.read()

        if success:
            # Resize the frame if needed
            if resolution_scale != 1.0:
                frame = cv2.resize(frame, (width, height))

            # Convert from BGR to RGB (OpenCV uses BGR, PIL uses RGB)
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            # Create PIL Image
            pil_image = Image.fromarray(frame_rgb)

            # Save as WebP
            output_file = os.path.join(output_dir, f"frame_{i:04d}.webp")
            pil_image.save(output_file, "WEBP", quality=quality)

            frames_extracted += 1

            # Update progress every second
            current_time = time.time()
            if current_time - last_progress_update >= 1.0:
                progress = (frames_extracted / total_frames_to_extract) * 100
                elapsed_time = current_time - start_time
                frames_per_second = (
                    frames_extracted / elapsed_time if elapsed_time > 0 else 0
                )
                eta = (
                    (total_frames_to_extract - frames_extracted) / frames_per_second
                    if frames_per_second > 0
                    else 0
                )

                print(
                    f"Progress: {progress:.1f}% ({frames_extracted}/{total_frames_to_extract}) | "
                    f"Speed: {frames_per_second:.1f} fps | ETA: {eta:.1f} seconds"
                )

                last_progress_update = current_time
        else:
            print(f"Failed to extract frame at timestamp {timestamp}")

    # Release the video
    video.release()

    elapsed_time = time.time() - start_time
    print(f"\nExtraction complete!")
    print(f"Total frames extracted: {frames_extracted}")
    print(f"Time taken: {elapsed_time:.2f} seconds")

    # Calculate total size of the WebP files
    total_size_bytes = sum(
        os.path.getsize(os.path.join(output_dir, f))
        for f in os.listdir(output_dir)
        if f.endswith(".webp")
    )
    total_size_mb = total_size_bytes / (1024 * 1024)

    print(f"Total size of WebP files: {total_size_mb:.2f} MB")

    return frames_extracted


def create_html_preloader(frames_dir, output_file="preloader.js"):
    """
    Create a JavaScript file that preloads all the WebP images.
    This can be used instead of extracting frames from the video at runtime.
    """
    frame_files = sorted([f for f in os.listdir(frames_dir) if f.endswith(".webp")])

    if not frame_files:
        print("No WebP files found in the frames directory.")
        return

    js_content = """// Preloaded frames for faster loading
export function getPreloadedFrames() {
    return [
"""

    for frame_file in frame_files:
        js_content += f'        "{frames_dir}/{frame_file}",\n'

    js_content += """    ];
}
"""

    with open(output_file, "w") as f:
        f.write(js_content)

    print(f"Preloader JavaScript file created: {output_file}")
    print(f"This file contains paths to {len(frame_files)} preloaded frames.")
    print(
        "You can import this file in your main.js and use getPreloadedFrames() instead of extracting frames from video."
    )


if __name__ == "__main__":
    # Paths
    video_path = "video/WebVideo.mp4"
    frames_dir = "frames"

    # Get the absolute path
    script_dir = Path(__file__).parent
    video_path = script_dir / video_path
    frames_dir = script_dir / frames_dir

    # Settings (match the JavaScript settings)
    fps = 30
    quality = 90  # JavaScript uses 0.9 which is 90 in PIL
    resolution_scale = 1.0

    # Extract frames
    frames_count = extract_frames_from_video(
        video_path=str(video_path),
        output_dir=str(frames_dir),
        fps=fps,
        quality=quality,
        resolution_scale=resolution_scale,
    )

    if frames_count > 0:
        # Create preloader JavaScript file
        create_html_preloader(
            frames_dir, output_file=str(script_dir / "js" / "preloader.js")
        )

        print("\nNext Steps:")
        print(
            "1. Use the preloader.js file to load frames instead of extracting them from video at runtime"
        )
        print("2. Update main.js to use preloaded frames with code like this:")
        print("""
   import { getPreloadedFrames } from './preloader.js';
   
   // Then in your code:
   const preloadedFrames = getPreloadedFrames();
   initSlideshow(preloadedFrames);
   """)
