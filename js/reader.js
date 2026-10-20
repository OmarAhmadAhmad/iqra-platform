// js/reader.js - المحرك الموحد المتقدم لعرض الكتب النصية (JSON) وملفات الـ PDF والأوراد التفاعلية
document.addEventListener("DOMContentLoaded", async () => {
    initTheme();
    const params = new URLSearchParams(window.location.search);
    let bookParam = params.get('book') || params.get('file') || '';

    const contentDiv = document.getElementById('bookContent');
    const titleHeader = document.getElementById('bookTitle');

    if (!bookParam) {
        contentDiv.innerHTML = "<p style='text-align:center; padding: 30px;'>لم يتم تحديد كتاب للعرض.</p>";
        return;
    }

    try {
        bookParam = decodeURIComponent(bookParam);
    } catch(e) {}

    let cleanId = bookParam.replace(/\.json$/i, '').trim();

    // 1. التحقق هل الكتاب عبارة عن ملف PDF (مثل دلائل الخيرات أو فيض المنان)
    const isPdf = cleanId.toLowerCase().includes('pdf') || cleanId.includes('دلائل') || cleanId.includes('فيض') || cleanId.includes('dalael') || cleanId.includes('fayd');

    if (isPdf) {
        let pdfFileName = "دلائل الخيرات.pdf";
        let bookTitleText = "دلائل الخيرات وشوارق الأنوار";

        if (cleanId.includes('فيض') || cleanId.includes('fayd')) {
            pdfFileName = "فيض المنان.pdf";
            bookTitleText = "كتاب فيض المنان - الشيخ جابر البغدادي";
        } else {
            pdfFileName = "دلائل الخيرات.pdf";
            bookTitleText = "دلائل الخيرات وشوارق الأنوار الخمسة عشر";
        }

        if (titleHeader) titleHeader.innerText = bookTitleText;
        document.title = `${bookTitleText} - مكتبة الطريقة الجامعة`;

        // حفظ حالة التقدم للقراءة
        try {
            localStorage.setItem("lastReadBook", JSON.stringify({
                id: cleanId,
                title: bookTitleText
            }));
        } catch(e) {}

        initPdfViewer(`data/${pdfFileName}`, bookTitleText, pdfFileName);
        return;
    }

    // 2. معالجة الكتب النصية (JSON)
    try {
        const response = await fetch(`data/${cleanId}.json`);
        if (!response.ok) throw new Error("فشل الجلب");
        
        const data = await response.json();
        
        let title = data.title || cleanId.replace(/-/g, ' ');
        if (titleHeader) titleHeader.innerText = title;
        document.title = `${title} - مكتبة الطريقة الجامعة`;

        try {
            localStorage.setItem("lastReadBook", JSON.stringify({
                id: cleanId,
                title: title
            }));
        } catch(e) {}

        formatAndRenderBook(data, contentDiv);

    } catch (error) {
        console.error(error);
        contentDiv.innerHTML = `
            <div style="text-align: center; padding: 30px;">
                <p style="color: #e74c3c; font-weight: bold;">عذراً، تعذر تحميل محتوى هذا الكتاب.</p>
                <a href="index.html" style="display:inline-block; margin-top:15px; color:var(--accent-color); font-weight:bold;">العودة للمكتبة الرئيسية</a>
            </div>
        `;
    }
});

// دالة تشغيل وعرض ملفات الـ PDF عبر عارض المتصفح المدمج لمنع تقطيع وحراف الحروف العربية
function initPdfViewer(pdfUrl, bookTitleText, pdfFileName) {
    const wirdsNavBar = document.getElementById('wirdsNavBar');
    const contentDiv = document.getElementById('bookContent');
    if (!contentDiv) return;

    // إعداد أزرار الأوراد اليومية ديناميكياً
    if (wirdsNavBar) {
        wirdsNavBar.style.display = 'flex';
        if (pdfFileName.includes('فيض')) {
            wirdsNavBar.innerHTML = `
                <button class="wird-btn" onclick="goToPdfPage(1)" style="padding: 6px 12px; background: var(--accent-color); color: #fff; border: none; border-radius: 6px; cursor: pointer;">المقدمة</button>
                <button class="wird-btn" onclick="goToPdfPage(10)" style="padding: 6px 12px; background: var(--accent-color); color: #fff; border: none; border-radius: 6px; cursor: pointer;">ورد الصباح</button>
                <button class="wird-btn" onclick="goToPdfPage(25)" style="padding: 6px 12px; background: var(--accent-color); color: #fff; border: none; border-radius: 6px; cursor: pointer;">الصلوات الإبراهيمية</button>
                <button class="wird-btn" onclick="goToPdfPage(40)" style="padding: 6px 12px; background: var(--accent-color); color: #fff; border: none; border-radius: 6px; cursor: pointer;">حزب الجمعة</button>
                <button class="wird-btn" onclick="goToPdfPage(60)" style="padding: 6px 12px; background: var(--accent-color); color: #fff; border: none; border-radius: 6px; cursor: pointer;">الخاتمة</button>
            `;
        } else {
            wirdsNavBar.innerHTML = `
                <button class="wird-btn" onclick="goToPdfPage(14)" style="padding: 6px 12px; background: var(--accent-color); color: #fff; border: none; border-radius: 6px; cursor: pointer;">الإثنين (حزب 1)</button>
                <button class="wird-btn" onclick="goToPdfPage(48)" style="padding: 6px 12px; background: var(--accent-color); color: #fff; border: none; border-radius: 6px; cursor: pointer;">الثلاثاء (حزب 2)</button>
                <button class="wird-btn" onclick="goToPdfPage(82)" style="padding: 6px 12px; background: var(--accent-color); color: #fff; border: none; border-radius: 6px; cursor: pointer;">الأربعاء (حزب 3)</button>
                <button class="wird-btn" onclick="goToPdfPage(116)" style="padding: 6px 12px; background: var(--accent-color); color: #fff; border: none; border-radius: 6px; cursor: pointer;">الخميس (حزب 4)</button>
                <button class="wird-btn" onclick="goToPdfPage(150)" style="padding: 6px 12px; background: var(--accent-color); color: #fff; border: none; border-radius: 6px; cursor: pointer;">الجمعة (حزب 5)</button>
                <button class="wird-btn" onclick="goToPdfPage(184)" style="padding: 6px 12px; background: var(--accent-color); color: #fff; border: none; border-radius: 6px; cursor: pointer;">السبت (حزب 6)</button>
                <button class="wird-btn" onclick="goToPdfPage(218)" style="padding: 6px 12px; background: var(--accent-color); color: #fff; border: none; border-radius: 6px; cursor: pointer;">الأحد (حزب 7)</button>
            `;
        }
    }

    // عرض الـ PDF بجودة أصلية كاملة ومنع تقطيع الحروف تماماً عبر عنصر الـ iframe
    contentDiv.innerHTML = `
        <div style="width: 100%; height: 80vh; position: relative;">
            <iframe id="pdfFrame" src="${pdfUrl}#toolbar=1&view=FitH" style="width: 100%; height: 100%; border: none; border-radius: 8px;" title="${bookTitleText}"></iframe>
        </div>
    `;

    // دالة الانتقال للأوراد والصفحات داخل الـ Iframe
    window.goToPdfPage = function(pageNum) {
        const iframe = document.getElementById('pdfFrame');
        if (iframe) {
            iframe.src = `${pdfUrl}#page=${pageNum}&toolbar=1&view=FitH`;
        }
    };
}

// دالة تنسيق الكتب النصية (JSON) الفقرة تلو الأخرى
function formatAndRenderBook(data, container) {
    container.innerHTML = "";
    let rawText = "";

    if (typeof data === 'string') {
        rawText = data;
    } else if (data.content) {
        rawText = data.content;
    } else if (Array.isArray(data)) {
        rawText = data.map(item => {
            if (typeof item === 'string') return item;
            return item.title ? `\n\n### ${item.title}\n\n` + (item.content || item.text || '') : (item.content || item.text || '');
        }).join('\n\n');
    } else if (data.chapters && Array.isArray(data.chapters)) {
        data.chapters.forEach(chap => {
            const h = document.createElement('h3');
            h.innerText = cleanArtifacts(chap.title || "فصل");
            container.appendChild(h);
            
            const pDiv = document.createElement('div');
            pDiv.innerHTML = processParagraphs(chap.content || chap.text || "");
            container.appendChild(pDiv);
        });
        return;
    } else {
        rawText = data.description || JSON.stringify(data, null, 2);
    }

    container.innerHTML = processParagraphs(rawText);
}

function cleanArtifacts(text) {
    if (!text) return "";
    return text.toString()
        .replace(/[\uFFFD\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
        .replace(/\s+([،؛.؟!%])/g, '$1')
        .trim();
}

function processParagraphs(text) {
    if (!text) return "";
    let cleaned = cleanArtifacts(text);
    let lines = cleaned.split(/\r?\n/);
    let htmlOutput = "";

    lines.forEach(line => {
        let trimmed = line.trim();
        if (trimmed.length === 0) return;

        if (trimmed.startsWith("###") || trimmed.startsWith("الكتاب") || trimmed.startsWith("المصباح") || (trimmed.startsWith("الدرس") && trimmed.length < 50)) {
            let headingText = trimmed.replace("###", "").trim();
            htmlOutput += `<h3>${headingText}</h3>`;
        } 
        else if (trimmed.length < 40 && !trimmed.includes(".") && !trimmed.includes("،")) {
            htmlOutput += `<div class="highlight-box">${trimmed}</div>`;
        } 
        else {
            htmlOutput += `<p>${trimmed}</p>`;
        }
    });

    return htmlOutput;
}

function initTheme() {
    const saved = localStorage.getItem("theme") || "light";
    document.body.setAttribute("data-theme", saved);
}
