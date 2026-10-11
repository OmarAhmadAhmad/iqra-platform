let allBooks = [];
let currentFilter = 'all';

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    loadLibraryData();
    setupLiveSearch();
    checkLastRead();
});

async function loadLibraryData() {
    const container = document.getElementById("sectionsContainer");
    if (!container) return;

    try {
        const response = await fetch("./data/books-list.json");
        if (!response.ok) throw new Error("فشل الجلب");
        
        const data = await response.json();
        allBooks = Array.isArray(data) ? data : (data.books || []);
        
        refreshFavCount();
        renderViewContent();
    } catch (e) {
        container.innerHTML = "<p style='text-align: center; color: #ef4444; padding: 30px;'>تعذر جلب ملفات المكتبة.</p>";
    }
}

function switchNavTab(tabName, btnElement) {
    currentFilter = tabName;
    document.querySelectorAll('.b-nav-item').forEach(el => el.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');
    renderViewContent();
}

function renderViewContent() {
    let targetBooks = allBooks;
    if (currentFilter === 'favorites') {
        const favs = getFavList();
        targetBooks = allBooks.filter(b => {
            let id = (b.file || b.id || "").toString().replace(/\.json$/i, '').trim();
            return favs.includes(id);
        });
    }
    buildCategoryBlocks(targetBooks);
}

function buildCategoryBlocks(books) {
    const container = document.getElementById("sectionsContainer");
    if (!container) return;
    container.innerHTML = "";

    if (!books || books.length === 0) {
        container.innerHTML = "<p style='text-align: center; padding: 40px; color: var(--text-secondary);'>لا توجد أوراد مطابقة.</p>";
        return;
    }

    const groups = {};
    books.forEach(b => {
        let cat = (b && b.category) ? b.category.trim() : 'عام';
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(b);
    });

    const icons = {
        'المصابيح والأذكار': '📿',
        'دروس ومحاضرات الصلاة': '🕌',
        'دروس ومحاضرات الصيام': '🌙',
        'العبادات والفقه': '📖',
        'أسماء الله الحسنى': '✨',
        'الشخصيات الإسلامية والتراجم': '📜'
    };

    Object.keys(groups).forEach(catName => {
        const block = document.createElement("div");
        block.className = "category-block";
        const icon = icons[catName] || '📚';

        block.innerHTML = `
            <div class="category-title-bar">
                <h2><span>${icon}</span> ${catName}</h2>
                <span style="font-size:0.78rem; color:var(--text-secondary); font-weight:700;">${groups[catName].length} عنصراً</span>
            </div>
            <div class="books-masonry-grid">
                ${groups[catName].map(b => createCardHTML(b)).join('')}
            </div>
        `;
        container.appendChild(block);
    });
}

function createCardHTML(book) {
    if (!book) return "";
    let fileId = (book.file || book.id || "").toString().replace(/\.json$/i, '').trim();
    let title = book.title || "عنوان غير مسمى";
    let desc = book.description ? book.description.substring(0, 75) + '...' : 'مرجع إيماني متميز...';
    
    const favs = getFavList();
    const isFav = favs.includes(fileId);

    return `
        <div class="book-item-card">
            <div>
                <div class="item-top-row">
                    <a href="reader.html?book=${encodeURIComponent(fileId)}" style="text-decoration:none; color:inherit; flex-grow:1;">
                        <h3>${title}</h3>
                    </a>
                    <button class="star-btn-pure" onclick="toggleFavItem('${fileId}', event)">
                        ${isFav ? '⭐' : '☆'}
                    </button>
                </div>
                <p>${desc}</p>
            </div>
            <div>
                <a href="reader.html?book=${encodeURIComponent(fileId)}" class="read-link-btn">قراءة الآن ➔</a>
            </div>
        </div>
    `;
}

function getFavList() {
    try {
        return JSON.parse(localStorage.getItem("libraryFavs")) || [];
    } catch(e) { return []; }
}

function toggleFavItem(id, event) {
    if (event) event.stopPropagation();
    let favs = getFavList();
    if (favs.includes(id)) {
        favs = favs.filter(i => i !== id);
    } else {
        favs.push(id);
    }
    localStorage.setItem("libraryFavs", JSON.stringify(favs));
    refreshFavCount();
    renderViewContent();
}

function refreshFavCount() {
    const el = document.getElementById("favCount");
    if (el) el.innerText = getFavList().length;
}

function setupLiveSearch() {
    const input = document.getElementById("searchInput");
    if (!input) return;

    input.addEventListener("input", (e) => {
        let q = e.target.value.trim().toLowerCase();
        if (!q) {
            renderViewContent();
            return;
        }

        let base = currentFilter === 'favorites' 
            ? allBooks.filter(b => getFavList().includes((b.file || b.id || "").toString().replace(/\.json$/i, '').trim()))
            : allBooks;

        let filtered = base.filter(b => {
            return (b.title || "").toLowerCase().includes(q) ||
                   (b.description || "").toLowerCase().includes(q) ||
                   (b.category || "").toLowerCase().includes(q);
        });

        buildCategoryBlocks(filtered);
    });
}

function checkLastRead() {
    try {
        let last = JSON.parse(localStorage.getItem("lastBookRead"));
        let sec = document.getElementById("continueReadingSection");
        if (last && last.id && sec) {
            document.getElementById("continueBookTitle").innerText = last.title || "";
            document.getElementById("continueBookBtn").href = `reader.html?book=${encodeURIComponent(last.id)}`;
            sec.style.display = "flex";
        }
    } catch(e) {}
}

function initTheme() {
    let tBtn = document.getElementById("themeToggle");
    let saved = localStorage.getItem("theme") || "light";
    document.body.setAttribute("data-theme", saved);

    if (tBtn) {
        tBtn.addEventListener("click", () => {
            let curr = document.body.getAttribute("data-theme");
            let next = curr === "dark" ? "light" : "dark";
            document.body.setAttribute("data-theme", next);
            localStorage.setItem("theme", next);
        });
    }
}
