let allBooksData = [];
let currentFilter = 'all';

document.addEventListener("DOMContentLoaded", () => {
    loadBooksList();
    setupSearch();
});

async function loadBooksList() {
    try {
        let response = await fetch('data/books-list.json');
        if (!response.ok) throw new Error('تعذر تحميل قائمة الكتب');
        
        let booksMeta = await response.json();
        allBooksData = booksMeta.map((b, index) => ({
            ...b,
            id: b.file,
            isLatest: index === booksMeta.length - 1
        }));

        buildCategoriesSidebar();
        renderBooks(allBooksData);
    } catch (error) {
        console.error('خطأ في تحميل المكتبة:', error);
    }
}

function buildCategoriesSidebar() {
    const categoriesListEl = document.getElementById('categoriesList');
    if (!categoriesListEl) return;

    let categories = [...new Set(allBooksData.map(b => b.category || 'عام'))];
    categoriesListEl.innerHTML = '';

    categories.forEach(cat => {
        let count = allBooksData.filter(b => (b.category || 'عام') === cat).length;
        let item = document.createElement('a');
        item.href = '#';
        item.className = 'nav-item';
        item.innerHTML = `📁 ${cat} <span style="float: left; font-size: 0.8rem; opacity: 0.7;">(${count})</span>`;
        item.onclick = (e) => filterCategory(cat, e);
        categoriesListEl.appendChild(item);
    });
}

function filterCategory(category, event) {
    if (event) event.preventDefault();
    currentFilter = category;

    document.querySelectorAll('.sidebar-nav .nav-item').forEach(el => el.classList.remove('active'));
    if (event && event.currentTarget) event.currentTarget.classList.add('active');

    let filtered = [];
    if (category === 'all') {
        filtered = allBooksData;
    } else if (category === 'favorites') {
        let favs = getFavorites();
        filtered = allBooksData.filter(b => favs.includes(b.id));
    } else {
        filtered = allBooksData.filter(b => (b.category || 'عام') === category);
    }

    renderBooks(filtered);

    if (window.innerWidth <= 768) {
        toggleSidebar();
    }
}

function renderBooks(booksList) {
    const container = document.getElementById('sectionsContainer');
    if (!container) return;

    container.innerHTML = '';

    if (booksList.length === 0) {
        container.innerHTML = `<p style="text-align: center; color: #64748b; padding: 40px;">لا توجد كتب في هذا القسم حالياً.</p>`;
        return;
    }

    let favorites = getFavorites();
    let grid = document.createElement('div');
    grid.className = 'books-grid';

    booksList.forEach(book => {
        let isFav = favorites.includes(book.id);
        let card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML = `
            ${book.isLatest ? '<span class="latest-badge">✨ أحدث إضافة</span>' : ''}
            <div>
                <h3>${book.title}</h3>
                ${book.author ? `<p class="author">${book.author}</p>` : ''}
                ${book.description ? `<p class="desc">${book.description}</p>` : ''}
            </div>
            <div class="card-actions">
                <button class="read-btn" onclick="openBookReader('${book.file}', '${book.pdfUrl || ''}')">اقرأ الآن ←</button>
                <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite('${book.id}', event)" title="إضافة للمفضلة">
                    ${isFav ? '❤️' : '🤍'}
                </button>
            </div>
        `;
        grid.appendChild(card);
    });

    container.appendChild(grid);
}

function getFavorites() {
    let favs = localStorage.getItem('app_favorites');
    return favs ? JSON.parse(favs) : [];
}

function toggleFavorite(bookId, event) {
    event.stopPropagation();
    let favs = getFavorites();
    let index = favs.indexOf(bookId);

    if (index > -1) {
        favs.splice(index, 1);
    } else {
        favs.push(bookId);
    }

    localStorage.setItem('app_favorites', JSON.stringify(favs));
    renderBooks(currentFilter === 'all' ? allBooksData : allBooksData.filter(b => getFavorites().includes(b.id)));
}

function toggleSidebar() {
    const sidebar = document.getElementById('appSidebar');
    if (sidebar) sidebar.classList.toggle('open');
}

function openBookReader(fileName, pdfUrl) {
    if (pdfUrl) {
        window.location.href = `reader.html?pdf=${encodeURIComponent(pdfUrl)}&book=${fileName}`;
    } else {
        window.location.href = `reader.html?file=${fileName}`;
    }
}

function setupSearch() {
    const input = document.getElementById('searchInput');
    if (!input) return;

    input.addEventListener('input', (e) => {
        let query = e.target.value.trim().toLowerCase();
        if (!query) {
            renderBooks(allBooksData);
            return;
        }

        let filtered = allBooksData.filter(b => 
            b.title.toLowerCase().includes(query) || 
            (b.author && b.author.toLowerCase().includes(query)) ||
            (b.description && b.description.toLowerCase().includes(query))
        );

        renderBooks(filtered);
    });
}
