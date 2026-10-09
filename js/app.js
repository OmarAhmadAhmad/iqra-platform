// js/app.js - إدارة المكتبة وقراءة الفهرس المحدث

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    loadBooksList();
    setupSearch();
    setupCategories();
});

let allBooks = [];

async function loadBooksList() {
    const booksGrid = document.getElementById("booksGrid");
    if (!booksGrid) return;

    try {
        const response = await fetch("./data/books-list.json");
        if (!response.ok) throw new Error("تعذر جلب قائمة الكتب");
        
        const data = await response.json();
        // التعامل مع البنية الجديدة { "books": [...] } أو البنية المباشرة
        allBooks = Array.isArray(data) ? data : (data.books || []);
        
        renderBooks(allBooks);
    } catch (error) {
        console.error("خطأ:", error);
        booksGrid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: red;'>جاري تحميل المكتبة...</p>";
    }
}

function renderBooks(books) {
    const booksGrid = document.getElementById("booksGrid");
    booksGrid.innerHTML = "";

    if (!books || books.length === 0) {
        booksGrid.innerHTML = "<p style='grid-column: 1/-1; text-align: center;'>لا توجد كتب مطابقة.</p>";
        return;
    }

    books.forEach(book => {
        const card = document.createElement("a");
        card.className = "book-card";
        
        // جلب اسم الملف من حقل file وتجرديه من امتداد .json لضمان مسار نظيف
        const fileName = (book.file || book.id || "seerah-al-nabi.json").toString();
        const cleanBookId = fileName.replace(/\.json$/i, '');
        
        card.href = `reader.html?book=${encodeURIComponent(cleanBookId)}`;

        card.innerHTML = `
            <div>
                <h3>${book.title}</h3>
                <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.3rem;">${book.author || 'المكتبة الإسلامية'}</p>
                ${book.description ? `<p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.5rem; line-height: 1.4;">${book.description.substring(0, 90)}...</p>` : ''}
            </div>
            <span style="margin-top: 1rem; color: var(--accent-color); font-weight: bold; font-size: 0.85rem;">اقرأ الآن ➔</span>
        `;
        booksGrid.appendChild(card);
    });
}

function setupSearch() {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) return;

    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.trim().toLowerCase();
        const filtered = allBooks.filter(book => 
            book.title.toLowerCase().includes(query) ||
            (book.description && book.description.toLowerCase().includes(query)) ||
            (book.category && book.category.toLowerCase().includes(query))
        );
        renderBooks(filtered);
    });
}

function setupCategories() {
    const tabBtns = document.querySelectorAll(".tab-btn");
    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            tabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const category = btn.dataset.category;
            if (category === "all") {
                renderBooks(allBooks);
            } else {
                const filtered = allBooks.filter(book => book.category === category);
                renderBooks(filtered);
            }
        });
    });
}

function initTheme() {
    const themeToggle = document.getElementById("themeToggle");
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.setAttribute("data-theme", savedTheme);

    if (themeToggle) {
        themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";
        themeToggle.addEventListener("click", () => {
            const currentTheme = document.body.getAttribute("data-theme");
            const newTheme = currentTheme === "dark" ? "light" : "dark";
            
            document.body.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
            themeToggle.textContent = newTheme === "dark" ? "☀️" : "🌙";
        });
    }
}
