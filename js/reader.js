// js/reader.js - محرك القراءة الشامل لمنصة إقراء

document.addEventListener("DOMContentLoaded", async () => {
    initTheme();
    setupFontSizeControls();
    
    const urlParams = new URLSearchParams(window.location.search);
    let bookFile = urlParams.get('book');

    if (!bookFile) {
        document.getElementById('bookContent').innerHTML = "<p class='error'>لم يتم تحديد كتاب للعرض. يرجى العودة للمكتبة واختيار كتاب.</p>";
        return;
    }

    await loadBookData(bookFile);
});

// 1. جلب بيانات الكتاب مع التعامل المباشر مع أسماء الملفات
async function loadBookData(bookFile) {
    const contentArea = document.getElementById('bookContent');
    const bookTitleElem = document.getElementById('bookTitle');

    // تنظيف اسم الملف من الامتدادات المكررة
    let cleanFileName = bookFile.replace(/\.json$/i, '');

    try {
        const response = await fetch(`./data/${cleanFileName}.json`);
        
        if (!response.ok) {
            throw new Error(`تعذر العثور على الملف: data/${cleanFileName}.json`);
        }

        const bookData = await response.json();
        
        const title = bookData.title || bookData.name || cleanFileName.replace(/-/g, ' ');
        if (bookTitleElem) bookTitleElem.innerText = title;
        document.title = `${title} - منصة إقراء`;

        renderContent(bookData);
        restoreBookmark(cleanFileName);
        setupScrollListener(cleanFileName);

    } catch (error) {
        console.error("خطأ في تحميل الكتاب:", error);
        contentArea.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <p class='error' style='color: red; font-size: 1.2rem;'>عذراً، تعذر تحميل محتوى هذا الكتاب.</p>
                <p style="color: var(--text-secondary); margin-top: 0.5rem;">تأكد من وجود الملف <code>data/${cleanFileName}.json</code> داخل المستودع.</p>
                <a href="index.html" style="display: inline-block; margin-top: 1rem; color: var(--accent-color);">العودة إلى المكتبة الرئيسية</a>
            </div>
        `;
    }
}

// 2. عرض المحتوى وتنسيقه
function renderContent(data) {
    const contentArea = document.getElementById('bookContent');
    contentArea.innerHTML = '';

    if (Array.isArray(data)) {
        data.forEach((item, index) => {
            appendChapter(contentArea, item.title || `الجزء ${index + 1}`, item.content || item.text || item, index);
        });
    } else if (data.chapters && Array.isArray(data.chapters)) {
        data.chapters.forEach((chap, index) => {
            appendChapter(contentArea, chap.title || `الفصل ${index + 1}`, chap.content || chap.text, index);
        });
    } else if (data.content || data.text) {
        appendChapter(contentArea, data.title || "المحتوى", data.content || data.text, 0);
    } else if (typeof data === 'object') {
        let idx = 0;
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'string' || Array.isArray(value)) {
                appendChapter(contentArea, key, value, idx++);
            }
        }
    } else {
        contentArea.innerHTML = "<p>تنسيق كتاب غير معروف.</p>";
    }
}

function appendChapter(container, title, rawContent, index) {
    const section = document.createElement('section');
    section.id = `chap-${index}`;
    section.className = 'chapter-section';
    section.style.marginBottom = '2rem';
    section.style.paddingBottom = '1.5rem';
    section.style.borderBottom = '1px solid var(--border-color)';

    section.innerHTML = `
        <h3 style="color: var(--accent-color); margin-bottom: 1rem;">${title}</h3>
        <div class="chapter-body" style="line-height: 2;">${formatText(rawContent)}</div>
    `;
    container.appendChild(section);
}

// 3. تصحيح وتجميل النص إملائياً
function formatText(text) {
    if (!text) return '';
    if (Array.isArray(text)) text = text.join('\n\n');
    if (typeof text !== 'string') text = String(text);

    const formatted = text
        .replace(/\((?:ص\vert{}صلعم)\)/g, 'ﷺ')
        .replace(/\s+([\.،؛:؟!])/g, '$1')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');

    return `<p>${formatted}</p>`;
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

// 5. حفظ واسترجاع التصفح
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
