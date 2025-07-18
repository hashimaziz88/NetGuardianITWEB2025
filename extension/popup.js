// Helper to update the UI based on state
function updateUI(isActive, isConnected, scanResult) {
  const currentStatus = document.getElementById("protection-status");
  const statusText = document.getElementById("status-text");
  const statusIcon = document.getElementById("status-icon");
  const header = document.querySelector("header");
  const reportDiv = document.getElementById("report");

  // Remove any previous malicious button
  const oldBtn = document.getElementById("go-google-btn");
  if (oldBtn) oldBtn.remove();

  if (isActive) {
    currentStatus.textContent = "Active";
    currentStatus.style.color = "#4CAF50";
    header.style.backgroundColor = "#333";
    if (isConnected) {
      if (scanResult === "malicious") {
        statusText.textContent = "Website is malicious!";
        statusText.style.color = "#F44336";
        statusIcon.src = "icons8-usb-connected-48.png";
        statusIcon.style.filter = "drop-shadow(0 0 6px #F44336)";

        // Add "Go to Google" button
        const btn = document.createElement("button");
        btn.id = "go-google-btn";
        btn.textContent = "Go to Google";
        btn.style.marginTop = "15px";
        btn.style.padding = "10px 20px";
        btn.style.background = "#4CAF50";
        btn.style.color = "#fff";
        btn.style.border = "none";
        btn.style.borderRadius = "5px";
        btn.style.cursor = "pointer";
        btn.onclick = function () {
          chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
              chrome.tabs.update(tabs[0].id, { url: "https://www.google.com" });
            }
          );
        };
        reportDiv.appendChild(btn);
      } else if (scanResult === "safe") {
        statusText.textContent = "Website is safe.";
        statusText.style.color = "#4CAF50";
        statusIcon.src = "icons8-usb-connected-48.png";
        statusIcon.style.filter = "drop-shadow(0 0 6px #4CAF50)";
      } else {
        statusText.textContent = "Successfully Connected";
        statusText.style.color = "#4CAF50";
        statusIcon.src = "icons8-usb-connected-48.png";
        statusIcon.style.filter = "drop-shadow(0 0 6px #4CAF50)";
      }
    } else {
      statusText.textContent = "Waiting for connection...";
      statusText.style.color = "#FFA000";
      statusIcon.src = "icons8-usb-connected-48.png";
      statusIcon.style.filter = "drop-shadow(0 0 6px #FFA000)";
    }
  } else {
    currentStatus.textContent = "Inactive";
    currentStatus.style.color = "#F44336";
    header.style.backgroundColor = "#333";
    statusText.textContent = "Protection is OFF";
    statusText.style.color = "#F44336";
    statusIcon.src = "icons8-usb-connected-48.png";
    statusIcon.style.filter = "drop-shadow(0 0 6px #F44336)";
  }
}

// On popup load, restore toggle state, connection status, and scan result
document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.local.get(
    ["protectionActive", "isConnected", "lastScanResult"],
    function (data) {
      const isActive = !!data.protectionActive;
      const isConnected = !!data.isConnected;
      const scanResult = data.lastScanResult || null;
      document.getElementById("toggle-protection").checked = isActive;
      updateUI(isActive, isConnected, scanResult);
    }
  );
});

// On toggle change, update state and UI
document
  .getElementById("toggle-protection")
  .addEventListener("change", function () {
    const isActive = this.checked;
    chrome.storage.local.set({ protectionActive: isActive });
    if (!isActive) chrome.storage.local.set({ isConnected: false });
    updateUI(isActive, false, null);
  });

// Listen for connection status updates from background
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "connectionStatus") {
    chrome.storage.local.set({ isConnected: request.isConnected }, function () {
      chrome.storage.local.get(
        ["protectionActive", "lastScanResult"],
        function (data) {
          updateUI(
            !!data.protectionActive,
            request.isConnected,
            data.lastScanResult || null
          );
        }
      );
    });
  }
});

// Listen for scan result updates from background (optional, if you want to send them)
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "scanResult") {
    chrome.storage.local.set({ lastScanResult: request.result }, function () {
      chrome.storage.local.get(
        ["protectionActive", "isConnected"],
        function (data) {
          updateUI(!!data.protectionActive, !!data.isConnected, request.result);
        }
      );
    });
  }
});
