// Background service worker for the Tax Form Auto-Fill extension

console.log('Tax Form Auto-Fill background script loaded');

// Open side panel when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'taxFormDetected') {
    console.log('Tax form detected on page:', request.data);

    // Store the detected form data
    chrome.storage.local.set({
      detectedForm: {
        ...request.data,
        tabId: sender.tab?.id,
        timestamp: Date.now()
      }
    });

    // Show a badge on the extension icon
    if (sender.tab?.id) {
      chrome.action.setBadgeText({
        text: request.data.fieldCount.toString(),
        tabId: sender.tab.id
      });

      chrome.action.setBadgeBackgroundColor({
        color: '#081F3B',
        tabId: sender.tab.id
      });
    }

    sendResponse({ received: true });
  }
  return true;
});

// Clear badge when tab is closed or URL changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading') {
    chrome.action.setBadgeText({ text: '', tabId: tabId });
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.action.setBadgeText({ text: '', tabId: tabId });
});

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Tax Form Auto-Fill extension installed');

    // Set default settings
    chrome.storage.local.set({
      settings: {
        autoDetect: true,
        highlightFields: true,
        confirmBeforeFill: true
      }
    });

    // Open welcome page (optional)
    // chrome.tabs.create({ url: 'welcome.html' });
  }
});
