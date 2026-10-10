// js/app.js - تنظيم الأقسام الشجرية، البحث الفوري، ومتابعة القراءة
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

// عرض الكتب مقسمة حسَب الأقسام الشجرية مع أيقونات وتعداد ذكي
function renderCategorizedBooks(books) {
    const container = document.getElementById("sectionsContainer");
    container.innerHTML = "";

    if (!books || books.length === 0) {
        container.innerHTML = "<p style='text-align: center; padding: 30px; color: var(--text-secondary);'>لا توجد كتب أو أذكار مطابقة لبحثك.</p>";
        return;
    }

    const categories = {};
    books.forEach(book => {
        const cat = book.category ? book.category.trim() : 'عام';
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
    let fileName = (book.file || book.id || "").toString().replace(/\.json$/i, '').trim();
    return `
        <a href="reader.html?book=${encodeURIComponent(fileName)}" class="book-card">
            <div class="card-body">
                <h3>${book.title}</h3>
                <p class="book-author">${book.author || 'الشيخ أحمد البسفي'}</p>
                <p class="book-desc">${book.description ? book.description.substring(0, 85) + '...' : 'مرجع إيماني متميز...'}</p>
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

        const filtered = allBooks.filter(book => 
            book.title.toLowerCase().includes(query) ||
            (book.description && book.description.toLowerCase().includes(query)) ||
            (book.category && book.category.toLowerCase().includes(query))
        );

        renderCategorizedBooks(filtered);
    });
}

function checkContinueReading() {
    const lastBook = JSON.parse(localStorage.getItem("lastReadBook"));
    const section = document.getElementById("continueReadingSection");
    if (lastBook && section) {
        document.getElementById("continueBookTitle").innerText = lastBook.title;
        document.getElementById("continueBookBtn").href = `reader.html?book=${encodeURIComponent(lastBook.id)}`;
        section.style.display = "block";
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
