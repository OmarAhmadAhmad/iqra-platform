// js/app.js - إدارة الفهرس، الأقسام، ومتابعة القراءة (مع حماية تامة ضد فشل التحميل)
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    loadBooksList();
    setupSearch();
    checkContinueReading();
});

// حل مشكلة العودة للخلف بدون تحديث (bfcache)
window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
        loadBooksList();
        checkContinueReading();
    }
});

let allBooks = [];

// قائمة احتياطية مدمجة تظهر فوراً إذا تعذر قراءة ملف الـ JSON لضمان عدم توقف التطبيق أبداً
const fallbackBooks = [
  { "id": 1, "title": "الصلاة ركن الإسلام الثاني (الجزء الأول)", "author": "أحمد مصطفى محمد مصطفى", "category": "العبادات والفقه", "file": "book-1.json", "description": "كتاب تربوي إيماني يبين أهمية الصلاة، روحها وصورتها، شجرة الدين." },
  { "id": 74, "file": "دلائل الخيرات.pdf", "title": "دلائل الخيرات وشوارق الأنوار", "author": "الإمام سيدي محمد بن سليمان الجزولي", "description": "الصلاة على النبي ﷺ مقسمة على أحزاب وأوراد أيام الأسبوع السبعة.", "category": "أوراد وأذكار" },
  { "id": 75, "file": "فيض المنان.pdf", "title": "فيض المنان", "author": "الشيخ جابر البغدادي", "description": "مجموعة الأوراد والصلوات والأدعية المباركة للشيخ جابر البغدادي.", "category": "أوراد وأذكار" }
];

async function loadBooksList() {
    const container = document.getElementById("sectionsContainer");
    if (!container) return;

    // محاولة جلب ملف الفهرس من المسارات المحتملة
    const possiblePaths = ["./data/books-list.json", "data/books-list.json", "/books-list.json"];
    let fetchedData = null;

    for (let path of possiblePaths) {
        try {
            const response = await fetch(path);
            if (response.ok) {
                fetchedData = await response.json();
                break;
            }
        } catch (e) {
            // محاولة المسار التالي بصمت
        }
    }

    if (fetchedData) {
        allBooks = Array.isArray(fetchedData) ? fetchedData : (fetchedData.books || []);
    } else {
        console.warn("تعذر جلب ملف الفهرس الخارجي، جاري استخدام الفهرس الاحتياطي المدمج...");
        allBooks = fallbackBooks;
    }

    renderCategorizedBooks(allBooks);
}

function renderCategorizedBooks(books) {
    const container = document.getElementById("sectionsContainer");
    if (!container) return;
    container.innerHTML = "";

    if (!books || books.length === 0) {
        container.innerHTML = "<p style='text-align: center; padding: 30px; color: var(--text-secondary);'>لا توجد نتائج مطابقة.</p>";
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
            'الشخصيات الإسلامية والتراجم': '📜',
            'أوراد وأذكار': '💫'
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
    let fileName = (book.file || book.id || "").toString().trim();
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
            <div class="card-footer" style="margin-top: 12px;">
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
