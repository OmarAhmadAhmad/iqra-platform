const url = 'data/sahm-book.com-كتاب-دلائل-الخيرات.pdf';

let pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    scale = 1.3,
    canvas = document.getElementById('pdf-canvas'),
    ctx = canvas.getContext('2d');

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

function onPrevPage() {
    if (pageNum <= 1) return;
    pageNum--;
    queueRenderPage(pageNum);
}
document.getElementById('prev-page').addEventListener('click', onPrevPage);

function onNextPage() {
    if (pageNum >= pdfDoc.numPages) return;
    pageNum++;
    queueRenderPage(pageNum);
}
document.getElementById('next-page').addEventListener('click', onNextPage);

function goToWird(targetPage) {
    if (pdfDoc && targetPage <= pdfDoc.numPages) {
        pageNum = targetPage;
        queueRenderPage(pageNum);
        document.getElementById('pdf-viewer-container').scrollTo({ top: 0, behavior: 'smooth' });
    }
}

pdfjsLib.getDocument(url).promise.then(function(pdfDoc_) {
    pdfDoc = pdfDoc_;
    document.getElementById('page-count').textContent = pdfDoc.numPages;
    renderPage(pageNum);
}).catch(function(error) {
    console.error('خطأ في تحميل ملف الـ PDF:', error);
    alert('تعذر تحميل ملف دلائل الخيرات. تأكد من وضعه في مجلد data بالاسم الصحيح.');
});
