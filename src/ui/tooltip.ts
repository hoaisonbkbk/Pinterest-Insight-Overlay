// src/ui/tooltip.ts
export function showTooltipMock(pin: HTMLElement, data: any) {
  // Xoá tooltip cũ (nếu có)
  document.querySelectorAll(".pin-tooltip").forEach((t) => t.remove());

  const tooltip = document.createElement("div");
  tooltip.className = "pin-tooltip";
  tooltip.innerHTML = `
    <h4>Chi tiết Gim</h4>
    <p>❤️ Reaction: ${data.reaction}</p>
    <p>💬 Bình luận: ${data.comments}</p>
    <p>📌 Lưu: ${data.saves}</p>
    <p>📅 Ngày: ${new Date().toLocaleDateString()}</p>
  `;

  pin.appendChild(tooltip);

  setTimeout(() => tooltip.remove(), 4000); // Tự ẩn sau 4s
}
