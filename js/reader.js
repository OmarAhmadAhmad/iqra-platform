document.addEventListener("DOMContentLoaded", () => {
    // 1. استخراج اسم الملف بدقة مهما كانت طريقة كتابة الـ URL
    const urlParams = new URLSearchParams(window.location.search);
    let rawFile = urlParams.get('file') || urlParams.get('book') || urlParams.get('pdf') || '';

    // فك التشفير للأسماء العربية
    try {
        rawFile = decodeURIComponent(rawFile);
    } catch (e) {
        console.error(e);
    }

    // 2. معالجة جذرية: إن كانت الصفحة مفتوحة مباشرة أو بدون بارامتر، اختر دلائل الخيرات افتراضياً
    if (!rawFile || rawFile === 'null' || rawFile === 'undefined' || rawFile.trim() === '') {
        rawFile = 'دلائل الخيرات.pdf';
    }

    // 3. مطابقة الملف والمسار
    let pdfFileName = '';
    let bookTitleText = '';

    if (rawFile.includes('فيض') || rawFile.includes('fayd')) {
        pdfFileName = 'فيض المنان.pdf';
        bookTitleText = 'كتاب فيض المنان - الشيخ جابر البغدادي';
    } else if (rawFile.includes('دلائل') || rawFile.includes('dalael') || rawFile.endsWith('.pdf')) {
        pdfFileName = 'دلائل الخيرات.pdf';
        bookTitleText = 'دلائل الخيرات وشوارق الأنوار';
    } else {
        // للكتب النصية JSON
        initJsonReader(rawFile);
        return;
    }

    // مسار الـ PDF المحلي المباشر في مجلد data/
    const finalPdfUrl = `data/${pdfFileName}`;
    
    // تشغيل العارض المباشر
    loadPdfDocument(finalPdfUrl, bookTitleText, pdfFileName);
    setupFullscreen();
});

// دالة عرض الـ PDF المباشرة والأوراد
function loadPdfDocument(pdfUrl, titleText, pdfFileName) {
    const titleEl = document.getElementById('bookTitle');
    if (titleEl) titleEl.textContent = titleText;

    const wirdsNavBar = document.getElementById('wirdsNavBar');
    
    // شريط الأوراد اليومية
    if (pdfFileName.includes('فيض')) {
        if (wirdsNavBar) {
            wirdsNavBar.style.display = 'flex';
            wirdsNavBar.innerHTML = `
                <button class="wird-btn" onclick="goToWird(1)">المقدمة</button>
                <button class="wird-btn" onclick="goToWird(10)">ورد الصباح</button>
                <button class="wird-btn" onclick="goToWird(25)">الصلوات الإبراهيمية</button>
                <button class="wird-btn" onclick="goToWird(40)">حزب الجمعة</button>
                <button class="wird-btn" onclick="goToWird(60)">الخاتمة</button>
            `;
        }
    } else {
        if (wirdsNavBar) {
            wirdsNavBar.style.display = 'flex';
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
    
    const bookContentEl = document.getElementById('bookContent');
    if (!bookContentEl) return;
    bookContentEl.innerHTML = '';
    
    const viewerContainer = document.createElement('div');
    viewerContainer.id = 'pdf-viewer-container';
    viewerContainer.appendChild(canvas);
    bookContentEl.appendChild(viewerContainer);

    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'pdf-controls';
    controlsDiv.innerHTML = `
        <button class="control-btn" id="prev-page">السابقة</button>
        <button class="control-btn" id="zoom-out" title="تصغير">-</button>
        <span>صفحة <span id="page-num">1</span> من <span id="page-count">1</span></span>
        <button class="control-btn" id="zoom-in" title="تكبير">+</button>
        <button class="control-btn" id="next-page">التالية</button>
    `;
    bookContentEl.appendChild(controlsDiv);

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
        console.error('خطأ التحميل:', error);
        bookContentEl.innerHTML = `<p style="text-align: center; color: #b22222; padding: 30px;">
            تعذر تحميل الكتاب.<br>تأكد من أن اسم الملف في مجلد data/ ينتهي بـ (.pdf) ومكتوب بالدقة التالية:<br>
            <b>data/دلائل الخيرات.pdf</b> أو <b>data/فيض المنان.pdf</b>
        </p>`;
    });
}

function initJsonReader(fileName) {
    fetch(`data/${fileName}`)
        .then(res => res.json())
        .then(data => {
            let titleEl = document.getElementById('bookTitle');
            if (titleEl) titleEl.textContent = data.title || 'قراءة الكتاب';
            
            let bookContentEl = document.getElementById('bookContent');
            if (bookContentEl) {
                bookContentEl.innerHTML = `<div class="json-text-content">${data.content || '<p>محتوى الكتاب قيد التجهيز.</p>'}</div>`;
            }
        })
        .catch(err => {
            let bookContentEl = document.getElementById('bookContent');
            if (bookContentEl) {
                bookContentEl.innerHTML = `<p style="text-align: center; padding: 30px;">يرجى رفع المشروع على GitHub Pages لقراءة الملفات النصية.</p>`;
            }
        });
}

function setupFullscreen() {
    const btn = document.getElementById('fullscreenBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    });
}
