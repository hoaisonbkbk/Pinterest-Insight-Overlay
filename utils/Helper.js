class Helper {
    //Format number theo locale, mặc định vi-VN
    static formatNumberLocale(num, locale = 'vi-VN') {
        if (num === null || num === undefined || isNaN(num)) return "0";
        return new Intl.NumberFormat(locale).format(num);
    }
    // Tạo URL tương đương curl
    static makePinResourceUrl(pinId) {
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
    static parsePinResourceResponse(json) {
        const data = json?.resource_response?.data ?? json?.data ?? null;
        if (!data) return null;
        return data; // hoặc return data?.pin ?? data
    }
    // Helper: lấy pinId từ anchor /pin/{id}/ hoặc data attribute
    static extractPinIdFromElement(pinEl) {
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
    /**
 * Chuyển chuỗi thời gian sang định dạng yyyy-MM-dd HH:mm
 * @param {string} dateStr - Chuỗi thời gian, ví dụ: "Mon, 06 Oct 2025 16:29:21 +0000"
 * @param {boolean} [useUTC=false] - Nếu true, hiển thị theo giờ UTC; mặc định là giờ địa phương
 * @returns {string} Chuỗi thời gian định dạng yyyy-MM-dd HH:mm
 */
    static formatDateTime(dateStr, useUTC = false) {
  // Chuẩn hóa timezone (thêm dấu ':' nếu thiếu)
  const fixedDateStr = dateStr.replace(/([+-]\d{2})(\d{2})$/, "$1:$2");
  const date = new Date(fixedDateStr);

  if (isNaN(date)) {
    console.error("❌ Lỗi: Không parse được chuỗi thời gian:", dateStr);
    return null;
  }

  const pad = (num) => num.toString().padStart(2, '0');

  const year = useUTC ? date.getUTCFullYear() : date.getFullYear();
  const month = useUTC ? date.getUTCMonth() + 1 : date.getMonth() + 1;
  const day = useUTC ? date.getUTCDate() : date.getDate();
  const hours = useUTC ? date.getUTCHours() : date.getHours();
  const minutes = useUTC ? date.getUTCMinutes() : date.getMinutes();

  return `${year}-${pad(month)}-${pad(day)} ${pad(hours)}:${pad(minutes)}`;
}


}