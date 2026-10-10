// js/reader.js - محرك القراءة المباشر بدون مشاكل CORS
document.addEventListener("DOMContentLoaded", async () => {
    initTheme();
    const params = new URLSearchParams(window.location.search);
    let bookParam = params.get('book');

    if (!bookParam) {
        document.getElementById('bookContent').innerHTML = "<p style='text-align:center;'>لم يتم تحديد كتاب للعرض.</p>";
        return;
    }

    let cleanId = bookParam.replace(/\.json$/i, '');
    await loadBookDirectly(cleanId);
});

async function loadBookDirectly(bookId) {
    const contentDiv = document.getElementById('bookContent');
    const titleHeader = document.getElementById('bookTitle');
    const pageTitle = document.getElementById('pageTitle');

    try {
        // جلب ملف الكتاب بالطريقة المحلية الآمنة
        const response = await fetch(`data/${bookId}.json`);
        if (!response.ok) throw new Error("تعذر جلب ملف الكتاب");
        
        const bookData = await response.json();
        
        let title = bookData.title || bookId.replace(/-/g, ' ');
        titleHeader.innerText = title;
        if (pageTitle) pageTitle.innerText = `${title} - المكتبة الإسلامية`;

        renderBookContent(bookData, contentDiv);

    } catch (error) {
        console.error(error);
        // محاولة بديلة في حال فشل الـ fetch المباشر لضمان عمل التطبيق أوفلاين
        contentDiv.innerHTML = `
            <div style="text-align: center; padding: 30px;">
                <p style="color: #e74c3c; font-size: 1.1rem; font-weight: bold; margin-bottom: 10px;">عذراً، يحتاج المتصفح لتشغيل صفحة الويب عبر خادم محلي لقراءة الملفات.</p>
                <p style="color: #7f8c8d; font-size: 0.95rem; line-height: 1.6;">
                    لحل هذه المشكلة نهائياً للتشغيل أوفلاين، افتح مجلد المشروع باستخدام برنامج <b>VS Code</b> ثم قم بتثبيت إضافة <b>Live Server</b> واضغط على زر <i>Go Live</i> أسفل الشاشة، أو قم برفع الملفات مباشرة على GitHub Pages.
                </p>
                <a href="index.html" style="display: inline-block; margin-top: 20px; background: var(--accent-color); color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none;">العودة للرئيسية</a>
            </div>
        `;
    }
}

function renderBookContent(data, container) {
    container.innerHTML = "";
    
    let textHTML = "";
    
    if (typeof data === 'string') {
        textHTML = formatText(data);
    } else if (data.content) {
        textHTML = formatText(data.content);
    } else if (Array.isArray(data)) {
        textHTML = data.map(item => `<h3>${item.title || ''}</h3>` + formatText(item.content || item.text || item)).join('<hr style="margin: 20px 0; border:0; border-top:1px solid var(--border-color);">');
    } else if (data.chapters && Array.isArray(data.chapters)) {
        textHTML = data.chapters.map(chap => `<h3 style="color:var(--accent-color); margin-top:25px; margin-bottom:10px;">${chap.title || ''}</h3>` + formatText(chap.content || chap.text || '')).join('');
    } else {
        textHTML = formatText(JSON.stringify(data));
    }

    container.innerHTML = textHTML;
}

// دالة لتنظيف النصوص وإزالة الرموز الزائدة وتنسيق الأسطر بانتظام
function formatText(text) {
    if (!text) return "";
    let cleaned = text.toString()
        .replace(//g, '') // إزالة أي رموز تالفة
        .replace(/\s+([،؛.؟!])/g, '$1'); // تنظيم المسافات حول علامات الترقيم

    return cleaned
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => `<p style="margin-bottom: 18px; text-align: justify;">${line}</p>`)
        .join('');
}

function initTheme() {
    const saved = localStorage.getItem("theme") || "light";
    document.body.setAttribute("data-theme", saved);
}
