document.addEventListener("DOMContentLoaded", () => {
  const refreshBtn = document.getElementById("refresh-btn");

  refreshBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "FETCH_PIN_INFO" }, (response) => {
      if (response?.success) {
        const data = response.data;

        document.querySelector(".pin-image").src = data.imageUrl;
        document.querySelector(".pin-title").textContent = data.title;

        const meta = document.querySelector(".pin-meta");
        meta.innerHTML = `
          <span>❤️ ${data.reactions}</span>
          <span>💬 ${data.comments}</span>
          <span>📌 ${data.saves}</span>
        `;
      }
    });
  });
});
