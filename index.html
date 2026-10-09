// js/reader.js - إدارة محرك القراءة والتحكم بالنصوص

document.addEventListener("DOMContentLoaded", async () => {
    initTheme();
    setupFontSizeControls();
    
    const urlParams = new URLSearchParams(window.location.search);
    const bookFile = urlParams.get('book');

    if (!bookFile) {
        document.getElementById('bookContent').innerHTML = "<p class='error'>لم يتم تحديد كتاب للعرض.</p>";
        return;
    }

    await loadBookData(bookFile);
});

// 1. جلب بيانات الكتاب
async function loadBookData(bookFile) {
    const contentArea = document.getElementById('bookContent');
    const bookTitleElem = document.getElementById('bookTitle');

    try {
        // إضافة الامتداد إن لم يكن موجوداً
        const fileName = bookFile.endsWith('.json') ? bookFile : `${bookFile}.json`;
        const response = await fetch(`./data/${fileName}`);
        
        if (!response.ok) throw new Error("تعذر الوصول لملف الكتاب");

        const bookData = await response.json();
        
        // ضبط العنوان
        const title = bookData.title || bookData.name || "عرض الكتاب";
        if (bookTitleElem) bookTitleElem.innerText = title;
        document.title = `${title} - منصة إقراء`;

        renderContent(bookData);
        restoreBookmark(bookFile);
        setupScrollListener(bookFile);

    } catch (error) {
        console.error("خطأ في تحميل محتوى الكتاب:", error);
        contentArea.innerHTML = "<p class='error'>عذراً، حدث خطأ أثناء تحميل محتوى الكتاب.</p>";
    }
}

// 2. معالجة وعرض محتوى الكتاب والعناوين
function renderContent(data) {
    const contentArea = document.getElementById('bookContent');
    const tocList = document.getElementById('tocList');
    
    contentArea.innerHTML = '';
    if (tocList) tocList.innerHTML = '';

    // إذا كانت البيانات قائمة من الفصول/الفقرات
    if (Array.isArray(data)) {
        data.forEach((item, index) => {
            appendChapter(contentArea, tocList, item.title || `الجزء ${index + 1}`, item.content || item.text || item, index);
        });
    } else if (data.chapters && Array.isArray(data.chapters)) {
        data.chapters.forEach((chap, index) => {
            appendChapter(contentArea, tocList, chap.title || `الفصل ${index + 1}`, chap.content || chap.text, index);
        });
    } else if (data.content || data.text) {
        appendChapter(contentArea, tocList, data.title || "المحتوى", data.content || data.text, 0);
    } else {
        // في حال كانت بنية الـ JSON كائن يحتوي على نصوص مباشرة
        let idx = 0;
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'string') {
                appendChapter(contentArea, tocList, key, value, idx++);
            }
        }
    }
}

function appendChapter(container, toc, title, rawContent, index) {
    // إضافة للفهرس
    if (toc) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#chap-${index}">${title}</a>`;
        toc.appendChild(li);
    }

    // إضافة للمحتوى
    const section = document.createElement('section');
    section.id = `chap-${index}`;
    section.className = 'chapter-section';
    section.innerHTML = `
        <h3>${title}</h3>
        <div class="chapter-body">${formatText(rawContent)}</div>
    `;
    container.appendChild(section);
}

// 3. تحسين وتنظيف النص إملائياً للعرض
function formatText(text) {
    if (!text) return '';
    if (Array.isArray(text)) text = text.join('\n\n');

    return text
        .replace(/\((?:ص\vert{}صلعم)\)/g, 'ﷺ')
        .replace(/\s+([\.،؛:؟!])/g, '$1')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
}

// 4. التحكم بحجم الخط
function setupFontSizeControls() {
    let currentSize = parseInt(localStorage.getItem('reader_font_size')) || 20;
    const contentArea = document.getElementById('bookContent');
    if (contentArea) contentArea.style.fontSize = `${currentSize}px`;

    const incBtn = document.getElementById('increaseFont');
    const decBtn = document.getElementById('decreaseFont');

    if (incBtn) {
        incBtn.addEventListener('click', () => {
            if (currentSize < 36) {
                currentSize += 2;
                if (contentArea) contentArea.style.fontSize = `${currentSize}px`;
                localStorage.setItem('reader_font_size', currentSize);
            }
        });
    }

    if (decBtn) {
        decBtn.addEventListener('click', () => {
            if (currentSize > 14) {
                currentSize -= 2;
                if (contentArea) contentArea.style.fontSize = `${currentSize}px`;
                localStorage.setItem('reader_font_size', currentSize);
            }
        });
    }
}

// 5. حفظ واسترجاع موضع القراءة تلقائياً
function setupScrollListener(bookId) {
    window.addEventListener('scroll', () => {
        localStorage.setItem(`bookmark_${bookId}`, window.scrollY);
    });
}

function restoreBookmark(bookId) {
    const savedPos = localStorage.getItem(`bookmark_${bookId}`);
    if (savedPos) {
        setTimeout(() => {
            window.scrollTo({ top: parseInt(savedPos), behavior: 'smooth' });
        }, 300);
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.setAttribute("data-theme", savedTheme);
}
