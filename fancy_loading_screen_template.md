# Fancy Godot Loading Screen Template

## CSS Styling Changes
```css
body {
  color: white;
  background-color: #0f0f0f;
  overflow: hidden;
  touch-action: none;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

#status {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle, #1a1a2e 0%, #0f0f0f 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  visibility: hidden;
}

.game-title {
  font-size: 3.5rem;
  margin-bottom: 2rem;
  color: #e94560;
  text-shadow: 0 0 10px rgba(233, 69, 96, 0.7);
  font-weight: bold;
  letter-spacing: 2px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.7; transform: scale(1); }
}

.loader-container {
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-bottom: 2rem;
}

.loader {
  width: 120px;
  height: 120px;
  border: 5px solid transparent;
  border-top-color: #16213e;
  border-bottom-color: #e94560;
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
}

.loader-inner {
  position: absolute;
  width: 80px;
  height: 80px;
  border: 5px solid transparent;
  border-top-color: #e94560;
  border-bottom-color: #16213e;
  border-radius: 50%;
  animation: spin 2s linear infinite reverse;
}

.loader-center {
  position: absolute;
  width: 40px;
  height: 40px;
  background-color: #e94560;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 1.2rem;
  color: #fff;
  margin-top: 1rem;
  letter-spacing: 3px;
}

.loading-percentage {
  font-size: 1.8rem;
  font-weight: bold;
  color: #e94560;
  margin-top: 0.5rem;
}

#status-progress {
  display: none;
}

#status-notice {
  background-color: #e94560;
  border-radius: 0.5rem;
  color: #fff;
  font-size: 1rem;
  padding: 1rem;
  text-align: center;
  max-width: 80%;
  margin-top: 1rem;
  display: none;
}

.forest-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('index.png');
  background-size: cover;
  background-position: center;
  opacity: 0.2;
  z-index: -1;
}
```

## HTML Body Changes
Replace the default Godot loading elements with:

```html
<div id="status">
  <div class="forest-bg"></div>
  <h1 class="game-title">FOREST HOUSE</h1>
  <div class="loader-container">
    <div class="loader"></div>
    <div class="loader-inner"></div>
    <div class="loader-center"></div>
  </div>
  <div class="loading-text">LOADING GAME</div>
  <div class="loading-percentage">0%</div>
  <progress id="status-progress"></progress>
  <div id="status-notice"></div>
</div>
```

## JavaScript Changes
Add these modifications to the script section:

```javascript
// Get references to new elements
const loadingPercentage = document.querySelector('.loading-percentage');
const loadingText = document.querySelector('.loading-text');

// In the displayFailureNotice function, add:
loadingText.textContent = 'ERROR LOADING GAME';
loadingText.style.color = '#e94560';

// Before engine.startGame(), add:
// Add loading animation with percentage
const dots = ['', '.', '..', '...'];
let dotIndex = 0;

const loadingInterval = setInterval(() => {
  dotIndex = (dotIndex + 1) % dots.length;
  loadingText.textContent = `LOADING GAME${dots[dotIndex]}`;
}, 500);

// In the onProgress function, add:
const percent = Math.floor((current / total) * 100);
loadingPercentage.textContent = `${percent}%`;

// In the .then() callback after engine.startGame(), add:
clearInterval(loadingInterval);
```

## Instructions for Implementation
1. Replace the default CSS with the custom CSS above
2. Replace the default status div with the new HTML structure
3. Modify the JavaScript to include the loading animation and percentage display
4. Ensure the game title "FOREST HOUSE" is changed to match your game's name
5. The background uses the default splash image (index.png) as a semi-transparent background

You can customize the colors by changing:
- Primary color: #e94560 (pinkish red)
- Secondary color: #16213e (dark blue)
- Background gradient: #1a1a2e to #0f0f0f (dark blue to almost black)