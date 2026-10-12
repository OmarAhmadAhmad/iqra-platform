document.addEventListener("DOMContentLoaded", () => {
    loadBooksList();
});

// دالة جلب وعرض قائمة الكتب ومعالجة العناوين بدقة
async function loadBooksList() {
    try {
        // جلب قائمة الكتب الرئيسية
        let response = await fetch('data/books-list.json');
        if (!response.ok) throw new Error('تعذر تحميل قائمة الكتب');
        
        let books = await response.json();
        const container = document.getElementById('books-container');
        if (!container) return;
        
        container.innerHTML = '';

        for (let bookMeta of books) {
            // جلب تفاصيل ملف الـ JSON الخاص بكل كتاب على حدة
            let bookDataResponse = await fetch(`data/${bookMeta.file}`);
            let bookData = bookDataResponse.ok ? await bookDataResponse.json() : {};

            // تصحيح عرض العنوان: الاعتماد على العنوان الموجود في ملف الـ JSON مباشرة، وإن لم يوجد يتم استخدام عنوان القائمة
            let correctTitle = bookData.title || bookMeta.title || "كتاب بدون عنوان";
            let correctAuthor = bookData.author || bookMeta.author || "";
            let correctDesc = bookData.description || bookMeta.description || "";

            let card = document.createElement('div');
            card.className = 'book-card';
            card.innerHTML = `
                <h3>${correctTitle}</h3>
                ${correctAuthor ? `<p class="author">${correctAuthor}</p>` : ''}
                ${correctDesc ? `<p class="desc">${correctDesc}</p>` : ''}
                <button class="read-btn" onclick="openBookReader('${bookMeta.file}')">اقرأ الآن ←</button>
            `;
            container.appendChild(card);
        }
    } catch (error) {
        console.error('خطأ أثناء تحميل الكتب:', error);
    }
}

// دالة توجيه المستخدم لصفحة القراءة المناسبة (سواء لملف الـ PDF أو الكتب النصية)
function openBookReader(fileName) {
    if (fileName.includes('dalael')) {
        window.location.href = `reader.html?book=${fileName}`;
    } else {
        window.location.href = `reader.html?file=${fileName}`;
    }
}
