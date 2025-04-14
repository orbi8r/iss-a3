// Background music management
let audioPlayer = null;
let isMusicEnabled = true; // Music enabled by default

// Initialize audio player with default settings
export function initAudioPlayer() {
    // Create audio element if it doesn't exist
    if (!audioPlayer) {
        audioPlayer = new Audio('./music/C418-HauntMuskie.mp3');
        audioPlayer.loop = true;
        audioPlayer.volume = 0.5; // Set default volume to 50%
    }
    
    // Start playing if music is enabled
    if (isMusicEnabled) {
        playAudio();
    }
    
    // Set up the music toggle button in both loading screen and main UI
    setupMusicToggle();
}

// Play audio with user interaction requirement
function playAudio() {
    // Only attempt to play if music is enabled
    if (isMusicEnabled && audioPlayer) {
        // Use catch to handle autoplay restrictions gracefully
        audioPlayer.play().catch(error => {
            console.log("Audio autoplay failed:", error);
            console.log("User interaction required before playing audio");
        });
    }
}

// Toggle music on/off
export function toggleMusic() {
    isMusicEnabled = !isMusicEnabled;
    
    // Update all toggle buttons
    const toggleButtons = document.querySelectorAll('.music-toggle');
    toggleButtons.forEach(button => {
        updateToggleButtonUI(button);
    });
    
    // Play or pause based on new state
    if (isMusicEnabled) {
        playAudio();
    } else if (audioPlayer) {
        audioPlayer.pause();
    }
}

// Update the UI of a music toggle button
function updateToggleButtonUI(button) {
    if (!button) return;
    
    // Update icon
    const icon = button.querySelector('i');
    if (icon) {
        if (isMusicEnabled) {
            icon.className = 'fas fa-volume-up';
            button.title = 'Music On (Click to Mute)';
        } else {
            icon.className = 'fas fa-volume-mute';
            button.title = 'Music Off (Click to Unmute)';
        }
    }
}

// Set up music toggle buttons in both loading screen and main UI
function setupMusicToggle() {
    // Create music toggle button for loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        let loadingMusicToggle = loadingScreen.querySelector('.music-toggle');
        if (!loadingMusicToggle) {
            loadingMusicToggle = document.createElement('button');
            loadingMusicToggle.className = 'music-toggle';
            loadingMusicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            loadingMusicToggle.title = 'Music On (Click to Mute)';
            loadingScreen.appendChild(loadingMusicToggle);
            
            loadingMusicToggle.addEventListener('click', (e) => {
                e.preventDefault();
                toggleMusic();
            });
        }
    }
    
    // Create music toggle button for main UI
    const appContainer = document.getElementById('app-container');
    if (appContainer) {
        let appMusicToggle = appContainer.querySelector('.music-toggle');
        if (!appMusicToggle) {
            appMusicToggle = document.createElement('button');
            appMusicToggle.className = 'music-toggle';
            appMusicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            appMusicToggle.title = 'Music On (Click to Mute)';
            appContainer.appendChild(appMusicToggle);
            
            appMusicToggle.addEventListener('click', (e) => {
                e.preventDefault();
                toggleMusic();
            });
        }
    }
}