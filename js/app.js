// js/app.js - جلب وعرض الكتب في الرئيسية
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    loadBooks();
    setupSearch();
});

let allBooks = [];

async function loadBooks() {
    const grid = document.getElementById("booksGrid");
    try {
        const res = await fetch("data/books-list.json");
        if (!res.ok) throw new Error("تعذر تحميل ملف الفهرس");
        const data = await res.json();
        
        // يدعم سواء كان الملف مصفوفة مباشرة أو كائن بداخل مفتاح books
        allBooks = Array.isArray(data) ? data : (data.books || []);
        renderBooks(allBooks);
    } catch (err) {
        console.error(err);
        grid.innerHTML = "<p style='text-align:center; color:red; grid-column:1/-1;'>تأكد من تشغيل الموقع عبر محلي (Local Server) أو متصفح يدعم قراءة الملفات المحلية.</p>";
    }
}

function renderBooks(books) {
    const grid = document.getElementById("booksGrid");
    grid.innerHTML = "";

    if (books.length === 0) {
        grid.innerHTML = "<p style='text-align:center; grid-column:1/-1;'>لا توجد كتب مطابقة لبحثك.</p>";
        return;
    }

    books.forEach(book => {
        const card = document.createElement("a");
        card.className = "book-card";
        
        // استخراج اسم ملف الكتاب وتخليصه من الامتداد لتجنب الأخطاء
        let fileName = (book.file || book.id || "").toString().replace(/\.json$/i, '');
        card.href = `reader.html?book=${encodeURIComponent(fileName)}`;

        card.innerHTML = `
            <div>
                <h3>${book.title}</h3>
                <p>${book.description ? book.description.substring(0, 85) + '...' : (book.author || 'المكتبة الإسلامية')}</p>
            </div>
            <span class="read-btn">اقرأ الكتاب ←</span>
        `;
        grid.appendChild(card);
    });
}

function setupSearch() {
    const input = document.getElementById("searchInput");
    if (!input) return;
    input.addEventListener("input", (e) => {
        const query = e.target.value.trim().toLowerCase();
        const filtered = allBooks.filter(b => 
            b.title.toLowerCase().includes(query) || 
            (b.description && b.description.toLowerCase().includes(query)) ||
            (b.category && b.category.toLowerCase().includes(query))
        );
        renderBooks(filtered);
    });
}

function initTheme() {
    const btn = document.getElementById("themeToggle");
    const saved = localStorage.getItem("theme") || "light";
    document.body.setAttribute("data-theme", saved);

    if (btn) {
        btn.addEventListener("click", () => {
            const current = document.body.getAttribute("data-theme");
            const next = current === "dark" ? "light" : "dark";
            document.body.setAttribute("data-theme", next);
            localStorage.setItem("theme", next);
        });
    }
}
