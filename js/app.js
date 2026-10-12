// js/app.js - إدارة الفهرس، الأقسام، ومتابعة القراءة
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    loadBooksList();
    setupSearch();
    checkContinueReading();
});

let allBooks = [];

async function loadBooksList() {
    const container = document.getElementById("sectionsContainer");
    if (!container) return;

    try {
        const response = await fetch("./data/books-list.json");
        if (!response.ok) throw new Error("تعذر جلب قائمة الكتب");
        
        const data = await response.json();
        allBooks = Array.isArray(data) ? data : (data.books || []);
        
        renderCategorizedBooks(allBooks);
    } catch (error) {
        console.error("خطأ:", error);
        container.innerHTML = "<p style='text-align: center; color: #e74c3c;'>جاري تحميل المكتبة...</p>";
    }
}

function renderCategorizedBooks(books) {
    const container = document.getElementById("sectionsContainer");
    if (!container) return;
    container.innerHTML = "";

    if (!books || books.length === 0) {
        container.innerHTML = "<p style='text-align: center; padding: 30px; color: var(--text-secondary);'>لا توجد نتائج مطابقة للبحث.</p>";
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

    return `
        <a href="reader.html?book=${encodeURIComponent(fileName)}" class="book-card">
            <div class="card-body">
                <h3>${title}</h3>
                <p class="book-author">${author}</p>
                <p class="book-desc">${desc}</p>
            </div>
            <div class="card-footer">
                <span class="read-action">اقرأ الآن ➔</span>
            </div>
        </a>
    `;
}

function setupSearch() {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) return;

    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (!query) {
            renderCategorizedBooks(allBooks);
            return;
        }

        const filtered = allBooks.filter(book => {
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
    } catch(e) {
        console.error(e);
    }
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
