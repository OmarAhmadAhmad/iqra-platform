// js/reader.js - العارض المحترف للأوراد والـ PDF المحلي
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const bookFile = decodeURIComponent(urlParams.get('file') || urlParams.get('book') || '');

    // التحقق هل الملف PDF أم JSON نصي
    const isPdf = bookFile.endsWith('.pdf') || bookFile.includes('دلائل') || bookFile.includes('فيض');

    if (isPdf) {
        let pdfPath = 'data/' + bookFile;
        // ضمان الاسم الافتراضي إذا لزم الأمر
        if (!bookFile.endsWith('.pdf')) {
            if (bookFile.includes('فيض')) pdfPath = 'data/فيض المنان.pdf';
            else pdfPath = 'data/دلائل الخيرات.pdf';
        }
        initPdfViewer(pdfPath, bookFile);
    } else {
        // تشغيل الكتب النصية العادية JSON
        initJsonReader(bookFile || 'book-1.json');
    }
});

function initPdfViewer(pdfUrl, bookFile) {
    const wirdsNavBar = document.getElementById('wirdsNavBar');
    let bookTitleText = "دلائل الخيرات وشوارق الأنوار";

    if (pdfUrl.includes('فيض') || bookFile.includes('فيض')) {
        bookTitleText = "كتاب فيض المنان - الشيخ جابر البغدادي";
        if (wirdsNavBar) {
            wirdsNavBar.style.display = 'flex';
            wirdsNavBar.innerHTML = `
                <button class="wird-btn" onclick="goToWird(1)">مقدمة كتاب فيض المنان</button>
                <button class="wird-btn" onclick="goToWird(10)">ورد الصباح والاستفتاح</button>
                <button class="wird-btn" onclick="goToWird(25)">ورد الصلوات الإبراهيمية</button>
                <button class="wird-btn" onclick="goToWird(40)">حزب الجمعة المباركة</button>
                <button class="wird-btn" onclick="goToWird(60)">خاتمة الأوراد والأدعية</button>
            `;
        }
    } else {
        bookTitleText = "دلائل الخيرات وشوارق الأنوار";
        if (wirdsNavBar) {
            wirdsNavBar.style.display = 'flex';
            wirdsNavBar.innerHTML = `
                <button class="wird-btn" onclick="goToWird(14)">ورد الإثنين (الحزب 1)</button>
                <button class="wird-btn" onclick="goToWird(48)">ورد الثلاثاء (الحزب 2)</button>
                <button class="wird-btn" onclick="goToWird(82)">ورد الأربعاء (الحزب 3)</button>
                <button class="wird-btn" onclick="goToWird(116)">ورد الخميس (الحزب 4)</button>
                <button class="wird-btn" onclick="goToWird(150)">ورد الجمعة (الحزب 5)</button>
                <button class="wird-btn" onclick="goToWird(184)">ورد السبت (الحزب 6)</button>
                <button class="wird-btn" onclick="goToWird(218)">ورد الأحد (الحزب 7)</button>
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
        <button class="control-btn" id="prev-page">الصفحة السابقة</button>
        <span>صفحة <span id="page-num">1</span> من <span id="page-count">1</span></span>
        <button class="control-btn" id="next-page">الصفحة التالية</button>
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
        bookContentEl.innerHTML = `<p style="text-align: center; color: #b22222; padding: 20px;">تعذر تحميل الكتاب. تأكد من وجود ملف الـ PDF محلياً داخل مجلد data على GitHub بالاسم الصحيح.</p>`;
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
                bookContentEl.innerHTML = data.content || '<p>لا يوجد محتوى متوفر بهذا الكتاب حالياً.</p>';
            }
        })
        .catch(err => console.error("خطأ في جلب الكتاب النصي:", err));
}
