// Content script - runs in the context of web pages
console.log("Content script loaded for", window.location.href);

// Send link to background.js
browser.runtime.sendMessage({
  action: "checkForArchive",
  link: window.location.href
});

// Function to create and display the archive banner
function showArchiveBanner(archiveUrl) {
  // Create the banner element
  const banner = document.createElement('div');
  banner.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #f8f8f8;
    color: #333;
    padding: 10px;
    text-align: center;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    z-index: 9999;
    font-family: Arial, sans-serif;
    border-bottom: 1px solid #ddd;
  `;

  // Create the close button
  const closeButton = document.createElement('button');
  closeButton.textContent = '×';
  closeButton.style.cssText = `
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #666;
  `;
  closeButton.addEventListener('click', () => {
    banner.remove();
  });

  // Create the link to the archived article
  const link = document.createElement('a');
  link.href = archiveUrl;
  link.textContent = 'View Archived Version';
  link.style.cssText = `
    color: #0066cc;
    text-decoration: underline;
    margin-left: 5px;
  `;
  link.target = '_blank'; // Open in new tab

  // Assemble the banner
  banner.innerHTML = 'I found an archive of this article: ';
  banner.appendChild(link);
  banner.appendChild(closeButton);

  // Insert the banner at the top of the page
  document.body.prepend(banner);

  // Adjust page content to avoid overlap
  document.body.style.marginTop = `${banner.offsetHeight}px`;
}

// Listen for messages from the background script
browser.runtime.onMessage.addListener((message) => {
  if (message.action === 'showArchiveBanner') {
    showArchiveBanner(message.archiveUrl);
  }
});

