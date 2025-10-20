
// content-script.js
console.log("Pinterest content script active");

function formatNumberLocale(num, locale = 'vi-VN') {
    if (num === null || num === undefined || isNaN(num)) return "0";
    return new Intl.NumberFormat(locale).format(num);
}

// Helper: lấy pinId từ anchor /pin/{id}/ hoặc data attribute
function extractPinIdFromElement(pinEl) {
  const a = pinEl.querySelector('a[href*="/pin/"]');
  if (a && a.href) {
    const m = a.href.match(/\/pin\/(\d+)/);
    if (m) return m[1];
  }
  if (pinEl.dataset && (pinEl.dataset.pinId || pinEl.dataset.id)) {
    return pinEl.dataset.pinId || pinEl.dataset.id;
  }
  return null;
}

// Tạo URL tương đương curl
function makePinResourceUrl(pinId) {
  const payload = {
    options: {
      id: pinId,
      field_set_key: "detailed",
      fetch_visual_search_objects: true,
    },
    context: {},
  };

  const dataParam = encodeURIComponent(JSON.stringify(payload));
  const sourceUrl = encodeURIComponent(`/pin/${pinId}/`);
  const ts = Date.now();
  return `https://www.pinterest.com/resource/PinResource/get/?_=${ts}&data=${dataParam}&source_url=${sourceUrl}`;
}

// ✅ ĐÃ SỬA: Thêm return và dấu đóng ngoặc
function parsePinResourceResponse(json) {
  const data = json?.resource_response?.data ?? json?.data ?? null;
  if (!data) return null;
  return data; // hoặc return data?.pin ?? data
}

// Gọi API giống curl — sử dụng credentials: 'include' để gửi cookie đăng nhập
async function fetchPinDetail(pinId) {
  const url = makePinResourceUrl(pinId);

  const headers = {
    accept: "*/*",
    "accept-language": "en,en-US;q=0.9",
    referer: "https://www.pinterest.com/",
    "x-pinterest-appstate": "active",
    "x-pinterest-pws-handler": "www/pin/[id].js",
    "x-pinterest-source-url": `/pin/${pinId}/`,
  };

  try {
    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: headers,
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} - ${txt}`);
    }

    const json = await res.json();
    const parsed = parsePinResourceResponse(json);

    return parsed;
  } catch (err) {
    console.error("fetchPinDetail error", err);
    return null;
  }
}

function cacheKey(pinId) {
  return `pin_detail_${pinId}`;
}

function attachOverlayToPin(pinEl, info) {
  if (!pinEl || pinEl.querySelector(".ext-pin-info-box")) return;

  // Cấu hình giao diện trước khi thêm thông tin
  const box = document.createElement("div");
  box.className = "ext-pin-info-box";
  box.style.position = "absolute";
  box.style.top = "8px";
  box.style.left = "8px";
  box.style.background = "rgba(30,30,30,0.45)";
  box.style.color = "#fff";
  box.style.backdropFilter = "blur(6px)";

  box.style.border = "1px solid rgba(255,255,255,0.2)";
  box.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
  box.style.padding = "6px 8px";
  box.style.fontSize = "12px";

  box.style.zIndex = "99999";
  box.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
  box.style.display = "flex";
  box.style.flexDirection = "column";
  box.style.gap = "4px";
  box.style.minWidth = "85px";

  // Đọc thông tin từ dữ liệu đã lấy
  let reaction = formatNumberLocale(info.reaction_counts["1"] ?? 0);
  let comment = formatNumberLocale(info.aggregated_pin_data.comment_count ?? 0);
  let save = formatNumberLocale(info.aggregated_pin_data.aggregated_stats.saves ?? 0);
  let repin = formatNumberLocale(info.repin_count ?? 0);
  let share = formatNumberLocale(info.share_count ?? 0);

  // Giờ là gán dữ liệu vào overlay
  const likes = document.createElement("div");
  likes.textContent = `❤️ Reaction: ${reaction}`;
  const comments = document.createElement("div");
  comments.textContent = `💬 Cmt: ${comment}`;
  const saves = document.createElement("div");
  saves.textContent = `📌 Save: ${save}`;
  const repins = document.createElement("div");
  repins.textContent = `🔁 Repin: ${repin}`
  const shares = document.createElement("div");
  shares.textContent = `📤 Share: ${share}`;

  box.appendChild(likes);
  box.appendChild(comments);
  box.appendChild(saves);
  box.appendChild(repins);
  box.appendChild(shares);

  //-- Nút mở info chi tiết
  const btn = document.createElement("button");
  btn.textContent = "ℹ️ Info";
  btn.style.display = "contents";
  btn.style.cursor = "pointer";
  btn.style.border = "none";
  btn.style.color = "#fff";
  btn.style.background = "transparent";
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    showDetailTooltip(pinEl, info);
  });
  box.appendChild(btn);



  // Gắn overlay vào pin
  pinEl.style.position = pinEl.style.position || "relative";
  pinEl.appendChild(box);
}

// Hiển thị tooltip chi tiết khi nhấn nút
function showDetailTooltip(pinEl, info) {
  // Lấy thông tin chi tiết
  let reaction = formatNumberLocale(info.reaction_counts["1"] ?? 0);
  let comment = formatNumberLocale(info.aggregated_pin_data.comment_count ?? 0);
  let save = formatNumberLocale(info.aggregated_pin_data.aggregated_stats.saves ?? 0);
  let repin = formatNumberLocale(info.repin_count ?? 0);
  let share = formatNumberLocale(info.share_count ?? 0);


  document.querySelectorAll(".ext-pin-tooltip").forEach((t) => t.remove());

  const t = document.createElement("div");
  t.className = "ext-pin-tooltip";
  t.style.position = "absolute";
  t.style.bottom = "40px";
  t.style.left = "5px";
  t.style.width = "220px";
  t.style.background = "rgba(30,30,30,0.45)";
  t.style.color = "#fff";
  t.style.backdropFilter = "blur(6px)";
  t.style.border = "1px solid rgba(255,255,255,0.2)";
  t.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
  t.style.borderRadius = "5px";
  t.style.padding = "5px";
  t.style.zIndex = "1000000";
  t.style.overflow = "visible";
  t.innerHTML = `
    <div style="font-weight:600;margin-bottom:6px;">${info.title ?? "(No title)"}</div>
    <div style="font-size:12px;color:#fff;margin-bottom:6px;">${info.description ?? ""}</div>
    <div style="font-size:12px;color:#fff;margin-bottom:6px;">
      <strong>Author:</strong> <a href="https://www.pinterest.com/${info.pinner?.username ?? '#'}/" 
      target="_blank" style="color:#fff;font-weight:600;text-decoration:none;"> ${info.pinner?.username ?? "N/A"} </a> (Followers: ${formatNumberLocale(info.pinner?.follower_count ?? 0)})
    </div>
    <div style="display:flex;gap:8px;font-size:13px;">
      <div>❤️ ${reaction}</div> 
      <div>💬 ${comment}</div>
      <div>📌 ${save}</div>
      <div>🔁 ${repin}</div>
      <div>📤 ${share}</div>
    </div>
    <div style="margin-top:8px;text-align:left;">
      
      <a href="${info.link ?? "#"}" target="_blank" style="color:#e60023;font-weight:600;text-decoration:none;">Open</a>
    </div>
  `;
  pinEl.appendChild(t);

  setTimeout(() => {
    try { t.remove(); } catch (e) { }
  }, 5000);
}

async function processPinsOnce() {
  const pins = document.querySelectorAll("div[data-test-id='pin']");
  for (const pin of pins) {
    try {
      const id = extractPinIdFromElement(pin);
      if (!id) continue;
      if (pin.querySelector(".ext-pin-info-box")) continue;

      const key = cacheKey(id);
      let info = null;
      try {
        const raw = sessionStorage.getItem(key);
        if (raw) info = JSON.parse(raw);
      } catch (e) { info = null; }

      if (!info) {
        const fetched = await fetchPinDetail(id);
        if (!fetched) continue;
        info = fetched;
        try { sessionStorage.setItem(key, JSON.stringify(info)); } catch { }
      }

      attachOverlayToPin(pin, info);
    } catch (err) {
      console.error("processPinsOnce error", err);
    }
  }
}

function observeVisiblePins() {
  const pins = document.querySelectorAll("div[data-test-id='pin']");
  const observer = new IntersectionObserver(async (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const pin = entry.target;
        const id = extractPinIdFromElement(pin);
        if (!id || pin.querySelector(".ext-pin-info-box")) continue;

        const key = cacheKey(id);
        let info = null;
        try {
          const raw = sessionStorage.getItem(key);
          if (raw) info = JSON.parse(raw);
        } catch {}

        if (!info) {
          const fetched = await fetchPinDetail(id);
          if (!fetched) continue;
          info = fetched;
          try { sessionStorage.setItem(key, JSON.stringify(info)); } catch {}
        }

        attachOverlayToPin(pin, info);
      }
    }
  }, {
    root: null,
    threshold: 0.5, // khi pin hiển thị 50% mới load
  });

  pins.forEach((p) => observer.observe(p));
}

const observer = new MutationObserver(() => {
  processPinsOnce().then(observeVisiblePins);
});
const mutationObserver = new MutationObserver(() => observeVisiblePins());
mutationObserver.observe(document.body, { childList: true, subtree: true });

processPinsOnce().then(observeVisiblePins);
