class PinterestDashboard {
    constructor() {
        this.currentPage = 1;
        this.recordsPerPage = 10;
        this.sortField = 'createAt';
        this.sortDirection = 'desc';
        this.searchTerm = '';
        this.dateFilter = 'all';
        this.boardFilter = 'all';
        this.data = [];
        this.toast = new bootstrap.Toast(document.getElementById('toast'));
        
        // Load data from localStorage or initialize with fake data
        this.loadData();
        this.updateStats();
        this.populateBoardFilter();
        
        // Initialize event listeners
        this.initializeEventListeners();
        
        // Initial render
        this.renderTable();
    }

    loadData() {
        try {
            const savedData = localStorage.getItem('pinterestPins');
            if (savedData) {
                this.data = JSON.parse(savedData);
            } else {
                this.initializeFakeData();
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.initializeFakeData();
        }
    }

    saveData() {
        try {
            localStorage.setItem('pinterestPins', JSON.stringify(this.data));
        } catch (error) {
            console.error('Error saving data:', error);
            this.showToast('Error', 'Failed to save data to localStorage');
        }
    }

    initializeFakeData() {
        const boards = [
            { name: 'DIY Projects', category: 'Crafts' },
            { name: 'Fashion Inspiration', category: 'Fashion' },
            { name: 'Home Decor', category: 'Home' },
            { name: 'Recipe Collection', category: 'Food' },
            { name: 'Travel Goals', category: 'Travel' }
        ];
        
        const authors = [
            { username: 'craftlover', followers: 15000 },
            { username: 'fashionista', followers: 25000 },
            { username: 'homedesigner', followers: 18000 },
            { username: 'foodie_chef', followers: 30000 },
            { username: 'wanderlust', followers: 22000 }
        ];
        
        for (let i = 1; i <= 100; i++) {
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 30));
            
            const boardIndex = Math.floor(Math.random() * boards.length);
            const authorIndex = Math.floor(Math.random() * authors.length);
            
            this.data.push({
                id: Math.floor(Math.random() * 1000000000),
                reaction: Math.floor(Math.random() * 1000) + 100,
                comment: Math.floor(Math.random() * 200) + 20,
                save: Math.floor(Math.random() * 500) + 50,
                repin: Math.floor(Math.random() * 300) + 30,
                share: Math.floor(Math.random() * 100) + 10,
                imageUrl: `https://source.unsplash.com/random/200x300?sig=${i}`,
                createAt: date.toISOString(),
                author: authors[authorIndex].username,
                authorFollowers: authors[authorIndex].followers,
                board: boards[boardIndex].name,
                boardCategory: boards[boardIndex].category,
                boardUrl: `https://pinterest.com/${authors[authorIndex].username}/${boards[boardIndex].name.toLowerCase().replace(' ', '-')}`,
                pinUrl: `https://pinterest.com/pin/${Math.floor(Math.random() * 1000000000)}`
            });
        }
        
        this.saveData();
    }

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

        // Date filter
        document.getElementById('dateFilter').addEventListener('change', (e) => {
            this.dateFilter = e.target.value;
            this.currentPage = 1;
            this.renderTable();
        });

        // Board filter
        document.getElementById('boardFilter').addEventListener('change', (e) => {
            this.boardFilter = e.target.value;
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

    updateStats() {
        const stats = this.data.reduce((acc, item) => {
            acc.reactions += item.reaction;
            acc.comments += item.comment;
            acc.shares += item.share;
            acc.saves += item.save;
            return acc;
        }, { reactions: 0, comments: 0, shares: 0, saves: 0 });

        document.getElementById('totalReactions').textContent = this.formatNumber(stats.reactions);
        document.getElementById('totalComments').textContent = this.formatNumber(stats.comments);
        document.getElementById('totalShares').textContent = this.formatNumber(stats.shares);
        document.getElementById('totalSaves').textContent = this.formatNumber(stats.saves);
    }

    populateBoardFilter() {
        const boards = [...new Set(this.data.map(item => item.board))].sort();
        const select = document.getElementById('boardFilter');
        
        boards.forEach(board => {
            const option = document.createElement('option');
            option.value = board;
            option.textContent = board;
            select.appendChild(option);
        });
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
            const matchesSearch = searchStr.includes(this.searchTerm);
            
            let matchesDate = true;
            const itemDate = new Date(item.createAt);
            const now = new Date();
            
            switch(this.dateFilter) {
                case 'today':
                    matchesDate = itemDate.toDateString() === now.toDateString();
                    break;
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    matchesDate = itemDate >= weekAgo;
                    break;
                case 'month':
                    matchesDate = itemDate.getMonth() === now.getMonth() &&
                                itemDate.getFullYear() === now.getFullYear();
                    break;
            }
            
            const matchesBoard = this.boardFilter === 'all' || item.board === this.boardFilter;
            
            return matchesSearch && matchesDate && matchesBoard;
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
            <div class="d-flex flex-wrap gap-2">
                <span class="stats-badge">
                    <i class="fas fa-heart text-danger"></i>
                    ${this.formatNumber(item.reaction)}
                </span>
                <span class="stats-badge">
                    <i class="fas fa-comment text-primary"></i>
                    ${this.formatNumber(item.comment)}
                </span>
                <span class="stats-badge">
                    <i class="fas fa-bookmark text-success"></i>
                    ${this.formatNumber(item.save)}
                </span>
                <span class="stats-badge">
                    <i class="fas fa-retweet text-info"></i>
                    ${this.formatNumber(item.repin)}
                </span>
                <span class="stats-badge">
                    <i class="fas fa-share-alt text-secondary"></i>
                    ${this.formatNumber(item.share)}
                </span>
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
                <td class="text-nowrap">
                    <span class="badge bg-light text-dark">
                        ${item.id}
                    </span>
                </td>
                <td>
                    <img src="${item.imageUrl}" 
                         alt="Pin thumbnail" 
                         class="thumbnail" 
                         data-bs-toggle="tooltip" 
                         title="Click to view original">
                </td>
                <td>${this.renderStats(item)}</td>
                <td>
                    <a href="https://pinterest.com/${item.author}" 
                       target="_blank" 
                       class="text-decoration-none">
                        <div class="d-flex align-items-center gap-2">
                            <img src="https://ui-avatars.com/api/?name=${item.author}&size=32&background=random" 
                                 class="rounded-circle" 
                                 width="32" 
                                 height="32">
                            <div>
                                <div>@${item.author}</div>
                                <small class="text-muted">${this.formatNumber(item.authorFollowers)} followers</small>
                            </div>
                        </div>
                    </a>
                </td>
                <td>
                    <a href="${item.boardUrl}" 
                       target="_blank"
                       class="board-link">
                        <div>${item.board}</div>
                        <small class="text-muted">${item.boardCategory}</small>
                    </a>
                </td>
                <td class="text-nowrap">
                    <div>${this.formatDate(item.createAt)}</div>
                </td>
                <td>
                    <div class="btn-group">
                        <a href="${item.pinUrl}" 
                           target="_blank" 
                           class="btn btn-sm btn-outline-primary btn-action" 
                           data-bs-toggle="tooltip" 
                           title="Open pin">
                            <i class="fas fa-external-link-alt"></i>
                        </a>
                        <button class="btn btn-sm btn-outline-success btn-action" 
                                onclick="window.pinterestDashboard.copyToClipboard('${item.imageUrl}')"
                                data-bs-toggle="tooltip" 
                                title="Copy image URL">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-info btn-action" 
                                onclick="window.pinterestDashboard.downloadImage('${item.imageUrl}', ${item.id})"
                                data-bs-toggle="tooltip" 
                                title="Download image">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Initialize tooltips
        const tooltips = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltips.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });

        // Update pagination info
        document.getElementById('startRecord').textContent = 
            Math.min((this.currentPage - 1) * this.recordsPerPage + 1, filteredData.length);
        document.getElementById('endRecord').textContent = 
            Math.min(this.currentPage * this.recordsPerPage, filteredData.length);
        document.getElementById('totalRecords').textContent = filteredData.length;

        // Update pagination buttons
        document.getElementById('prevPage').parentElement.classList.toggle(
            'disabled', this.currentPage === 1
        );
        document.getElementById('nextPage').parentElement.classList.toggle(
            'disabled', this.currentPage === this.getTotalPages()
        );

        // Update sort icons
        document.querySelectorAll('th[data-sort]').forEach(th => {
            const icon = th.querySelector('i.fas');
            if (th.dataset.sort === this.sortField) {
                icon.className = `fas fa-sort-${this.sortDirection === 'asc' ? 'up' : 'down'} ms-1`;
            } else {
                icon.className = 'fas fa-sort ms-1';
            }
        });
    }

    showToast(title, message) {
        document.getElementById('toastTitle').textContent = title;
        document.getElementById('toastMessage').textContent = message;
        this.toast.show();
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

    exportToCSV() {
        const filteredData = this.getFilteredData();
        const sortedData = this.getSortedData(filteredData);
        
        const headers = ['Pin ID', 'Reactions', 'Comments', 'Saves', 'Repins', 'Shares', 
                        'Image URL', 'Created At', 'Author', 'Author Followers',
                        'Board', 'Board Category', 'Board URL', 'Pin URL'];
        
        const csvContent = [
            headers.join(','),
            ...sortedData.map(item => [
                item.id,
                item.reaction,
                item.comment,
                item.save,
                item.repin,
                item.share,
                item.imageUrl,
                item.createAt,
                item.author,
                item.authorFollowers,
                item.board,
                item.boardCategory,
                item.boardUrl,
                item.pinUrl
            ].join(','))
        ].join('\\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pinterest_insights_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showToast('Success', 'CSV file exported successfully');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pinterestDashboard = new PinterestDashboard();
    
    // Enable all tooltips
    const tooltips = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltips.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});