// js/reader.js - محرك القراءة المضمون لـ GitHub Pages
document.addEventListener("DOMContentLoaded", async () => {
    initTheme();
    const params = new URLSearchParams(window.location.search);
    let bookParam = params.get('book');

    if (!bookParam) {
        document.getElementById('bookContent').innerHTML = "<p style='text-align:center;'>لم يتم تحديد كتاب للعرض.</p>";
        return;
    }

    let cleanId = bookParam.replace(/\.json$/i, '').trim();
    await loadBook(cleanId);
});

async function loadBook(bookId) {
    const contentDiv = document.getElementById('bookContent');
    const titleHeader = document.getElementById('bookTitle');
    const pageTitle = document.getElementById('pageTitle');

    try {
        // المسار الصحيح للملفات على GitHub Pages
        const response = await fetch(`data/${bookId}.json`);
        if (!response.ok) throw new Error("تعذر جلب الملف");
        
        const data = await response.json();
        
        let title = data.title || bookId.replace(/-/g, ' ');
        if (titleHeader) titleHeader.innerText = title;
        if (pageTitle) pageTitle.innerText = `${title} - المكتبة الإسلامية`;

        displayContent(data, contentDiv);

    } catch (error) {
        console.error(error);
        contentDiv.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <p style="color: #e74c3c; font-size: 1.2rem; font-weight: bold; margin-bottom: 10px;">عذراً، تعذر العثور على ملف هذا الكتاب أو قراءته.</p>
                <p style="color: #7f8c8d; font-size: 0.95rem; margin-bottom: 20px;">تأكد أن الملف <b>${bookId}.json</b> مرفوع تماماً داخل مجلد <b>data</b> في مستودع GitHub.</p>
                <a href="index.html" style="background: #1b4d3e; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none;">العودة للمكتبة الرئيسية</a>
            </div>
        `;
    }
}

function displayContent(data, container) {
    container.innerHTML = "";
    let htmlContent = "";

    if (typeof data === 'string') {
        htmlContent = formatParagraphs(data);
    } else if (data.content) {
        htmlContent = formatParagraphs(data.content);
    } else if (Array.isArray(data)) {
        htmlContent = data.map(item => `<h3>${item.title || ''}</h3>` + formatParagraphs(item.content || item.text || item)).join('<hr style="margin:20px 0; border:0; border-top:1px solid #ddd;">');
    } else if (data.chapters && Array.isArray(data.chapters)) {
        htmlContent = data.chapters.map(chap => `<h3 style="color:#1b4d3e; margin:25px 0 10px 0;">${chap.title || ''}</h3>` + formatParagraphs(chap.content || chap.text || '')).join('');
    } else {
        // إذا كان ملف JSON يحتوي على حقول أخرى، نقوم بعرض وصفه أو نصه مباشرة
        htmlContent = formatParagraphs(data.description || JSON.stringify(data, null, 2));
    }

    container.innerHTML = htmlContent;
}

function formatParagraphs(text) {
    if (!text) return "";
    return text.toString()
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => `<p style="margin-bottom: 18px; text-align: justify; line-height: 2.1;">${line}</p>`)
        .join('');
}

function initTheme() {
    const saved = localStorage.getItem("theme") || "light";
    document.body.setAttribute("data-theme", saved);
}
