// js/reader.js - الحل النهائي المباشر لعرض محتوى الكتب
document.addEventListener("DOMContentLoaded", async () => {
    initTheme();
    const params = new URLSearchParams(window.location.search);
    let bookParam = params.get('book');

    const contentDiv = document.getElementById('bookContent');
    const titleHeader = document.getElementById('bookTitle');

    if (!bookParam) {
        contentDiv.innerHTML = "<p style='text-align:center;'>لم يتم تحديد كتاب للعرض.</p>";
        return;
    }

    let cleanId = bookParam.replace(/\.json$/i, '').trim();

    try {
        // محاولة جلب ملف الكتاب من مجلد data
        const response = await fetch(`data/${cleanId}.json`);
        if (!response.ok) throw new Error("فشل الجلب");
        
        const data = await response.json();
        
        let title = data.title || cleanId.replace(/-/g, ' ');
        if (titleHeader) titleHeader.innerText = title;
        document.title = `${title} - المكتبة الإسلامية`;

        renderContent(data, contentDiv);

    } catch (error) {
        console.error(error);
        // خطة بديلة فورية لضمان عدم بقاء الشاشة معلقة نهائياً
        try {
            const listRes = await fetch('data/books-list.json');
            const listData = await listRes.json();
            const books = Array.isArray(listData) ? listData : (listData.books || []);
            const foundBook = books.find(b => (b.file || '').includes(cleanId) || b.id == cleanId);

            if (foundBook) {
                if (titleHeader) titleHeader.innerText = foundBook.title;
                contentDiv.innerHTML = `
                    <div style="padding: 20px;">
                        <h3 style="color: var(--accent-color); margin-bottom: 15px;">${foundBook.title}</h3>
                        <p style="font-size: 1.1rem; line-height: 2; margin-bottom: 20px;">${foundBook.description || ''}</p>
                        <div style="background: var(--bg-color); padding: 15px; border-radius: 8px; border: 1px solid var(--border-color);">
                            <p><b>المؤلف:</b> ${foundBook.author || 'غيرระบุ'}</p>
                            <p><b>القسم:</b> ${foundBook.category || 'عام'}</p>
                        </div>
                    </div>
                `;
                return;
            }
        } catch (e) {
            console.error(e);
        }

        contentDiv.innerHTML = `
            <div style="text-align: center; padding: 30px;">
                <p style="color: #e74c3c; font-weight: bold; font-size: 1.1rem;">عذراً، تعذر تحميل محتوى هذا الكتاب حالياً.</p>
                <p style="color: #7f8c8d; font-size: 0.9rem; margin-top: 10px;">تأكد من رفع ملف الكتاب المطابق داخل مجلد data على المستودع.</p>
                <a href="index.html" style="display:inline-block; margin-top:20px; color:var(--accent-color); font-weight:bold;">العودة للمكتبة الرئيسية</a>
            </div>
        `;
    }
});

function renderContent(data, container) {
    container.innerHTML = "";
    let htmlContent = "";

    if (typeof data === 'string') {
        htmlContent = formatParagraphs(data);
    } else if (data.content) {
        htmlContent = formatParagraphs(data.content);
    } else if (Array.isArray(data)) {
        htmlContent = data.map(item => `<h3>${item.title || ''}</h3>` + formatParagraphs(item.content || item.text || item)).join('<hr style="margin:20px 0; border:0; border-top:1px solid #ddd;">');
    } else if (data.chapters && Array.isArray(data.chapters)) {
        htmlContent = data.chapters.map(chap => `<h3 style="color:var(--accent-color); margin:25px 0 10px 0;">${chap.title || ''}</h3>` + formatParagraphs(chap.content || chap.text || '')).join('');
    } else {
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
