// js/app.js - إدارة المكتبة والبحث والوضع الليلي

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    loadBooksList();
    setupSearch();
    setupCategories();
});

let allBooks = [];

// 1. تحميل قائمة الكتب من data/books-list.json
async function loadBooksList() {
    const booksGrid = document.getElementById("booksGrid");
    if (!booksGrid) return;

    try {
        const response = await fetch("./data/books-list.json");
        allBooks = await response.json();
        renderBooks(allBooks);
    } catch (error) {
        console.error("خطأ في تحميل قائمة الكتب:", error);
        booksGrid.innerHTML = "<p class='error'>تعذر تحميل الكتب، يرجى المحاولة لاحقاً.</p>";
    }
}

// 2. عرض كروت الكتب في الصفحة
function renderBooks(books) {
    const booksGrid = document.getElementById("booksGrid");
    booksGrid.innerHTML = "";

    if (books.length === 0) {
        booksGrid.innerHTML = "<p>لا توجد نتائج تطابق بحثك.</p>";
        return;
    }

    books.forEach(book => {
        const card = document.createElement("a");
        card.className = "book-card";
        // توجيه القارئ إلى reader.html مع اسم ملف الكتاب
        card.href = `reader.html?book=${encodeURIComponent(book.id || book.filename)}`;
        
        card.innerHTML = `
            <div>
                <h3>${book.title}</h3>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">${book.author || 'المكتبة الإسلامية'}</p>
            </div>
            <span style="margin-top: 1rem; color: var(--accent-color); font-weight: bold; font-size: 0.85rem;">اقرأ الآن ➔</span>
        `;
        booksGrid.appendChild(card);
    });
}

// 3. البحث الفوري داخل العناوين
function setupSearch() {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) return;

    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.trim().toLowerCase();
        const filtered = allBooks.filter(book => 
            book.title.toLowerCase().includes(query) ||
            (book.category && book.category.toLowerCase().includes(query))
        );
        renderBooks(filtered);
    });
}

// 4. الفلترة حسب التصنيف
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

// 5. إدارة الوضع الليلي والنهاري
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
