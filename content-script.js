// Content script - runs in the context of web pages
console.log("Content script loaded for", window.location.href);

// Send link to background.js
browser.runtime.sendMessage({
  action: "thisPageLink",
  links: window.location.href
});



