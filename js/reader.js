document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    let bookFile = urlParams.get('file') || urlParams.get('book') || '';
    
    try {
        bookFile = decodeURIComponent(bookFile);
    } catch(e) {}

    // المعالجة التلقائية لتفادي الشاشة البيضاء في حال لم يُحدد ملف
    if (!bookFile || bookFile === 'null' || bookFile === 'undefined') {
        bookFile = 'دلائل الخيرات.pdf';
    }

    const isPdf = bookFile.endsWith('.pdf') || bookFile.includes('دلائل') || bookFile.includes('فيض');

    if (isPdf) {
        let pdfPath = 'data/' + bookFile;
        if (!bookFile.endsWith('.pdf')) {
            if (bookFile.includes('فيض')) pdfPath = 'data/فيض المنان.pdf';
            else pdfPath = 'data/دلائل الخيرات.pdf';
        }
        initPdfViewer(pdfPath, bookFile);
    } else {
        initJsonReader(bookFile);
    }

    setupFullscreen();
});

function initPdfViewer(pdfUrl, bookFile) {
    const wirdsNavBar = document.getElementById('wirdsNavBar');
    let bookTitleText = "دلائل الخيرات وشوارق الأنوار";

    if (pdfUrl.includes('فيض') || bookFile.includes('فيض')) {
        bookTitleText = "كتاب فيض المنان - الشيخ جابر البغدادي";
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
        bookTitleText = "دلائل الخيرات وشوارق الأنوار";
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
        
        let titleEl = document.getElementById('bookTitle');
        if (titleEl) titleEl.textContent = bookTitleText;
        
        renderPage(pageNum);
    }).catch(function(error) {
        console.error('خطأ في تحميل الـ PDF:', error);
        bookContentEl.innerHTML = `<p style="text-align: center; color: #b22222; padding: 20px;">تعذر تحميل الملف. تأكد من رفع ملفات الـ PDF داخل مجلد data على GitHub بأسمائها الصحيحة (دلائل الخيرات.pdf / فيض المنان.pdf).</p>`;
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
            console.error("خطأ في جلب الكتاب النصي:", err);
            let bookContentEl = document.getElementById('bookContent');
            if (bookContentEl) {
                bookContentEl.innerHTML = `<p style="text-align: center; padding: 30px;">تنبيه: لا يمكن جلب ملفات JSON النصية بفتح الملف محلياً (file://). يُرجى رفعه على GitHub Pages لتفعيل العرض النصي الشامل.</p>`;
            }
        });
}

function setupFullscreen() {
    const btn = document.getElementById('fullscreenBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    });
}
