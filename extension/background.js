let lastMainDomain = "";
let listenersAdded = false;

function addListeners() {
  if (listenersAdded) return;
  listenersAdded = true;

  chrome.tabs.onUpdated.addListener(tabUpdateListener);
  chrome.webNavigation.onCompleted.addListener(navCompleteListener);
}

function removeListeners() {
  if (!listenersAdded) return;
  listenersAdded = false;

  chrome.tabs.onUpdated.removeListener(tabUpdateListener);
  chrome.webNavigation.onCompleted.removeListener(navCompleteListener);
}

function tabUpdateListener(tabId, changeInfo, tab) {
  if (changeInfo.status === "complete" && tab.url && tab.active) {
    const currentMainDomain = extractMainDomain(tab.url);
    if (currentMainDomain !== lastMainDomain) {
      checkWebsiteSafety(tab.url, tabId);
      lastMainDomain = currentMainDomain;
    }
  }
}

function navCompleteListener(details) {
  if (details.frameId === 0) {
    chrome.tabs.get(details.tabId, function (tab) {
      if (tab.url && !tab.url.startsWith("chrome://")) {
        const currentMainDomain = extractMainDomain(tab.url);
        if (currentMainDomain !== lastMainDomain) {
          checkWebsiteSafety(tab.url, details.tabId);
          lastMainDomain = currentMainDomain;
        }
      }
    });
  }
}

function extractMainDomain(url) {
  try {
    const hostname = new URL(url).hostname;
    const parts = hostname.split(".").reverse();
    console.log("Extracted hostname:", hostname);
    if (parts.length >= 2) {
      return parts[1] + "." + parts[0];
    }
    return hostname;
  } catch (error) {
    return null;
  }
}

function normalizeUrl(url) {
  if (!/^https?:\/\//i.test(url)) {
    return "https://" + url;
  }
  return url;
}

function injectContentScript(tabId) {
  chrome.scripting.executeScript(
    {
      target: { tabId },
      files: ["popup.js"],
    },
    () => {
      chrome.runtime.sendMessage({
        type: "connectionStatus",
        isConnected: true,
      });
    }
  );
}

function checkWebsiteSafety(url, tabId) {
  const safeUrl = normalizeUrl(url);

  fetch("https://boa-flying-gradually.ngrok-free.app/scan/extension", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ url: safeUrl }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Scan result:", data);
      chrome.storage.local.get(["protectionActive"], function (store) {
        if (!store.protectionActive) return;

        // Store the last scan result
        chrome.storage.local.set({ lastScanResult: data.result });

        if (data.result === "safe" || data.result === "malicious") {
          chrome.action.setPopup({ tabId: tabId, popup: "popup.html" });
          if (data.result === "malicious") {
            chrome.storage.local.set({
              stats: data.stats,
              scannedUrl: data.url,
            });
          }
          injectContentScript(tabId);
        }
      });
    })
    .catch((error) => {
      console.error("Scan error:", error);
      chrome.runtime.sendMessage({
        type: "connectionStatus",
        isConnected: false,
      });
    });
}

// Listen for toggle changes and add/remove listeners accordingly
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && "protectionActive" in changes) {
    if (changes.protectionActive.newValue) {
      addListeners();
    } else {
      removeListeners();
      chrome.runtime.sendMessage(
        { type: "connectionStatus", isConnected: false },
        function (response) {
          if (chrome.runtime.lastError) {
            // No receiving end, ignore
            // console.warn("No receiving end for connectionStatus");
          }
        }
      );
    }
  }
});

// On startup, check if protection is active and add listeners if needed
chrome.storage.local.get(["protectionActive"], function (store) {
  if (store.protectionActive) {
    addListeners();
  }
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function (tab) {
    if (tab.url && !tab.url.startsWith("chrome://")) {
      const currentMainDomain = extractMainDomain(tab.url);
      if (currentMainDomain !== lastMainDomain) {
        checkWebsiteSafety(tab.url, activeInfo.tabId);
        lastMainDomain = currentMainDomain;
      } else {
        // If already scanned, just update popup with last result
        chrome.storage.local.get(
          ["lastScanResult", "protectionActive", "isConnected"],
          function (data) {
            chrome.runtime.sendMessage({
              type: "scanResult",
              result: data.lastScanResult || null,
            });
            chrome.runtime.sendMessage({
              type: "connectionStatus",
              isConnected: !!data.isConnected,
            });
          }
        );
      }
    }
  });
});
