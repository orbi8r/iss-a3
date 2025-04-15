# Personal Portfolio

**Live Website: [https://orbi8r.github.io/iss-a3/](https://orbi8r.github.io/iss-a3/)**

Assignment 3, Intro to Software Systems - IIIT Hyderabad

## Project Overview
This application showcases a personal portfolio with an intuitive, office-themed interface. The video content was made using **Godot Engine** and **GDScript** Programming language, featuring an "About me" type of 3D tour in a virtual fictional office.

Key features include:

- Frame-by-frame content navigation
- Modern UI with expandable, rounded side panels
- Rounded content display with dynamic island-style controls
- Fast-forward/rewind when holding navigation buttons
- Keyboard and scroll wheel navigation
- Animated loading screen with progress tracking
- Responsive design that works on displays from standard to 8K resolution

## File Structure
The project follows a modular architecture with separate concerns:

```
index.html             # Main entry point for the application
LICENSE                # MIT License file
README.md              # Project documentation (this file)
css/
    loader.css         # Loading screen styles
    main.css           # Core application styles
    panels.css         # Panel component styles
    slideshow.css      # Content display styles
    styles.css         # Additional styling
js/
    audio.js           # Background music functionality
    eventTracker.js    # Event tracking system (Q2)
    loader.js          # Loading screen functionality
    main.js            # Core application logic
    panels.js          # Side panel functionality
    scripts.js         # Additional scripts
    slideshow.js       # Frame navigation functionality
    textAnalysis.js    # Text analysis functionality (Q3)
music/
    C418-HauntMuskie.mp3  # Background music
resume/
    resume.pdf         # CV for embedding in panel 2
submission/
    README.txt         # Submission notes
    submission.txt     # Submission details
video/
    WebVideo.mp4       # Source video for the presentation (created with Godot Engine)
```

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
- `video/WebVideo.mp4` - Source frames for the presentation (created with Godot Engine and GDScript)
- `resume/resume.pdf` - CV for embedding in panel 2
- `music/C418-HauntMuskie.mp3` - Background music for the portfolio

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