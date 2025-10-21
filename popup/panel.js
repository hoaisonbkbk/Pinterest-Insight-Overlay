/**
 * Lớp PinterestPanel quản lý giao diện bảng điều khiển của extension Pinterest Insight Overlay
 * Chức năng chính:
 * - Hiển thị danh sách các pin đã thu thập
 * - Tìm kiếm và lọc dữ liệu
 * - Sắp xếp theo các trường khác nhau
 * - Phân trang dữ liệu
 * - Xuất dữ liệu ra CSV
 * - Xóa pin khỏi bộ nhớ
 */
class PinterestPanel {
    /**
     * Khởi tạo đối tượng PinterestPanel
     * Thiết lập các thuộc tính ban đầu và gọi các phương thức khởi tạo
     */
    constructor() {
        this.currentPage = 1; // Trang hiện tại
        this.recordsPerPage = 10; // Số bản ghi mỗi trang
        this.sortField = 'createAt'; // Trường sắp xếp mặc định
        this.sortDirection = 'desc'; // Hướng sắp xếp mặc định (giảm dần)
        this.searchTerm = ''; // Từ khóa tìm kiếm
        this.data = []; // Mảng chứa dữ liệu các pin
        this.toast = new bootstrap.Toast(document.getElementById('toast')); // Đối tượng toast để hiển thị thông báo

        // Tải dữ liệu từ chrome.storage
        this.loadData();

        // Khởi tạo các event listener
        this.initializeEventListeners();

        // Render bảng lần đầu
        this.renderTable();
    }

    /**
     * Tải dữ liệu pin từ chrome.storage.local
     * Lọc các key bắt đầu bằng "pin_detail_" và chuyển đổi thành định dạng pin
     */
    async loadData() {
        chrome.storage.local.get(null, (items) => {
            // Lọc các key chứa thông tin pin
            const keys = Object.keys(items).filter(key => key.startsWith("pin_detail_"));
            if(!keys || keys.length === 0) {
                console.log("Không tìm thấy dữ liệu pin nào trong bộ nhớ.");
                return;
            }
            console.log("📦 Danh sách các key:", keys);
            // Chuyển đổi dữ liệu từ storage thành định dạng pin
            this.data = keys.map(key => this.mapInfoToPin(items[key]));
            console.log("📥 Đã tải dữ liệu pin:", this.data);
            // Render lại bảng sau khi tải dữ liệu
            this.renderTable();
        });
    }

    /**
     * Chuyển đổi thông tin pin từ API thành định dạng phù hợp cho bảng
     * @param {Object} info - Thông tin pin từ API Pinterest
     * @returns {Object} Đối tượng pin đã được format
     */
    mapInfoToPin(info) {
        return {
            id: info.id, // ID của pin
            title: info.title, // Tiêu đề pin
            description: info.description, // Mô tả pin
            author: info.pinner?.username, // Tên tác giả
            followerCount: info.pinner?.follower_count, // Số lượng follower của tác giả
            board: info.board?.name, // Tên board
            boardUrl: info.board?.url, // URL của board
            pinUrl: info.link, // URL của pin
            imageUrl: info.images?.orig?.url, // URL ảnh gốc
            reaction: info.reaction_counts?.["1"] || 0, // Số lượt reaction
            comment: info.aggregated_pin_data?.comment_count || 0, // Số lượt comment
            save: info.aggregated_pin_data?.aggregated_stats?.saves || 0, // Số lượt save
            repin: info.repin_count || 0, // Số lượt repin
            share: info.share_count || 0, // Số lượt share
            createAt: info.created_at // Thời gian tạo
        };
    }

    /**
     * Khởi tạo tất cả các event listener cho các thành phần giao diện
     * Bao gồm: tìm kiếm, phân trang, sắp xếp, xuất dữ liệu
     */
    initializeEventListeners() {
        // Event listener cho ô tìm kiếm với debounce để tránh gọi API quá nhiều
        let searchTimeout;
        document.getElementById('searchInput').addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.searchTerm = e.target.value.toLowerCase();
                this.currentPage = 1; // Reset về trang đầu khi tìm kiếm
                this.renderTable();
            }, 300); // Đợi 300ms sau lần nhập cuối cùng
        });

        // Event listener cho việc thay đổi số bản ghi mỗi trang
        document.getElementById('recordsPerPage').addEventListener('change', (e) => {
            this.recordsPerPage = parseInt(e.target.value);
            this.currentPage = 1; // Reset về trang đầu
            this.renderTable();
        });

        // Event listener cho các header có thể sắp xếp
        document.querySelectorAll('th[data-sort]').forEach(th => {
            th.addEventListener('click', () => this.handleSort(th.dataset.sort));
        });

        // Event listener cho nút Previous trong phân trang
        document.getElementById('prevPage').addEventListener('click', (e) => {
            e.preventDefault();
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderTable();
            }
        });

        // Event listener cho nút Next trong phân trang
        document.getElementById('nextPage').addEventListener('click', (e) => {
            e.preventDefault();
            if (this.currentPage < this.getTotalPages()) {
                this.currentPage++;
                this.renderTable();
            }
        });

        // Event listener cho nút Export CSV
        document.getElementById('exportBtn').addEventListener('click', () => this.exportToCSV());
    }

    /**
     * Xử lý sự kiện sắp xếp khi click vào header của cột
     * @param {string} field - Tên trường cần sắp xếp
     */
    handleSort(field) {
        if (this.sortField === field) {
            // Nếu đang sắp xếp theo trường này, đổi hướng sắp xếp
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            // Nếu sắp xếp theo trường mới, mặc định là tăng dần
            this.sortField = field;
            this.sortDirection = 'asc';
        }
        this.renderTable(); // Render lại bảng sau khi sắp xếp
    }

    /**
     * Lọc dữ liệu dựa trên từ khóa tìm kiếm
     * @returns {Array} Mảng dữ liệu đã được lọc
     */
    getFilteredData() {
        return this.data.filter(item => {
            // Tạo chuỗi tìm kiếm từ ID, tác giả và board
            const searchStr = `${item.id} ${item.author} ${item.board}`.toLowerCase();
            return searchStr.includes(this.searchTerm);
        });
    }

    /**
     * Sắp xếp dữ liệu đã lọc theo trường và hướng đã chọn
     * @param {Array} filteredData - Dữ liệu đã lọc
     * @returns {Array} Dữ liệu đã sắp xếp
     */
    getSortedData(filteredData) {
        return filteredData.sort((a, b) => {
            let aValue = a[this.sortField];
            let bValue = b[this.sortField];

            // Nếu là chuỗi, chuyển về lowercase để sắp xếp không phân biệt hoa thường
            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }

    /**
     * Phân trang dữ liệu đã sắp xếp
     * @param {Array} sortedData - Dữ liệu đã sắp xếp
     * @returns {Array} Dữ liệu của trang hiện tại
     */
    getPaginatedData(sortedData) {
        const start = (this.currentPage - 1) * this.recordsPerPage;
        const end = start + this.recordsPerPage;
        return sortedData.slice(start, end);
    }

    /**
     * Tính tổng số trang dựa trên dữ liệu đã lọc và số bản ghi mỗi trang
     * @returns {number} Tổng số trang
     */
    getTotalPages() {
        return Math.ceil(this.getFilteredData().length / this.recordsPerPage);
    }

    /**
     * Format ngày tháng theo định dạng địa phương
     * @param {string} dateString - Chuỗi ngày tháng
     * @returns {string} Chuỗi ngày tháng đã format
     */
    formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    /**
     * Format số theo định dạng địa phương (có dấu phân cách)
     * @param {number} num - Số cần format
     * @returns {string} Chuỗi số đã format
     */
    formatNumber(num) {
        return new Intl.NumberFormat().format(num);
    }

    /**
     * Render HTML cho các thống kê của pin (không sử dụng trong phiên bản hiện tại)
     * @param {Object} item - Đối tượng pin
     * @returns {string} HTML string của thống kê
     */
    renderStats(item) {
        return `
            <div class="d-flex flex-wrap gap-1">
                <span class="stats-badge">❤️ ${this.formatNumber(item.reaction)}</span>
                <span class="stats-badge">💬 ${this.formatNumber(item.comment)}</span>
                <span class="stats-badge">📌 ${this.formatNumber(item.save)}</span>
                <span class="stats-badge">🔁 ${this.formatNumber(item.repin)}</span>
                <span class="stats-badge">📤 ${this.formatNumber(item.share)}</span>
            </div>
        `;
    }

    /**
     * Render bảng dữ liệu với phân trang, sắp xếp và tìm kiếm
     * Phương thức này được gọi mỗi khi có thay đổi về dữ liệu hoặc trạng thái
     */
    renderTable() {
        // Lấy dữ liệu đã lọc, sắp xếp và phân trang
        const filteredData = this.getFilteredData();
        const sortedData = this.getSortedData(filteredData);
        const paginatedData = this.getPaginatedData(sortedData);

        // Render HTML cho các hàng trong bảng
        const tbody = document.getElementById('tableBody');
        tbody.innerHTML = paginatedData.map(item => `
            <tr>
                <td class="text-nowrap">${item.id || 'Không có dữ liệu'}</td>
                <td class="text-truncate" title="${item.title || 'Không có dữ liệu'}" width="200px">
                    ${item.title ? `<a href="${item.pinUrl}"
                       target="_blank"
                       class="text-decoration-none">
                        ${item.title}
                    </a>` : 'Không có dữ liệu'}
                </td>
                <td class="text-nowrap">${this.formatNumber(item.reaction || 0)}</td>
                <td class="text-nowrap">${this.formatNumber(item.comment || 0)}</td>
                <td class="text-nowrap">${this.formatNumber(item.save || 0)}</td>
                <td class="text-nowrap">${this.formatNumber(item.repin || 0)}</td>
                <td class="text-nowrap">${this.formatNumber(item.share || 0)}</td>
                <td>
                    ${item.author ? `<a href="https://pinterest.com/${item.author}"
                       target="_blank"
                       class="text-decoration-none">
                        ${item.author}
                    </a> (Flws: ${this.formatNumber(item.followerCount) || 0})` : 'Không có dữ liệu'}
                </td>
                <td width="200px" class="text-truncate" title="${item.board || 'Không có dữ liệu'}">
                    ${item.board ? `<a href="${item.boardUrl}"
                       target="_blank"
                       class="text-decoration-none">
                        ${item.board}
                    </a>` : 'Không có dữ liệu'}
                </td>

                <td class="text-nowrap">${item.createAt ? Helper.formatDateTime(item.createAt) : 'Không có dữ liệu'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-danger deletePinBtn"
                        data-id = "${item.id}"

                            title="Xóa pin">
                        <i class="fa fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        // Thêm event listener cho các nút xóa pin
        document.querySelectorAll('.deletePinBtn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const pinId = e.target.closest('.deletePinBtn').dataset.id;
                this.deletePin(pinId);
            });
        });

        // Cập nhật thông tin phân trang
        const startRecordEl = document.getElementById('startRecord');
        const endRecordEl = document.getElementById('endRecord');
        const totalRecordsEl = document.getElementById('totalRecords');

        if (startRecordEl) startRecordEl.textContent =
            Math.min((this.currentPage - 1) * this.recordsPerPage + 1, filteredData.length);
        if (endRecordEl) endRecordEl.textContent =
            Math.min(this.currentPage * this.recordsPerPage, filteredData.length);
        if (totalRecordsEl) totalRecordsEl.textContent = filteredData.length;

        // Cập nhật trạng thái các nút phân trang
        const prevPageEl = document.getElementById('prevPage');
        const nextPageEl = document.getElementById('nextPage');

        if (prevPageEl && prevPageEl.parentElement) {
            prevPageEl.parentElement.classList.toggle('disabled', this.currentPage === 1);
        }
        if (nextPageEl && nextPageEl.parentElement) {
            nextPageEl.parentElement.classList.toggle('disabled', this.currentPage === this.getTotalPages());
        }

        // Cập nhật icon sắp xếp cho các header
        document.querySelectorAll('th[data-sort]').forEach(th => {
            const icon = th.querySelector('.sort-icon');
            if (icon) {
                if (th.dataset.sort === this.sortField) {
                    icon.textContent = this.sortDirection === 'asc' ? '↑' : '↓';
                } else {
                    icon.textContent = '↕️';
                }
            }
        });
    }

    /**
     * Hiển thị thông báo toast
     * @param {string} title - Tiêu đề thông báo
     * @param {string} message - Nội dung thông báo
     */
    showToast(title, message) {
        const toastTitle = document.getElementById('toastTitle');
        const toastMessage = document.getElementById('toastMessage');

        if (toastTitle) toastTitle.textContent = title;
        if (toastMessage) toastMessage.textContent = message;

        if (this.toast) {
            this.toast.show();
        }
    }

    /**
     * Sao chép văn bản vào clipboard (không sử dụng trong phiên bản hiện tại)
     * @param {string} text - Văn bản cần sao chép
     */
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('Thành công', 'URL đã được sao chép vào clipboard');
        }).catch(err => {
            this.showToast('Lỗi', 'Không thể sao chép URL');
            console.error('Lỗi sao chép:', err);
        });
    }

    /**
     * Tải ảnh từ URL (không sử dụng trong phiên bản hiện tại)
     * @param {string} url - URL của ảnh
     * @param {string} pinId - ID của pin
     */
    downloadImage(url, pinId) {
        const a = document.createElement('a');
        a.href = url;
        a.download = `pinterest_${pinId}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        this.showToast('Thành công', 'Đã bắt đầu tải xuống');
    }

    /**
     * Xóa pin khỏi bộ nhớ và giao diện
     * @param {string} pinId - ID của pin cần xóa
     */
    async deletePin(pinId) {
        if (confirm('Bạn có chắc chắn muốn xóa pin này?')) {
            try {
                // Xóa khỏi mảng dữ liệu
                this.data = this.data.filter(item => item.id !== pinId);

                // Xóa khỏi chrome.storage.local
                const key = `pin_detail_${pinId}`;
                await chrome.storage.local.remove(key);

                // Làm mới bảng
                this.renderTable();

                this.showToast('Thành công', 'Đã xóa pin thành công');
                console.log('Đã xóa pin:', pinId);
            } catch (error) {
                console.error('Lỗi khi xóa pin:', error);
                this.showToast('Lỗi', 'Không thể xóa pin');
            }
        }
    }

    /**
     * Xuất dữ liệu pin ra file CSV
     * Tạo file CSV với tất cả dữ liệu đã lọc và sắp xếp
     */
    exportToCSV() {
        const filteredData = this.getFilteredData();
        const sortedData = this.getSortedData(filteredData);

        // Định nghĩa các header cho file CSV
        const headers = ['Pin ID', 'Tiêu đề', 'Mô tả', 'Tác giả', 'Board', 'Lượt thích', 'Bình luận', 'Lưu',
            'URL ảnh', 'Ngày tạo', 'URL Board', 'URL Pin'];

        // Tạo nội dung CSV
        const csvContent = [
            headers.join(','),
            ...sortedData.map(item => [
                item.id || '',
                item.title || '',
                item.description || '',
                item.author || '',
                item.board || '',
                item.reaction || 0,
                item.comment || 0,
                item.save || 0,
                item.imageUrl || '',
                item.createAt || '',
                item.boardUrl || '',
                item.pinUrl || ''
            ].map(field => `"${field}"`).join(','))
        ].join('\n');

        // Tạo blob và tải xuống file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pinterest_pins_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showToast('Thành công', 'Đã xuất file CSV thành công');
    }
}

// Khởi tạo đối tượng PinterestPanel khi DOM đã tải xong
document.addEventListener('DOMContentLoaded', () => {
    window.pinterestPanel = new PinterestPanel();
});
