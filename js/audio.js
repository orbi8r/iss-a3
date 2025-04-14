// Audio player functionality
let isPlaying = false;
const audioElement = document.getElementById('background-music');

// Initialize the audio player
export function initAudioPlayer() {
    // Make sure audio volume is reasonable
    audioElement.volume = 0.5;

    // Set up music toggle button event listener
    document.addEventListener('DOMContentLoaded', () => {
        const musicToggle = document.getElementById('music-toggle');
        if (musicToggle) {
            musicToggle.addEventListener('click', toggleMusic);
            updateMusicButtonIcon();
        }
    });

    // Ensure the audio state is tracked properly
    audioElement.addEventListener('play', () => {
        isPlaying = true;
        updateMusicButtonIcon();
    });

    audioElement.addEventListener('pause', () => {
        isPlaying = false;
        updateMusicButtonIcon();
    });
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
    updateMusicButtonIcon();
}

// Update the music button icon based on playing state
function updateMusicButtonIcon() {
    const musicIcon = document.getElementById('music-icon');
    if (!musicIcon) return;
    
    if (isPlaying) {
        musicIcon.className = 'fa-solid fa-volume-high';
    } else {
        musicIcon.className = 'fa-solid fa-volume-xmark';
    }
    
    // Add visual cue for active state
    const musicToggle = document.getElementById('music-toggle');
    if (musicToggle) {
        if (isPlaying) {
            musicToggle.style.backgroundColor = '#4f6b8f';
            musicToggle.style.borderColor = 'rgba(114, 137, 218, 0.5)';
            musicToggle.style.color = 'white';
            
            // Add subtle pulsing animation
            musicToggle.style.animation = 'pulse 2s infinite';
        } else {
            musicToggle.style.backgroundColor = '#2a3142';
            musicToggle.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            musicToggle.style.color = '#eaeaea';
            
            // Remove animation
            musicToggle.style.animation = 'none';
        }
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