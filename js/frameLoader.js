// Frame loading worker
// This worker loads images in the background to improve performance

// Handle messages from the main thread
self.onmessage = function(e) {
  const { framePaths, startIndex, endIndex, workerIndex } = e.data;
  
  // Array to store loaded frame data
  const loadedFrames = [];
  
  // Load each frame in the assigned range
  const loadFrame = (index) => {
    if (index >= endIndex) {
      // When all frames are loaded, send them back to the main thread
      self.postMessage({
        workerIndex,
        loadedFrames,
        complete: true
      });
      return;
    }
    
    // Create a new XMLHttpRequest to fetch the image
    const xhr = new XMLHttpRequest();
    xhr.open('GET', framePaths[index], true);
    xhr.responseType = 'blob';
    
    xhr.onload = function() {
      if (xhr.status === 200) {
        // Create a blob URL for the image
        const blob = xhr.response;
        const blobUrl = URL.createObjectURL(blob);
        
        // Store the result
        loadedFrames.push({
          index,
          url: blobUrl
        });
        
        // Report progress periodically
        if (loadedFrames.length % 10 === 0 || loadedFrames.length === (endIndex - startIndex)) {
          self.postMessage({
            workerIndex,
            progress: loadedFrames.length / (endIndex - startIndex),
            loadedFrames: loadedFrames.slice(), // Send a copy
            complete: false
          });
          
          // Clear the sent frames to avoid memory duplication
          loadedFrames.length = 0;
        }
        
        // Load the next frame
        loadFrame(index + 1);
      } else {
        // Handle error - store null to maintain frame order
        loadedFrames.push({
          index,
          url: null
        });
        
        // Load the next frame despite the error
        loadFrame(index + 1);
      }
    };
    
    xhr.onerror = function() {
      // Handle network error - store null to maintain frame order
      loadedFrames.push({
        index,
        url: null
      });
      
      // Continue to the next frame despite error
      loadFrame(index + 1);
    };
    
    // Send the request
    xhr.send();
  };
  
  // Start loading from the first assigned frame
  loadFrame(startIndex);
};