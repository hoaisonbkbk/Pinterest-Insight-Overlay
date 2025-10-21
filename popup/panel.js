class PinterestPanel {
    constructor() {
        this.currentPage = 1;
        this.recordsPerPage = 10;
        this.sortField = 'createAt';
        this.sortDirection = 'desc';
        this.searchTerm = '';
        this.data = [];
        this.toast = new bootstrap.Toast(document.getElementById('toast'));

        // Load data from chrome.storage
        this.loadData();

        // Initialize event listeners
        this.initializeEventListeners();

        // Initial render
        this.renderTable();
    }

    async loadData() {
        chrome.storage.local.get(null, (items) => {
            const keys = Object.keys(items).filter(key => key.startsWith("pin_detail_"));
            if(!keys || keys.length === 0) {
                console.log("No pin data found in storage.");
                return;
            }
            console.log("📦 List of keys:", keys);
            this.data = keys.map(key => this.mapInfoToPin(items[key]));
            console.log("📥 Loaded pin data:", this.data);
            this.renderTable();
        });
    }

    

    mapInfoToPin(info) {
        return {
            id: info.id,
            title: info.title,
            description: info.description,
            author: info.pinner?.username,
            followerCount: info.pinner?.follower_count,
            board: info.board?.name,
            boardUrl: info.board?.url,
            pinUrl: info.link,
            imageUrl: info.images?.orig?.url,
            reaction: info.reaction_counts?.["1"] || 0,
            comment: info.aggregated_pin_data?.comment_count || 0,
            save: info.aggregated_pin_data?.aggregated_stats?.saves || 0,
            repin: info.repin_count || 0,
            share: info.share_count || 0,
            createAt: info.created_at
        };
    }

    // Removed fake data initialization - now only loads real collected data

    initializeEventListeners() {
        // Search input with debounce
        let searchTimeout;
        document.getElementById('searchInput').addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.searchTerm = e.target.value.toLowerCase();
                this.currentPage = 1;
                this.renderTable();
            }, 300);
        });

        // Records per page
        document.getElementById('recordsPerPage').addEventListener('change', (e) => {
            this.recordsPerPage = parseInt(e.target.value);
            this.currentPage = 1;
            this.renderTable();
        });

        // Sorting
        document.querySelectorAll('th[data-sort]').forEach(th => {
            th.addEventListener('click', () => this.handleSort(th.dataset.sort));
        });

        // Pagination
        document.getElementById('prevPage').addEventListener('click', (e) => {
            e.preventDefault();
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderTable();
            }
        });

        document.getElementById('nextPage').addEventListener('click', (e) => {
            e.preventDefault();
            if (this.currentPage < this.getTotalPages()) {
                this.currentPage++;
                this.renderTable();
            }
        });

        // Export button
        document.getElementById('exportBtn').addEventListener('click', () => this.exportToCSV());
    }

    handleSort(field) {
        if (this.sortField === field) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortField = field;
            this.sortDirection = 'asc';
        }
        this.renderTable();
    }

    getFilteredData() {
        return this.data.filter(item => {
            const searchStr = `${item.id} ${item.author} ${item.board}`.toLowerCase();
            return searchStr.includes(this.searchTerm);
        });
    }

    getSortedData(filteredData) {
        return filteredData.sort((a, b) => {
            let aValue = a[this.sortField];
            let bValue = b[this.sortField];

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }

    getPaginatedData(sortedData) {
        const start = (this.currentPage - 1) * this.recordsPerPage;
        const end = start + this.recordsPerPage;
        return sortedData.slice(start, end);
    }

    getTotalPages() {
        return Math.ceil(this.getFilteredData().length / this.recordsPerPage);
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    formatNumber(num) {
        return new Intl.NumberFormat().format(num);
    }

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

    renderTable() {
        const filteredData = this.getFilteredData();
        const sortedData = this.getSortedData(filteredData);
        const paginatedData = this.getPaginatedData(sortedData);

        const tbody = document.getElementById('tableBody');
        tbody.innerHTML = paginatedData.map(item => `
            <tr>
                <td class="text-nowrap">${item.id || 'No Data'}</td>
                <td class="text-truncate" title="${item.title || 'No Data'}" width="200px">
                    ${item.title ? `<a href="${item.pinUrl}"
                       target="_blank"
                       class="text-decoration-none">
                        ${item.title}
                    </a>` : 'No Data'}
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
                    </a> (Flws: ${this.formatNumber(item.followerCount) || 0})` : 'No Data'}
                </td>
                <td width="200px" class="text-truncate" title="${item.board || 'No Data'}">
                    ${item.board ? `<a href="${item.boardUrl}"
                       target="_blank"
                       class="text-decoration-none">
                        ${item.board}
                    </a>` : 'No Data'}
                </td>

                <td class="text-nowrap">${item.createAt ? Helper.formatDateTime(item.createAt) : 'No Data'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-danger deletePinBtn"
                        data-id = "${item.id}"

                            title="Delete pin">
                        <i class="fa fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        // Add event listeners for delete buttons
        document.querySelectorAll('.deletePinBtn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const pinId = e.target.closest('.deletePinBtn').dataset.id;
                this.deletePin(pinId);
            });
        });

        // Update pagination info
        const startRecordEl = document.getElementById('startRecord');
        const endRecordEl = document.getElementById('endRecord');
        const totalRecordsEl = document.getElementById('totalRecords');

        if (startRecordEl) startRecordEl.textContent =
            Math.min((this.currentPage - 1) * this.recordsPerPage + 1, filteredData.length);
        if (endRecordEl) endRecordEl.textContent =
            Math.min(this.currentPage * this.recordsPerPage, filteredData.length);
        if (totalRecordsEl) totalRecordsEl.textContent = filteredData.length;

        // Update pagination buttons
        const prevPageEl = document.getElementById('prevPage');
        const nextPageEl = document.getElementById('nextPage');

        if (prevPageEl && prevPageEl.parentElement) {
            prevPageEl.parentElement.classList.toggle('disabled', this.currentPage === 1);
        }
        if (nextPageEl && nextPageEl.parentElement) {
            nextPageEl.parentElement.classList.toggle('disabled', this.currentPage === this.getTotalPages());
        }

        // Update sort icons
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

    showToast(title, message) {
        const toastTitle = document.getElementById('toastTitle');
        const toastMessage = document.getElementById('toastMessage');

        if (toastTitle) toastTitle.textContent = title;
        if (toastMessage) toastMessage.textContent = message;

        if (this.toast) {
            this.toast.show();
        }
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('Success', 'URL copied to clipboard');
        }).catch(err => {
            this.showToast('Error', 'Failed to copy URL');
            console.error('Copy failed:', err);
        });
    }

    downloadImage(url, pinId) {
        const a = document.createElement('a');
        a.href = url;
        a.download = `pinterest_${pinId}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        this.showToast('Success', 'Download started');
    }

    async deletePin(pinId) {
        if (confirm('Are you sure you want to delete this pin?')) {
            try {
                // Remove from data array
                this.data = this.data.filter(item => item.id !== pinId);

                // Remove from chrome.storage.local
                const key = `pin_detail_${pinId}`;
                await chrome.storage.local.remove(key);

                // Refresh table
                this.renderTable();

                this.showToast('Success', 'Pin deleted successfully');
                console.log('Deleted pin:', pinId);
            } catch (error) {
                console.error('Error deleting pin:', error);
                this.showToast('Error', 'Failed to delete pin');
            }
        }
    }

    exportToCSV() {
        const filteredData = this.getFilteredData();
        const sortedData = this.getSortedData(filteredData);

        const headers = ['Pin ID', 'Title', 'Description', 'Author', 'Board', 'Reactions', 'Comments', 'Saves',
            'Image URL', 'Created At', 'Board URL', 'Pin URL'];

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

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pinterest_pins_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showToast('Success', 'CSV file exported successfully');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pinterestPanel = new PinterestPanel();
});
