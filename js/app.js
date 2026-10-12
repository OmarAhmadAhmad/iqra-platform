let allBooks = [];
let currentMode = 'all';

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    loadBooksList();
    setupSearch();
    checkContinueReading();
});

async function loadBooksList() {
    const container = document.getElementById("sectionsContainer");
    if (!container) return;

    try {
        const response = await fetch("./data/books-list.json");
        if (!response.ok) throw new Error("تعذر جلب البيانات");
        
        const data = await response.json();
        allBooks = Array.isArray(data) ? data : (data.books || []);
        
        updateFavoritesCount();
        renderView();
    } catch (error) {
        console.error(error);
        container.innerHTML = "<p style='text-align: center; color: #ef4444;'>تعذر تحميل المكتبة، تأكد من الاتصال أو الملفات.</p>";
    }
}

function switchMainView(mode) {
    currentMode = mode;
    document.getElementById('tabAll').classList.toggle('active', mode === 'all');
    document.getElementById('tabFav').classList.toggle('active', mode === 'favorites');
    renderView();
}

function renderView() {
    if (currentMode === 'favorites') {
        const favs = getFavorites();
        const favBooks = allBooks.filter(b => {
            let id = (b.file || b.id || "").toString().replace(/\.json$/i, '').trim();
            return favs.includes(id);
        });
        renderCategorized(favBooks);
    } else {
        renderCategorized(allBooks);
    }
}

function renderCategorized(books) {
    const container = document.getElementById("sectionsContainer");
    if (!container) return;
    container.innerHTML = "";

    if (!books || books.length === 0) {
        container.innerHTML = "<p style='text-align: center; padding: 40px; color: var(--text-secondary);'>لا توجد عناصر مطابقة للعرض.</p>";
        return;
    }

    const categories = {};
    books.forEach(b => {
        const cat = (b && b.category) ? b.category.trim() : 'عام';
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(b);
    });

    const iconMap = {
        'المصابيح والأذكار': '📿',
        'دروس ومحاضرات الصلاة': '🕌',
        'دروس ومحاضرات الصيام': '🌙',
        'العبادات والفقه': '📖',
        'أسماء الله الحسنى': '✨',
        'الشخصيات الإسلامية والتراجم': '📜'
    };

    Object.keys(categories).forEach(catName => {
        const section = document.createElement("section");
        section.className = "category-group";
        const icon = iconMap[catName] || '📚';

        section.innerHTML = `
            <div class="category-header">
                <h2><span>${icon}</span> ${catName}</h2>
                <span class="count-pill">${categories[catName].length} عناصر</span>
            </div>
            <div class="books-grid">
                ${categories[catName].map(b => buildCard(b)).join('')}
            </div>
        `;
        container.appendChild(section);
    });
}

function buildCard(book) {
    if (!book) return "";
    let fileId = (book.file || book.id || "").toString().replace(/\.json$/i, '').trim();
    let title = book.title || "عنوان غير مسمى";
    let author = book.author || 'الشيخ أحمد البسفي';
    let desc = book.description ? book.description.substring(0, 80) + '...' : 'مرجع إيماني متميز...';
    
    const favs = getFavorites();
    const isFav = favs.includes(fileId);

    return `
        <div class="book-card">
            <div class="card-body">
                <div class="card-top">
                    <a href="reader.html?book=${encodeURIComponent(fileId)}" style="text-decoration:none; color:inherit; flex-grow:1;">
                        <h3>${title}</h3>
                    </a>
                    <button class="fav-interactive-btn" onclick="toggleFav('${fileId}', event)" title="المفضلة">
                        ${isFav ? '⭐' : '☆'}
                    </button>
                </div>
                <p class="book-author">${author}</p>
                <p class="book-desc">${desc}</p>
            </div>
            <div class="card-footer">
                <a href="reader.html?book=${encodeURIComponent(fileId)}" class="read-link">قراءة الورد ➔</a>
            </div>
        </div>
    `;
}

function getFavorites() {
    try {
        return JSON.parse(localStorage.getItem("libraryFavs")) || [];
    } catch(e) { return []; }
}

function toggleFav(id, event) {
    if (event) event.stopPropagation();
    let favs = getFavorites();
    if (favs.includes(id)) {
        favs = favs.filter(i => i !== id);
    } else {
        favs.push(id);
    }
    localStorage.setItem("libraryFavs", JSON.stringify(favs));
    updateFavoritesCount();
    renderView();
}

function updateFavoritesCount() {
    const el = document.getElementById("favCount");
    if (el) el.innerText = getFavorites().length;
}

function setupSearch() {
    const input = document.getElementById("searchInput");
    if (!input) return;

    input.addEventListener("input", (e) => {
        const q = e.target.value.trim().toLowerCase();
        if (!q) {
            renderView();
            return;
        }

        const list = currentMode === 'favorites' 
            ? allBooks.filter(b => getFavorites().includes((b.file || b.id || "").toString().replace(/\.json$/i, '').trim()))
            : allBooks;

        const filtered = list.filter(b => {
            if (!b) return false;
            return (b.title || "").toLowerCase().includes(q) ||
                   (b.description || "").toLowerCase().includes(q) ||
                   (b.category || "").toLowerCase().includes(q);
        });

        renderCategorized(filtered);
    });
}

function checkContinueReading() {
    try {
        const last = JSON.parse(localStorage.getItem("lastBookRead"));
        const sec = document.getElementById("continueReadingSection");
        if (last && last.id && sec) {
            document.getElementById("continueBookTitle").innerText = last.title || "";
            document.getElementById("continueBookBtn").href = `reader.html?book=${encodeURIComponent(last.id)}`;
            sec.style.display = "flex";
        }
    } catch(e) {}
}

function initTheme() {
    const toggle = document.getElementById("themeToggle");
    const saved = localStorage.getItem("theme") || "light";
    document.body.setAttribute("data-theme", saved);

    if (toggle) {
        toggle.addEventListener("click", () => {
            const curr = document.body.getAttribute("data-theme");
            const next = curr === "dark" ? "light" : "dark";
            document.body.setAttribute("data-theme", next);
            localStorage.setItem("theme", next);
        });
    }
}
