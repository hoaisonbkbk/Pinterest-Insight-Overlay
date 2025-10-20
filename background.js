// background.js - Chrome Extension Service Worker

// Lắng nghe khi extension được cài hoặc cập nhật
chrome.runtime.onInstalled.addListener(() => {
  console.log("Pinterest Info Extension đã được cài đặt!");
});

// Lắng nghe message từ content script hoặc popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Nhận message:", message);

  // Giả lập phản hồi API
  if (message.type === "FETCH_PIN_INFO") {
    // Giả lập dữ liệu Pinterest
    const fakeData = {
      title: "Summer Dress Collection",
      reactions: 245,
      comments: 37,
      saves: 120,
      imageUrl: "https://via.placeholder.com/150",
      author: "Pinterest User",
    };

    sendResponse({ success: true, data: fakeData });
  }

  // Nếu xử lý async, return true để giữ kênh phản hồi mở
  return true;
});

// (Tùy chọn) Lắng nghe click vào action icon trên thanh Chrome
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content-script.js"],
  });
});
