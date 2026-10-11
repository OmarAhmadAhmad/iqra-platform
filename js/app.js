// js/app.js - برمجة خفيفة وعالية الأداء للبحث والتصفية والمفضلة
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    loadBooksList();
    setupSearch();
    checkContinueReading();
    setupDrawer();
    setupViewTabs();
});

let allBooks = [];
let currentView = 'all';

async function loadBooksList() {
    const container = document.getElementById("sectionsContainer");
    if (!container) return;

    try {
        const response = await fetch("./data/books-list.json");
        if (!response.ok) throw new Error("تعذر جلب قائمة الكتب");
        
        const data = await response.json();
        allBooks = Array.isArray(data) ? data : (data.books || []);
        
        updateFavoritesCount();
        renderCurrentView();
        populateDrawerCategories(allBooks);
    } catch (error) {
        console.error("خطأ:", error);
        container.innerHTML = "<p style='text-align: center; color: #e74c3c;'>جاري تحميل المكتبة...</p>";
    }
}

function renderCurrentView() {
    if (currentView === 'favorites') {
        const favorites = getFavoritesList();
        const favBooks = allBooks.filter(book => {
            let id = (book.file || book.id || "").toString().replace(/\.json$/i, '').trim();
            return favorites.includes(id);
        });
        renderCategorizedBooks(favBooks);
    } else {
        renderCategorizedBooks(allBooks);
    }
}

function renderCategorizedBooks(books) {
    const container = document.getElementById("sectionsContainer");
    if (!container) return;
    container.innerHTML = "";

    if (!books || books.length === 0) {
        container.innerHTML = "<p style='text-align: center; padding: 40px; color: var(--text-secondary);'>لا توجد عناصر مطابقة لبحثك.</p>";
        return;
    }

    const categories = {};
    books.forEach(book => {
        const cat = (book && book.category) ? book.category.trim() : 'عام';
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(book);
    });

    Object.keys(categories).forEach((catName) => {
        const catGroup = document.createElement("section");
        catGroup.className = "category-group";
        catGroup.id = `cat-${sanitizeId(catName)}`;

        const iconMap = {
            'المصابيح والأذكار': '📿',
            'دروس ومحاضرات الصلاة': '🕌',
            'دروس ومحاضرات الصيام': '🌙',
            'العبادات والفقه': '📖',
            'أسماء الله الحسنى': '✨',
            'الشخصيات الإسلامية والتراجم': '📜'
        };

        const catIcon = iconMap[catName] || '📚';

        catGroup.innerHTML = `
            <div class="category-header">
                <h2><span>${catIcon}</span> ${catName}</h2>
                <span class="count-badge">${categories[catName].length} عنصراً</span>
            </div>
            <div class="books-grid">
                ${categories[catName].map(book => createBookCardHTML(book)).join('')}
            </div>
        `;

        container.appendChild(catGroup);
    });
}

function createBookCardHTML(book) {
    if (!book) return "";
    let fileName = (book.file || book.id || "").toString().replace(/\.json$/i, '').trim();
    let title = book.title || "عنوان غير مسمى";
    let author = book.author || 'الشيخ أحمد البسفي';
    let desc = book.description ? book.description.substring(0, 85) + '...' : 'مرجع إيماني متميز...';
    
    const favorites = getFavoritesList();
    const isFav = favorites.includes(fileName);

    return `
        <div class="book-card">
            <div class="card-body">
                <div class="card-header-flex">
                    <a href="reader.html?book=${encodeURIComponent(fileName)}" style="text-decoration:none; color:inherit; flex-grow:1;">
                        <h3>${title}</h3>
                    </a>
                    <button class="fav-star-btn" onclick="toggleFavorite('${fileName}', event)" title="إضافة/إزالة من المفضلة">
                        ${isFav ? '⭐' : '☆'}
                    </button>
                </div>
                <p class="book-author">${author}</p>
                <p class="book-desc">${desc}</p>
            </div>
            <div class="card-footer">
                <a href="reader.html?book=${encodeURIComponent(fileName)}" class="read-action" style="text-decoration:none;">اقرأ الآن ➔</a>
            </div>
        </div>
    `;
}

function getFavoritesList() {
    try {
        return JSON.parse(localStorage.getItem("libraryFavorites")) || [];
    } catch(e) { return []; }
}

function toggleFavorite(bookId, event) {
    if (event) event.stopPropagation();
    let favorites = getFavoritesList();
    if (favorites.includes(bookId)) {
        favorites = favorites.filter(id => id !== bookId);
    } else {
        favorites.push(bookId);
    }
    localStorage.setItem("libraryFavorites", JSON.stringify(favorites));
    updateFavoritesCount();
    renderCurrentView();
}

function updateFavoritesCount() {
    const countSpan = document.getElementById("favCount");
    if (countSpan) countSpan.innerText = getFavoritesList().length;
}

function setupDrawer() {
    const menuBtn = document.getElementById("menuBtn");
    const closeDrawer = document.getElementById("closeDrawer");
    const drawer = document.getElementById("sideDrawer");
    const overlay = document.getElementById("drawerOverlay");

    function toggleDrawer() {
        drawer.classList.toggle("open");
        overlay.classList.toggle("active");
    }

    if (menuBtn) menuBtn.addEventListener("click", toggleDrawer);
    if (closeDrawer) closeDrawer.addEventListener("click", toggleDrawer);
    if (overlay) overlay.addEventListener("click", toggleDrawer);
}

function populateDrawerCategories(books) {
    const drawerList = document.getElementById("drawerCategoriesList");
    if (!drawerList) return;

    const categories = [...new Set(books.map(b => b.category ? b.category.trim() : 'عام'))];
    
    drawerList.innerHTML = categories.map(cat => `
        <a href="#cat-${sanitizeId(cat)}" onclick="closeDrawerAndScroll('cat-${sanitizeId(cat)}')">📂 ${cat}</a>
    `).join('') + `<a href="#" onclick="switchView('favorites'); closeDrawer(); return false;">⭐ المفضلة</a>`;
}

function closeDrawerAndScroll(elementId) {
    closeDrawer();
    if (currentView !== 'all') {
        currentView = 'all';
        document.querySelectorAll(".view-tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelector("[data-view='all']").classList.add("active");
        renderCurrentView();
    }
    setTimeout(() => {
        const el = document.getElementById(elementId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
}

function closeDrawer() {
    document.getElementById("sideDrawer").classList.remove("open");
    document.getElementById("drawerOverlay").classList.remove("active");
}

function sanitizeId(str) {
    return str.replace(/\s+/g, '-').replace(/[^\w\u0600-\u06FF-]/g, '');
}

function setupViewTabs() {
    const tabs = document.querySelectorAll(".view-tab-btn");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            currentView = tab.dataset.view;
            renderCurrentView();
        });
    });
}

window.switchView = function(viewName) {
    currentView = viewName;
    document.querySelectorAll(".view-tab-btn").forEach(t => {
        if(t.dataset.view === viewName) t.classList.add("active");
        else t.classList.remove("active");
    });
    renderCurrentView();
};

function setupSearch() {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) return;

    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (!query) {
            renderCurrentView();
            return;
        }

        const baseList = currentView === 'favorites' 
            ? allBooks.filter(b => getFavoritesList().includes((b.file || b.id || "").toString().replace(/\.json$/i, '').trim()))
            : allBooks;

        const filtered = baseList.filter(book => {
            if (!book) return false;
            const t = (book.title || "").toLowerCase();
            const d = (book.description || "").toLowerCase();
            const c = (book.category || "").toLowerCase();
            return t.includes(query) || d.includes(query) || c.includes(query);
        });

        renderCategorizedBooks(filtered);
    });
}

function checkContinueReading() {
    try {
        const lastBook = JSON.parse(localStorage.getItem("lastReadBook"));
        const section = document.getElementById("continueReadingSection");
        if (lastBook && lastBook.id && section) {
            document.getElementById("continueBookTitle").innerText = lastBook.title || "";
            document.getElementById("continueBookBtn").href = `reader.html?book=${encodeURIComponent(lastBook.id)}`;
            section.style.display = "block";
        }
    } catch(e) {}
}

function initTheme() {
    const themeToggle = document.getElementById("themeToggle");
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.setAttribute("data-theme", savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const currentTheme = document.body.getAttribute("data-theme");
            const newTheme = currentTheme === "dark" ? "light" : "dark";
            document.body.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
        });
    }
}
