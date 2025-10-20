/**
 * Class PinterestHelper chứa các phương thức để làm việc với Pinterest
 * - Lấy thông tin chi tiết của pin từ API Pinterest
 * - Tạo và hiển thị overlay thông tin trên mỗi pin
 * - Xử lý cache và theo dõi các pin mới
 */
class PinterestHelper {
    /**
     * Lấy thông tin chi tiết của một pin từ API Pinterest
     * @param {string} pinId - ID của pin cần lấy thông tin
     * @returns {Promise<Object|null>} Thông tin chi tiết của pin hoặc null nếu có lỗi
     */
    static async fetchPinDetail(pinId) {
        const url = Helper.makePinResourceUrl(pinId);

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
            const parsed = Helper.parsePinResourceResponse(json);

            return parsed;
        } catch (err) {
            console.error("fetchPinDetail error", err);
            return null;
        }
    }


    /**
     * Tạo key để lưu cache trong sessionStorage
     * @param {string} pinId - ID của pin
     * @returns {string} Key để lưu trong sessionStorage
     */
    static cacheKey(pinId) {
        return `pin_detail_${pinId}`;
    }

    /**
     * Tạo và gắn overlay hiển thị thông tin lên pin
     * Overlay này hiển thị các thông số cơ bản như:
     * - Số lượt reaction
     * - Số lượt comment
     * - Số lượt save
     * - Số lượt repin
     * - Số lượt share
     * 
     * @param {HTMLElement} pinEl - Element của pin cần thêm overlay
     * @param {Object} info - Thông tin chi tiết của pin từ API
     */
    static attachOverlayToPin(pinEl, info) {
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
        let reaction = Helper.formatNumberLocale(info.reaction_counts["1"] ?? 0);
        let comment = Helper.formatNumberLocale(info.aggregated_pin_data.comment_count ?? 0);
        let save = Helper.formatNumberLocale(info.aggregated_pin_data.aggregated_stats.saves ?? 0);
        let repin = Helper.formatNumberLocale(info.repin_count ?? 0);
        let share = Helper.formatNumberLocale(info.share_count ?? 0);

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
            this.showDetailTooltip(pinEl, info);
        });
        box.appendChild(btn);



        // Gắn overlay vào pin
        pinEl.style.position = pinEl.style.position || "relative";
        pinEl.appendChild(box);
    }

    // Hiển thị tooltip chi tiết khi nhấn nút
    /**
     * Hiển thị tooltip với thông tin chi tiết của pin
     * Tooltip này sẽ hiển thị:
     * - Tiêu đề pin
     * - Mô tả
     * - Thông tin tác giả và số lượng follower
     * - Các chỉ số tương tác đầy đủ
     * - Link để mở pin
     * Tooltip sẽ tự động ẩn sau 5 giây
     * 
     * @param {HTMLElement} pinEl - Element của pin cần hiển thị tooltip
     * @param {Object} info - Thông tin chi tiết của pin
     */
    static showDetailTooltip(pinEl, info) {
        // Lấy thông tin chi tiết
        let reaction = Helper.formatNumberLocale(info.reaction_counts["1"] ?? 0);
        let comment = Helper.formatNumberLocale(info.aggregated_pin_data.comment_count ?? 0);
        let save = Helper.formatNumberLocale(info.aggregated_pin_data.aggregated_stats.saves ?? 0);
        let repin = Helper.formatNumberLocale(info.repin_count ?? 0);
        let share = Helper.formatNumberLocale(info.share_count ?? 0);


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
      target="_blank" style="color:#fff;font-weight:600;text-decoration:none;"> ${info.pinner?.username ?? "N/A"} </a> (Followers: ${Helper.formatNumberLocale(info.pinner?.follower_count ?? 0)})
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


    /**
     * Xử lý tất cả các pin có trên trang hiện tại
     * Quy trình xử lý cho mỗi pin:
     * 1. Lấy ID của pin
     * 2. Kiểm tra xem đã có overlay chưa
     * 3. Tìm thông tin trong cache
     * 4. Nếu không có trong cache, gọi API để lấy thông tin
     * 5. Lưu thông tin vào cache
     * 6. Tạo và hiển thị overlay
     */
    static async processPinsOnce() {
        const pins = document.querySelectorAll("div[data-test-id='pin']");
        for (const pin of pins) {
            try {
                const id = Helper.extractPinIdFromElement(pin);
                if (!id) continue;
                if (pin.querySelector(".ext-pin-info-box")) continue;

                const key = this.cacheKey(id);
                let info = null;
                try {
                    const raw = sessionStorage.getItem(key);
                    if (raw) info = JSON.parse(raw);
                } catch (e) { info = null; }

                if (!info) {
                    const fetched = await this.fetchPinDetail(id);
                    if (!fetched) continue;
                    info = fetched;
                    try { sessionStorage.setItem(key, JSON.stringify(info)); } catch { }
                }

                this.attachOverlayToPin(pin, info);
            } catch (err) {
                console.error("processPinsOnce error", err);
            }
        }
    }

    /**
     * Theo dõi và xử lý các pin mới khi chúng xuất hiện trong viewport
     * Sử dụng IntersectionObserver để:
     * - Chỉ xử lý pin khi nó hiển thị trong màn hình
     * - Tối ưu hiệu năng bằng cách không xử lý pin chưa hiển thị
     * - Tự động xử lý pin mới khi người dùng cuộn trang
     * 
     * Pin sẽ được xử lý khi hiển thị 50% diện tích trong viewport
     */
    static observeVisiblePins() {
        const pins = document.querySelectorAll("div[data-test-id='pin']");
        const observer = new IntersectionObserver(async (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    const pin = entry.target;
                    const id = Helper.extractPinIdFromElement(pin);
                    if (!id || pin.querySelector(".ext-pin-info-box")) continue;

                    const key = this.cacheKey(id);
                    let info = null;
                    try {
                        const raw = sessionStorage.getItem(key);
                        if (raw) info = JSON.parse(raw);
                    } catch { }

                    if (!info) {
                        const fetched = await this.fetchPinDetail(id);
                        if (!fetched) continue;
                        info = fetched;
                        try { sessionStorage.setItem(key, JSON.stringify(info)); } catch { }
                    }

                    this.attachOverlayToPin(pin, info);
                }
            }
        }, {
            root: null,
            threshold: 0.5, // khi pin hiển thị 50% mới load
        });

        pins.forEach((p) => observer.observe(p));
    }
}