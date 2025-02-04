chrome.runtime.onInstalled.addListener(() => {
    console.log("tabby extension installed!");
  });
  
  // save tabs when the browser is about to close
  chrome.windows.onRemoved.addListener((windowId) => {
    chrome.tabs.query({}, (tabs) => {
      const tabUrls = tabs.map(tab => tab.url);
      chrome.storage.local.set({"last session": tabUrls });
    });
  });
  
  // restore last session when chrome restarts
  chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.get("last session", (data) => {
      if (data.LastSession) {
        data.LastSession.forEach(url => chrome.tabs.create({ url }));
      }
    });
  });
  