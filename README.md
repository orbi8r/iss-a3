# Personal Portfolio

Live Website: [https://orbi8r.github.io/iss-a3/](https://orbi8r.github.io/iss-a3/)

Assignment 3, Intro to Software Systems - IIIT Hyderabad
2024111017 - Shuban Biswas (orbi8r)

## Project Overview
This application showcases a personal portfolio with an intuitive, office-themed interface. Key features include:

- Frame-by-frame content navigation
- Modern UI with expandable, rounded side panels
- Rounded content display with dynamic island-style controls
- Fast-forward/rewind when holding navigation buttons
- Keyboard and scroll wheel navigation
- Animated loading screen with progress tracking
- Responsive design that works on displays from standard to 8K resolution
- Custom 3D office tour video created with Godot Engine and GDScript

## File Structure
The project follows a modular architecture with separate concerns:

### Main Files
- `index.html` - Main entry point for the application
- `README.md` - Project documentation (this file)
- `LICENSE` - License information

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

- `js/audio.js` - Audio player functionality
  - Controls background music playback
  - Manages audio toggle and state
  - Handles wholesome message rotation

- `js/eventTracker.js` - User interaction tracking
  - Logs all user interactions
  - Records page views, clicks, and events
  - Displays event history in a dedicated panel

- `js/textAnalysis.js` - Text analysis functionality
  - Provides comprehensive text metrics
  - Analyzes language patterns
  - Identifies and counts pronouns, prepositions, and articles

- `js/scripts.js` - Additional helper scripts

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

- `css/styles.css` - Additional global styles

### Media and Documents
- `video/WebVideo.mp4` - Source frames for the presentation
- `resume/resume.pdf` - CV for embedding in panel 2
- `music/C418-HauntMuskie.mp3` - Background music track

### Submission Files
- `submission/README.txt` - Submission documentation
- `submission/submission.txt` - Submission details
- `2024111017.zip` - Zipped project for submission

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
- "Haunt Muskie" by C418, from the album "148" - Used as background music with attribution to the artist.

## Project Checklist

### Checkpoints

#### Q1: Personal Website
- ✅ Create a personal website and host it on GitHub Pages.
- ✅ Add an "About Yourself" section with a paragraph.
- ✅ Include your profile picture and local pictures from your birthplace.
- ✅ Write about your education background, schools, and achievements.
- ✅ List your technical skills based on your level of expertise.
- ✅ Include a CV as a PDF in a hyperlink.

#### Q2: JavaScript Event Tracking
- ✅ Write a JavaScript function to capture all click events and page views.
- ✅ Print the output in the console with the format: `Timestamp_of_click, type of event (click/view), event object (drop-down, image, text, etc.)`.

#### Q3: Text Analysis
- ✅ Create a text box to input more than 10,000 words.
- ✅ Calculate and display:
  - Number of letters
  - Number of words
  - Number of spaces
  - Number of newlines
  - Number of special symbols
- ✅ Tokenize the text and print:
  - Count of pronouns grouped by pronouns
  - Count of prepositions grouped by prepositions
  - Count of indefinite articles grouped by articles