// src/ui/overlay.ts
export function createOverlayMock(pinElement: HTMLElement) {
  // Container overlay
  const overlay = document.createElement("div");
  overlay.className = "pinterest-overlay";

  // Fake dữ liệu
  const data = {
    reaction: Math.floor(Math.random() * 200),
    comments: Math.floor(Math.random() * 50),
    saves: Math.floor(Math.random() * 1000),
  };

  overlay.innerHTML = `
    <div class="overlay-content">
      <span>❤️ ${data.reaction}</span>
      <span>💬 ${data.comments}</span>
      <span>📌 ${data.saves}</span>
      <button class="info-btn">ℹ️</button>
    </div>
  `;

  // Khi bấm icon ℹ️ -> mở tooltip
  overlay.querySelector(".info-btn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    import("./tooltip").then(({ showTooltipMock }) => {
      showTooltipMock(pinElement, data);
    });
  });

  pinElement.style.position = "relative";
  pinElement.appendChild(overlay);
}
