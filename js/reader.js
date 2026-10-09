// js/reader.js - إدارة محرك القراءة والتحكم بالنصوص

document.addEventListener("DOMContentLoaded", async () => {
    initTheme();
    setupFontSizeControls();
    
    const urlParams = new URLSearchParams(window.location.search);
    let rawBookParam = urlParams.get('book');

    if (!rawBookParam) {
        document.getElementById('bookContent').innerHTML = "<p class='error' style='text-align:center;'>لم يتم تحديد كتاب للعرض. يرجى العودة للمكتبة واختيار كتاب.</p>";
        return;
    }

    await loadBookData(rawBookParam);
});

// 1. جلب بيانات الكتاب وتنظيف المسار من تكرار الامتدادات
async function loadBookData(rawBookParam) {
    const contentArea = document.getElementById('bookContent');
    const bookTitleElem = document.getElementById('bookTitle');

    // إزالة امتداد .json التلقائي لتجنب تكراره مثل (.json.json)
    let cleanBookId = rawBookParam.replace(/\.json$/i, '');

    try {
        const response = await fetch(`./data/${cleanBookId}.json`);
        
        if (!response.ok) {
            throw new Error(`تعذر العثور على data/${cleanBookId}.json`);
        }

        const bookData = await response.json();
        
        // استخراج عنوان الكتاب بحسب الهيكلية
        const title = bookData.title || bookData.name || cleanBookId.replace(/-/g, ' ');
        if (bookTitleElem) bookTitleElem.innerText = title;
        document.title = `${title} - منصة إقراء`;

        renderContent(bookData);
        restoreBookmark(cleanBookId);
        setupScrollListener(cleanBookId);

    } catch (error) {
        console.error(error);
        contentArea.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <p class='error' style='color: #e63946; font-size: 1.2rem; font-weight: bold;'>عذراً، تعذر تحميل محتوى هذا الكتاب.</p>
                <p style="color: var(--text-secondary); margin-top: 0.5rem; font-family: monospace;">تأكد من وجود الملف: data/${cleanBookId}.json داخل المستودع.</p>
                <a href="index.html" style="display: inline-block; margin-top: 1.5rem; background: var(--accent-color); color: white; padding: 0.5rem 1.5rem; border-radius: 20px; text-decoration: none;">العودة للمكتبة الرئيسية</a>
            </div>
        `;
    }
}

// 2. معالجة وعرض محتوى الكتاب والعناوين
function renderContent(data) {
    const contentArea = document.getElementById('bookContent');
    const tocList = document.getElementById('tocList');
    
    contentArea.innerHTML = '';
    if (tocList) tocList.innerHTML = '';

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
    } else if (typeof data === 'object') {
        let idx = 0;
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'string' || Array.isArray(value)) {
                appendChapter(contentArea, tocList, key, value, idx++);
            }
        }
    }
}

function appendChapter(container, toc, title, rawContent, index) {
    if (toc) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#chap-${index}">${title}</a>`;
        toc.appendChild(li);
    }

    const section = document.createElement('section');
    section.id = `chap-${index}`;
    section.className = 'chapter-section';

    section.innerHTML = `
        <h3 style="color: var(--accent-color); margin-bottom: 1rem;">${title}</h3>
        <div class="chapter-body" style="line-height: 2.2;">${formatText(rawContent)}</div>
    `;
    container.appendChild(section);
}

// 3. تصحيح وتنظيف النص إملائياً وتنسيق الفقرات
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

// 5. حفظ واسترجاع موضع التصفح
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
