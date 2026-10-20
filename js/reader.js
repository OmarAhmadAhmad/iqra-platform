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

// دالة تشغيل وعرض ملفات الـ PDF والأوراد التفاعلية
function initPdfViewer(pdfUrl, bookTitleText, pdfFileName) {
    const wirdsNavBar = document.getElementById('wirdsNavBar');
    const contentDiv = document.getElementById('bookContent');
    if (!contentDiv) return;

    // إعداد أزرار الأوراد اليومية ديناميكياً
    if (wirdsNavBar) {
        wirdsNavBar.style.display = 'flex';
        if (pdfFileName.includes('فيض')) {
            wirdsNavBar.innerHTML = `
                <button class="wird-btn" onclick="goToWird(1)">المقدمة</button>
                <button class="wird-btn" onclick="goToWird(10)">ورد الصباح</button>
                <button class="wird-btn" onclick="goToWird(25)">الصلوات الإبراهيمية</button>
                <button class="wird-btn" onclick="goToWird(40)">حزب الجمعة</button>
                <button class="wird-btn" onclick="goToWird(60)">الخاتمة</button>
            `;
        } else {
            wirdsNavBar.innerHTML = `
                <button class="wird-btn" onclick="goToWird(14)">الإثنين (حزب 1)</button>
                <button class="wird-btn" onclick="goToWird(48)">الثلاثاء (حزب 2)</button>
                <button class="wird-btn" onclick="goToWird(82)">الأربعاء (حزب 3)</button>
                <button class="wird-btn" onclick="goToWird(116)">الخميس (حزب 4)</button>
                <button class="wird-btn" onclick="goToWird(150)">الجمعة (حزب 5)</button>
                <button class="wird-btn" onclick="goToWird(184)">السبت (حزب 6)</button>
                <button class="wird-btn" onclick="goToWird(218)">الأحد (حزب 7)</button>
            `;
        }
    }

    let pdfDoc = null,
        pageNum = 1,
        pageRendering = false,
        pageNumPending = null,
        scale = 1.3;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    contentDiv.innerHTML = '';
    
    const viewerContainer = document.createElement('div');
    viewerContainer.id = 'pdf-viewer-container';
    viewerContainer.style.cssText = "display: flex; justify-content: center; overflow-x: auto; width: 100%;";
    viewerContainer.appendChild(canvas);
    contentDiv.appendChild(viewerContainer);

    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'pdf-controls';
    controlsDiv.style.cssText = "margin-top: 20px; display: flex; gap: 10px; align-items: center; justify-content: center; flex-wrap: wrap;";
    controlsDiv.innerHTML = `
        <button class="control-btn" id="prev-page" style="padding: 8px 14px; background: var(--accent-color); color: #fff; border: none; border-radius: 6px; cursor: pointer;">الصفحة السابقة</button>
        <button class="control-btn" id="zoom-out" style="padding: 8px 12px; background: var(--accent-color); color: #fff; border: none; border-radius: 6px; cursor: pointer;">- تصبير</button>
        <span style="font-weight: bold;">صفحة <span id="page-num">1</span> من <span id="page-count">1</span></span>
        <button class="control-btn" id="zoom-in" style="padding: 8px 12px; background: var(--accent-color); color: #fff; border: none; border-radius: 6px; cursor: pointer;">+ تكبير</button>
        <button class="control-btn" id="next-page" style="padding: 8px 14px; background: var(--accent-color); color: #fff; border: none; border-radius: 6px; cursor: pointer;">الصفحة التالية</button>
    `;
    contentDiv.appendChild(controlsDiv);

    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

    function renderPage(num) {
        pageRendering = true;
        pdfDoc.getPage(num).then(function(page) {
            let viewport = page.getViewport({ scale: scale });
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            let renderContext = { canvasContext: ctx, viewport: viewport };
            let renderTask = page.render(renderContext);

            renderTask.promise.then(function() {
                pageRendering = false;
                if (pageNumPending !== null) {
                    renderPage(pageNumPending);
                    pageNumPending = null;
                }
            });
        });

        document.getElementById('page-num').textContent = num;
    }

    function queueRenderPage(num) {
        if (pageRendering) {
            pageNumPending = num;
        } else {
            renderPage(num);
        }
    }

    document.getElementById('prev-page').addEventListener('click', () => {
        if (pageNum <= 1) return;
        pageNum--;
        queueRenderPage(pageNum);
    });

    document.getElementById('next-page').addEventListener('click', () => {
        if (pageNum >= pdfDoc.numPages) return;
        pageNum++;
        queueRenderPage(pageNum);
    });

    document.getElementById('zoom-in').addEventListener('click', () => {
        scale += 0.2;
        queueRenderPage(pageNum);
    });

    document.getElementById('zoom-out').addEventListener('click', () => {
        if (scale > 0.6) {
            scale -= 0.2;
            queueRenderPage(pageNum);
        }
    });

    window.goToWird = function(targetPage) {
        if (pdfDoc && targetPage <= pdfDoc.numPages) {
            pageNum = targetPage;
            queueRenderPage(pageNum);
            viewerContainer.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    pdfjsLib.getDocument(pdfUrl).promise.then(function(pdfDoc_) {
        pdfDoc = pdfDoc_;
        document.getElementById('page-count').textContent = pdfDoc.numPages;
        renderPage(pageNum);
    }).catch(function(error) {
        console.error('خطأ في تحميل الـ PDF:', error);
        contentDiv.innerHTML = `<p style="text-align: center; color: #b22222; padding: 20px;">تعذر تحميل الملف. تأكد من وجود ملف الـ PDF محلياً داخل مجلد data/ بالاسم الصحيح.</p>`;
    });
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
