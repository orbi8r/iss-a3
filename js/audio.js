// Audio functionality
import { updateWholesomeMessage } from './eventTracker.js';

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

    // Start the wholesome message rotation
    startWholesomeMessageRotation();
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

// Initialize the wholesome message rotation for both panels
function startWholesomeMessageRotation() {
    // Wholesome messages collection
    const wholesomeMessages = [
        "Music makes everything better!",
        "Keep smiling, you're doing great!",
        "Your creativity is inspiring!",
        "Take a deep breath, you've got this",
        "Remember to stay hydrated today",
        "You're making incredible progress",
        "Every small step counts",
        "Your hard work will pay off",
        "Believe in yourself, always",
        "You bring light wherever you go",
        "Today is full of possibilities",
        "The world is better with you in it",
        "Your passion is contagious",
        "Never stop chasing your dreams",
        "You have the power to create change",
        "Your potential is limitless",
        "Kindness is your superpower",
        "Take time to appreciate the little things",
        "You're stronger than you know",
        "Today's challenges are tomorrow's strengths",
        "Keep that amazing energy flowing",
        "Your journey matters; enjoy every step",
        "Small progress is still progress",
        "You deserve all good things",
        "Your unique perspective is valuable",
        "The best is yet to come",
        "Be proud of how far you've come",
        "Your efforts don't go unnoticed",
        "You make the world more interesting",
        "Focus on the positive today",
        "You're capable of amazing things",
        "Your creativity knows no bounds",
        "Embrace the journey, not just the destination",
        "Learning is a beautiful adventure",
        "Today is a new opportunity",
        "You've overcome so much already",
        "Your kindness makes a difference",
        "Keep that wonderful curiosity",
        "You inspire those around you",
        "Your dedication is admirable",
        "Growth happens outside comfort zones",
        "Stars can't shine without darkness",
        "Your ideas matter, share them",
        "The world needs your unique gifts",
        "Don't forget to celebrate small wins",
        "You have the courage to move forward",
        "Your presence brightens every room",
        "Your persistence will lead to success",
        "Trust your intuition and insight",
        "Today, choose joy whenever possible",
        "Your thoughtfulness is appreciated",
        "Every day brings new opportunities",
        "Your enthusiasm is contagious",
        "Keep nurturing your creative spirit",
        "You're making a positive impact",
        "Challenges help us grow stronger",
        "Your authenticity is refreshing",
        "Remember to be kind to yourself too",
        "Your energy lights up the room",
        "Happiness multiplies when shared",
        "Keep following your curiosity",
        "Your determination is inspiring",
        "Celebrate your unique journey",
        "Progress over perfection, always",
        "Small steps add up to big changes",
        "You have the power to inspire others",
        "Your optimism makes a difference",
        "Keep that beautiful smile going",
        "The best view comes after the hardest climb",
        "Your resilience is remarkable",
        "Good things take time; be patient",
        "Your positive attitude is powerful",
        "Success is the sum of small efforts",
        "Embrace your quirks and uniqueness",
        "Each day is a new opportunity",
        "Don't forget how far you've come",
        "You're doing better than you think",
        "Your voice deserves to be heard",
        "Be gentle with yourself today",
        "Your growth mindset is inspiring",
        "Challenges are opportunities in disguise",
        "You're exactly where you need to be",
        "Your persistence will pay off",
        "Approach today with curiosity",
        "The journey matters more than the destination",
        "Your creativity makes the world brighter",
        "Keep showing up for yourself",
        "Your efforts create ripple effects",
        "Surround yourself with positive energy",
        "Focus on progress, not perfection",
        "You're creating your own success story",
        "Your thoughtfulness touches hearts",
        "Every small step forward counts",
        "You shine in your own unique way",
        "Your kindness creates lasting impact",
        "Keep nurturing your passions",
        "Your dedication will be rewarded",
        "Today's a great day to be you",
        "Keep that wonderful enthusiasm",
        "Your presence makes a difference",
        "Breathe, smile, and continue forward",
        "Your perseverance is admirable",
        "C418's Haunt Muskie is playing...",
        "Creating is a form of self-expression"
    ];
    
    // Function to update messages in both panels
    function updateMessages() {
        // Get random message
        const randomIndex = Math.floor(Math.random() * wholesomeMessages.length);
        const message = wholesomeMessages[randomIndex];
        
        console.log("Changing wholesome message to:", message);
        
        // Update in main panel
        const mainCopyright = document.querySelector('#app-container .copyright-info');
        if (mainCopyright) {
            mainCopyright.innerHTML = `<span class="wholesome-message">${message}</span>`;
        }
        
        // Update in loading panel
        const loadingCopyright = document.querySelector('.footer-music-loading .copyright-info');
        if (loadingCopyright) {
            loadingCopyright.innerHTML = `<span class="wholesome-message">${message}</span>`;
        }
        
        // Track the message change as an event
        updateWholesomeMessage(message);
    }
    
    // Initial update
    updateMessages();
    
    // Make sure to call startWholesomeMessageRotation when the DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            // Set up interval to change message every 5 seconds
            setInterval(updateMessages, 5000);
        });
    } else {
        // DOM already loaded, set up interval immediately
        setInterval(updateMessages, 5000);
    }
}