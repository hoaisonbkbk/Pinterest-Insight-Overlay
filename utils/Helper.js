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

}