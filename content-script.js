// Content script - runs in the context of web pages
console.log("Content script loaded for", window.location.href);

// Example: Send a message to the background script
// browser.runtime.sendMessage({
//   action: "getData",
//   url: window.location.href
// }).then(response => {
//   console.log("Received response:", response);
// });

