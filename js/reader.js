// js/reader.js - قراءة وعرض وتنظيف نصوص الكتب
document.addEventListener("DOMContentLoaded", async () => {
    initTheme();
    const params = new URLSearchParams(window.location.search);
    let bookParam = params.get('book');

    if (!bookParam) {
        document.getElementById('bookContent').innerHTML = "<p style='text-align:center;'>لم يتم تحديد كتاب للعرض.</p>";
        return;
    }

    // تنظيف اسم الملف لمنع تكرار الامتدادات
    let cleanId = bookParam.replace(/\.json$/i, '');
    await fetchBookContent(cleanId);
});

async function fetchBookContent(bookId) {
    const contentDiv = document.getElementById('bookContent');
    const titleHeader = document.getElementById('bookTitle');
    const pageTitle = document.getElementById('pageTitle');

    try {
        const res = await fetch(`data/${bookId}.json`);
        if (!res.ok) throw new Error(`لم يتم العثور على ملف الكتاب: data/${bookId}.json`);

        const data = await res.json();
        
        let bookTitle = data.title || bookId.replace(/-/g, ' ');
        titleHeader.innerText = bookTitle;
        pageTitle.innerText = `${bookTitle} - المكتبة الإسلامية`;

        renderCleanText(data, contentDiv);

    } catch (err) {
        console.error(err);
        contentDiv.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <p style="color: #e74c3c; font-weight: bold;">عذراً، حدث خطأ أثناء تحميل محتوى الكتاب.</p>
                <p style="font-size: 0.9rem; color: #7f8c8d; margin-top: 5px;">تأكد من وجود الملف داخل مجلد data باسم: ${bookId}.json</p>
                <a href="index.html" style="display:inline-block; margin-top:15px; color:var(--accent-color); font-weight:bold;">العودة للرئيسية</a>
            </div>
        `;
    }
}

function renderCleanText(data, container) {
    container.innerHTML = "";
    
    // استخراج النصوص وتنظيفها من أي رموز مشوهة مع الحفاظ على النص العربي الأصلي
    let rawContent = "";
    if (typeof data === 'string') {
        rawContent = data;
    } else if (data.content) {
        rawContent = data.content;
    } else if (Array.isArray(data)) {
        rawContent = data.map(item => item.content || item.text || item).join('\n\n');
    } else if (data.chapters && Array.isArray(data.chapters)) {
        data.chapters.forEach(chap => {
            const h = document.createElement('h3');
            h.style.color = "var(--accent-color)";
            h.style.margin = "25px 0 10px 0";
            h.innerText = cleanText(chap.title || "فصل");
            container.appendChild(h);
            
            const p = document.createElement('div');
            p.innerHTML = formatParagraphs(chap.content || chap.text || "");
            container.appendChild(p);
        });
        return;
    } else {
        rawContent = JSON.stringify(data);
    }

    const div = document.createElement('div');
    div.innerHTML = formatParagraphs(rawContent);
    container.appendChild(div);
}

// دالة لتنظيف وتنسيق النصوص وإزالة أي رموز برمجية أو غريبة غير مرغوبة
function cleanText(text) {
    if (!text) return "";
    return text
        .toString()
        .replace(//g, '') // إزالة الرموز التالفة إن وجدت
        .replace(/\s+([،؛.؟!])/g, '$1'); // ضبط المسافات حول علامات الترقيم
}

function formatParagraphs(text) {
    if (!text) return "";
    let cleaned = cleanText(text);
    // تحويل الأسطر الجديدة إلى فقرات HTML مرتبة
    return cleaned
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => `<p>${line}</p>`)
        .join('');
}

function initTheme() {
    const saved = localStorage.getItem("theme") || "light";
    document.body.setAttribute("data-theme", saved);
}
