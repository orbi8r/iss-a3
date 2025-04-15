// Audio player functionality
let isPlaying = false;
const audioElement = document.getElementById('background-music');

// Initialize the audio player
export function initAudioPlayer() {
    // Make sure audio volume is reasonable
    if (audioElement) {
        audioElement.volume = 0.5;
    }

    // Set up music toggle button event listeners when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        // Main screen music toggle
        const musicToggle = document.getElementById('music-toggle');
        if (musicToggle) {
            musicToggle.addEventListener('click', toggleMusic);
        }
        
        // Loading screen music toggle
        const loadingMusicToggle = document.getElementById('loading-music-toggle');
        if (loadingMusicToggle) {
            loadingMusicToggle.addEventListener('click', toggleMusic);
        }
        
        updateMusicButtonIcons();
    });

    // Ensure the audio state is tracked properly
    if (audioElement) {
        audioElement.addEventListener('play', () => {
            isPlaying = true;
            updateMusicButtonIcons();
        });

        audioElement.addEventListener('pause', () => {
            isPlaying = false;
            updateMusicButtonIcons();
        });
    }
}

// Toggle music playback
export function toggleMusic() {
    if (!audioElement) return;
    
    if (isPlaying) {
        audioElement.pause();
    } else {
        // Create user gesture context for browsers that need it
        const playPromise = audioElement.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error("Audio playback was prevented:", error);
            });
        }
    }
    
    isPlaying = !isPlaying;
    updateMusicButtonIcons();
}

// Update all music button icons based on playing state
function updateMusicButtonIcons() {
    // Update main screen icon
    const musicIcon = document.getElementById('music-icon');
    if (musicIcon) {
        musicIcon.className = isPlaying ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
    }
    
    // Update loading screen icon
    const loadingMusicIcon = document.getElementById('loading-music-icon');
    if (loadingMusicIcon) {
        loadingMusicIcon.className = isPlaying ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
    }
    
    // Style main screen button
    const musicToggle = document.getElementById('music-toggle');
    updateButtonStyle(musicToggle);
    
    // Style loading screen button
    const loadingMusicToggle = document.getElementById('loading-music-toggle');
    updateButtonStyle(loadingMusicToggle);
}

// Style the music toggle button based on play state
function updateButtonStyle(button) {
    if (!button) return;
    
    if (isPlaying) {
        button.style.backgroundColor = '#4f6b8f';
        button.style.borderColor = 'rgba(114, 137, 218, 0.5)';
        button.style.color = 'white';
        button.style.animation = 'pulse 2s infinite';
    } else {
        button.style.backgroundColor = '#2a3142';
        button.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        button.style.color = '#eaeaea';
        button.style.animation = 'none';
    }
}

// Add this to CSS using a style element since we're defining it in JS
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(114, 137, 218, 0.7);
        }
        
        70% {
            transform: scale(1.05);
            box-shadow: 0 0 0 10px rgba(114, 137, 218, 0);
        }
        
        100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(114, 137, 218, 0);
        }
    }
`;
document.head.appendChild(style);