document.addEventListener('DOMContentLoaded', () => {
  const urlForm = document.getElementById('url-form');
  const urlInput = document.getElementById('url-input');
  const saveBtn = document.getElementById('save-btn');
  const deleteBtn = document.getElementById('delete-btn');
  const statusDiv = document.getElementById('status');

  // Handle both save and delete with button clicks instead of form submit
  saveBtn.addEventListener('click', handleSave);
  deleteBtn.addEventListener('click', handleDelete);

  async function handleSave() {
    await handleUrlAction('saveUrl', 'saved');
  }

  async function handleDelete() {
    await handleUrlAction('deleteUrl', 'deleted');
  }

  async function handleUrlAction(action, actionText) {
    const url = normalizeUrl(urlInput.value.trim());
    
    if (!url) {
      showStatus('Please enter a URL', 'error');
      return;
    }

    try {
      // Basic URL validation
      new URL(url.includes('://') ? url : `https://${url}`);
      
      // Send to background script
      const response = await browser.runtime.sendMessage({
        action: action,
        url: url
      });
      
      if (response.success) {
        showStatus(`URL ${actionText} successfully!`);
        urlInput.value = '';
      } else {
        showStatus(`Failed to ${action} URL`, 'error');
      }
    } catch (err) {
      showStatus('Invalid URL', 'error');
      console.error('URL error:', err);
    }
  }

  function normalizeUrl(url) {
    // Add https:// if missing
    if (!url.includes('://') && !url.startsWith('http')) {
      url = `https://${url}`;
    }
    return url;
  }

  function showStatus(message, type = 'success') {
    statusDiv.textContent = message;
    statusDiv.style.color = type === 'error' ? 'red' : '#0060df';
    setTimeout(() => statusDiv.textContent = '', 3000);
  }
});