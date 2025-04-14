# iss-a3

Assignment 3, Intro to Software Systems - IIIT Hyderabad

## Project Overview
This application extracts frames from a video and displays them as a slideshow with navigation controls. Key features include:
- Frame-by-frame video extraction
- Interactive slider for navigating through frames
- Keyboard and scroll wheel navigation
- Animated loading screen with progress tracking
- Responsive design that works on displays from standard to 8K resolution

## File Structure
The project follows a modular architecture with separate concerns:

### Main Files
- `index.html` - Main entry point for the application
- `README.md` - Project documentation (this file)

### JavaScript Files
- `js/main.js` - Core application logic
  - Handles video loading and frame extraction
  - Manages the main processing pipeline
  - Coordinates between modules
  
- `js/slideshow.js` - Slideshow functionality
  - Manages displaying and navigating through frames
  - Controls slider functionality
  - Handles keyboard and mouse wheel navigation
  
- `js/loader.js` - Loading screen functionality
  - Creates and manages the loading animation
  - Handles the start button and user interaction
  - Controls progress bar updates

### CSS Files
- `css/main.css` - Core application styles
  - Contains global styling and variables
  - Manages responsive design basics
  
- `css/slideshow.css` - Slideshow component styles
  - Styles for the image display
  - Navigation buttons
  - Slider control appearance
  
- `css/loader.css` - Loading screen styles
  - Film/camera themed loading animation
  - Progress bar styling
  - Start button appearance

### Media Files
- `video/WebVideo.mp4` - Source video for frame extraction

## How It Works
1. User clicks "Start Frame Extraction" button
2. The application extracts every frame from the video
3. A progress bar shows extraction status
4. When complete, the first frame is displayed
5. User can navigate through frames using:
   - Left/right arrow buttons
   - Keyboard arrow keys
   - Mouse scroll wheel (down for next, up for previous)
   - Interactive slider at the bottom

## Asset Credits
- "Canonical Hologra Office" (https://skfb.ly/oTyAG) by Aeri is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
- "Haunt Muskie" music by C418 - Minecraft ()

## Project Checklist

### Instructions
- Use this README to track the progress of your assignment.
- Tick the checkpoints once completed by replacing the ❌ with ✅.
- Always ensure this README reflects the current project state to provide accurate context to any LLMs assisting you.

### Checkpoints

#### Q1: Personal Website
- ✅ Create a personal website and host it on GitHub Pages.
- ✅ Add an "About Yourself" section with a paragraph.
- ✅ Include your profile picture and local pictures from your birthplace.
- ✅ Write about your education background, schools, and achievements.
- ✅ List your technical skills based on your level of expertise.
- ❌ Include a CV as a PDF in a hyperlink.

#### Q2: JavaScript Event Tracking
- ❌ Write a JavaScript function to capture all click events and page views.
- ❌ Print the output in the console with the format: `Timestamp_of_click, type of event (click/view), event object (drop-down, image, text, etc.)`.

#### Q3: Text Analysis
- ❌ Create a text box to input more than 10,000 words.
- ❌ Calculate and display:
  - Number of letters
  - Number of words
  - Number of spaces
  - Number of newlines
  - Number of special symbols
- ❌ Tokenize the text and print:
  - Count of pronouns grouped by pronouns
  - Count of prepositions grouped by prepositions
  - Count of indefinite articles grouped by articles

## Notes
- Ensure the website is neat and user-friendly.
- Use this README to provide accurate context for future LLMs assisting with this project.

## Asset Credits
- "Canonical Hologra Office" (https://skfb.ly/oTyAG) by Aeri is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
- "Haunt Muskie" music by C418 - Minecraft ()