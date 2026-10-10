// js/app.js - إدارة الفهرس، البحث، والتصفية الفورية
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    loadBooksList();
    setupSearch();
});

let allBooks = [];

async function loadBooksList() {
    const booksGrid = document.getElementById("booksGrid");
    if (!booksGrid) return;

    try {
        const response = await fetch("./data/books-list.json");
        if (!response.ok) throw new Error("تعذر جلب قائمة الكتب");
        
        const data = await response.json();
        allBooks = Array.isArray(data) ? data : (data.books || []);
        
        renderBooks(allBooks);
        setupCategoryTabs();
    } catch (error) {
        console.error("خطأ:", error);
        booksGrid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: #e74c3c;'>جاري تحميل المكتبة، تأكد من تشغيل الخادم المحلي...</p>";
    }
}

function renderBooks(books) {
    const booksGrid = document.getElementById("booksGrid");
    booksGrid.innerHTML = "";

    if (!books || books.length === 0) {
        booksGrid.innerHTML = "<div style='grid-column: 1/-1; text-align: center; padding: 40px;'><p style='font-size: 1.1rem; color: var(--text-secondary);'>لا توجد كتب مطابقة لبحثك.</p></div>";
        return;
    }

    books.forEach(book => {
        const card = document.createElement("a");
        card.className = "book-card";
        
        let fileName = (book.file || book.id || "").toString().replace(/\.json$/i, '').trim();
        card.href = `reader.html?book=${encodeURIComponent(fileName)}`;

        card.innerHTML = `
            <div class="card-top">
                <span class="book-cat">${book.category || 'مكتبة عامة'}</span>
            </div>
            <div class="card-body">
                <h3>${book.title}</h3>
                <p class="book-author">${book.author || 'المكتبة الإسلامية'}</p>
                <p class="book-desc">${book.description ? book.description.substring(0, 95) + '...' : 'كتاب إسلامي تربوي متميز...'}</p>
            </div>
            <div class="card-footer">
                <span class="read-action">قراءة الكتاب ➔</span>
            </div>
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
            (book.author && book.author.toLowerCase().includes(query)) ||
            (book.category && book.category.toLowerCase().includes(query))
        );
        renderBooks(filtered);
    });
}

function setupCategoryTabs() {
    const tabBtns = document.querySelectorAll(".tab-btn");
    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            tabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const category = btn.dataset.category;
            if (category === "all") {
                renderBooks(allBooks);
            } else {
                const filtered = allBooks.filter(book => book.category && book.category.trim() === category.trim());
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
        themeToggle.addEventListener("click", () => {
            const currentTheme = document.body.getAttribute("data-theme");
            const newTheme = currentTheme === "dark" ? "light" : "dark";
            
            document.body.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
        });
    }
}
