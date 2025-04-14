# Personal Portfolio

Assignment 3, Intro to Software Systems - IIIT Hyderabad

## Project Overview
This application showcases a personal portfolio with an intuitive, office-themed interface. Key features include:

- Frame-by-frame content navigation
- Modern UI with expandable, rounded side panels
- Rounded content display with dynamic island-style controls
- Fast-forward/rewind when holding navigation buttons
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
  - Handles content loading and frame extraction
  - Manages the main processing pipeline
  - Coordinates between modules
  
- `js/slideshow.js` - Frame navigation functionality
  - Manages displaying and navigating through frames
  - Controls slider functionality
  - Handles keyboard and mouse wheel navigation
  - Implements fast-forward/rewind when holding buttons
  
- `js/loader.js` - Loading screen functionality
  - Creates and manages the loading animation
  - Handles the start button and user interaction
  - Controls progress bar updates
  
- `js/panels.js` - Side panel functionality
  - Controls the expandable side panels
  - Handles panel animations and state management

### CSS Files
- `css/main.css` - Core application styles
  - Contains global styling and variables
  - Manages responsive design basics
  
- `css/slideshow.css` - Content display styles
  - Styles for the rounded content display
  - Dynamic island-style controls
  - Slider and navigation buttons
  
- `css/loader.css` - Loading screen styles
  - Office-themed loading animation
  - Progress bar styling
  - Start button appearance
  
- `css/panels.css` - Panel component styles
  - Rounded panel styling and animations
  - Panel header and content areas

### Media and Documents
- `video/WebVideo.mp4` - Source frames for the presentation
- `resume/resume.pdf` - CV for embedding in panel 2

## Interface Features

### Left Side Panels
- Three collapsible rounded panels for different functions
- First panel expanded by default
- Smooth animation when switching between panels
- Only one panel can be open at a time
- Clean, modern appearance with rounded corners

### Content Display
- Rounded edges with modern appearance
- Centered display with optimal sizing
- Frame counter showing current position

### Navigation Controls
- Dynamic island-style control bar
- Circular navigation buttons
- Continuous playback when holding navigation buttons (60fps)
- Smooth slider for direct frame access
- Support for keyboard shortcuts and scroll wheel

## Version History
- v0.2.5
  - Removed parallel frame loading technique due to ordering issues
  - Implemented improved single-channel frame loading for better reliability
  - Added additional logging for better troubleshooting
  - Enhanced error handling for failed frame extractions
- v0.2.4
  - Fixed horizontal scrollbar issue in panels by improving the CSS for dynamic sizing
  - Fixed frame ordering bug in parallel extraction to ensure proper frame sequence
  - Improved worker management to prevent system overload during parallel processing
  - Added more robust error handling for frame extraction failures
  - Enhanced debugging with better console logging
- v0.2.3
  - Fixed panel layout to use individual rounded boxes
  - Fixed issue with the 2034th frame by limiting to 2033 frames
  - Improved navigation controls - tap for single frame, hold for 0.2s to start 60fps playback
  - Enhanced button behavior to properly distinguish between taps and holds
  - Optimized rendering using requestAnimationFrame for smoother playback
  - Implemented WebP image format instead of JPG for better compression and faster loading
  - Added frame preloading system to ensure smooth playback performance
- v0.2.2 
  - Redesigned panels as individual rounded boxes
  - Added fast-forward/rewind functionality when holding buttons
  - Fixed bug with last frame (2034th frame)
  - Renamed to "Personal Portfolio"
  - Added custom favicon
  - Removed video-specific terminology
- v0.2.1
  - Updated version number display
  - Scroll Bug Fix
- v0.2.0
  - Initial office-themed UI implementation

## How It Works
1. User views the loading screen while content is prepared
2. A progress bar shows loading status
3. When complete, the first frame is displayed in the office-themed interface
4. User can navigate through frames using:
   - Single click: one frame at a time
   - Button hold (0.2s): continuous playback at 60fps
   - Keyboard arrows: one frame at a time
   - Mouse scroll wheel
   - Interactive slider

## Asset Credits
- "Canonical Hologra Office" (https://skfb.ly/oTyAG) by Aeri is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).

## Project Checklist

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