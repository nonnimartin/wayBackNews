document.addEventListener('DOMContentLoaded', () => {
  const saveUrl   = document.getElementById('save-url');
  const deleteUrl = document.getElementById('delete-url');
  const urlInput  = document.getElementById('url-save');
  const urlDelete = document.getElementById('url-delete');
  const statusDiv = document.getElementById('status');

  saveUrl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = urlInput.value.trim();
    
    if (!url) {
      showStatus('Please enter a URL', 'error');
      return;
    }

    try {
      // Validate URL
      new URL(url);
      
      // Send to background script
      const response = await browser.runtime.sendMessage({
        action: 'saveUrl',
        url: url
      });
      
      if (response.success) {
        showStatus('URL saved successfully!');
        urlInput.value = '';
      } else {
        showStatus('Failed to save URL', 'error');
      }
    } catch (err) {
      showStatus('Invalid URL format', 'error');
      console.error('Invalid URL:', err);
    }
  });

  deleteUrl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = urlInput.value.trim();
    
    if (!url) {
      showStatus('Please enter a URL', 'error');
      return;
    }

    try {
      // Validate URL
      new URL(url);
      
      // Send to background script
      const response = await browser.runtime.sendMessage({
        action: 'deleteUrl',
        url: url
      });
      
      if (response.success) {
        showStatus('URL saved successfully!');
        urlInput.value = '';
      } else {
        showStatus('Failed to save URL', 'error');
      }
    } catch (err) {
      showStatus('Invalid URL format', 'error');
      console.error('Invalid URL:', err);
    }
  });

  function showStatus(message, type = 'success') {
    statusDiv.textContent = message;
    statusDiv.style.color = type === 'error' ? 'red' : '#0060df';
    setTimeout(() => statusDiv.textContent = '', 3000);
  }
});