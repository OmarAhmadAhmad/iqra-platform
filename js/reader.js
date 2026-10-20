document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pdfParam = urlParams.get('pdf');
    const bookFile = urlParams.get('book') || urlParams.get('file') || '';

    // قائمة الروابط المباشرة للكتب
    const bookSources = {
        'dalael.json': 'https://lh3.googleusercontent.com/d/1dcbaGpxEYaJQYnpx-wv-yGPTiy1mUoEc',
        'fayd-almanan.json': 'https://lh3.googleusercontent.com/d/15F43ORYaPJKKyZYoFTyJgycE4PX0OSv1'
    };

    let pdfUrl = pdfParam || bookSources[bookFile] || 'https://lh3.googleusercontent.com/d/1dcbaGpxEYaJQYnpx-wv-yGPTiy1mUoEc';

    // ضبط خريطة الأوراد اليومية للكتابين
    const wirdsNavBar = document.getElementById('wirdsNavBar');
    
    if (bookFile.includes('dalael') || pdfUrl.includes('1dcbaGpxEYaJQYnpx')) {
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
    } else if (bookFile.includes('fayd') || pdfUrl.includes('15F43ORYaPJKKyZYoFTyJgycE4PX0OSv1')) {
        wirdsNavBar.style.display = 'flex';
        wirdsNavBar.innerHTML = `
            <button class="wird-btn" onclick="goToWird(1)">مقدمة كتاب فيض المنان</button>
            <button class="wird-btn" onclick="goToWird(10)">ورد الصباح والاستفتاح</button>
            <button class="wird-btn" onclick="goToWird(25)">ورد الصلوات الإبراهيمية</button>
            <button class="wird-btn" onclick="goToWird(40)">حزب الجمعة المباركة</button>
            <button class="wird-btn" onclick="goToWird(60)">خاتمة الأوراد والأدعية</button>
        `;
    }

    let pdfDoc = null,
        pageNum = 1,
        pageRendering = false,
        pageNumPending = null,
        scale = 1.3;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const bookContentEl = document.getElementById('bookContent');
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

            let renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };
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
        
        if (bookFile.includes('fayd') || pdfUrl.includes('15F43ORYaPJKKyZYoFTyJgycE4PX0OSv1')) {
            document.getElementById('bookTitle').textContent = "كتاب فيض المنان - الشيخ جابر البغدادي";
        } else {
            document.getElementById('bookTitle').textContent = "دلائل الخيرات وشوارق الأنوار";
        }
        
        renderPage(pageNum);
    }).catch(function(error) {
        console.error('خطأ في تحميل الـ PDF:', error);
        bookContentEl.innerHTML = `<p style="text-align: center; color: #b22222; padding: 20px;">تعذر تحميل الكتاب. يرجى التأكد من الاتصال بالإنترنت أو مراجعة رابط جوجل درايف.</p>`;
    });
});
