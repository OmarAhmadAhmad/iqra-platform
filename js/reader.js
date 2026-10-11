document.addEventListener("DOMContentLoaded", async () => {
    initTheme();
    setupProgressLine();

    const params = new URLSearchParams(window.location.search);
    let bookParam = params.get('book');

    const contentDiv = document.getElementById('bookContent');
    const titleHeader = document.getElementById('bookTitle');

    if (!bookParam) {
        if (contentDiv) contentDiv.innerHTML = "<p style='text-align:center;'>لم يتم تحديد مرجع.</p>";
        return;
    }

    let cleanId = bookParam.replace(/\.json$/i, '').trim();

    try {
        const response = await fetch(`data/${cleanId}.json`);
        if (!response.ok) throw new Error("خطأ بالملف");
        
        const data = await response.json();
        let title = data.title || cleanId.replace(/-/g, ' ');
        
        if (titleHeader) titleHeader.innerText = title;
        document.title = `${title} - مكتبة الطريقة الجامعة`;

        try {
            localStorage.setItem("lastBookRead", JSON.stringify({
                id: cleanId,
                title: title
            }));
        } catch(e) {}

        setupReaderFav(cleanId);
        setupShareButton(title);
        renderParsedText(data, contentDiv);

    } catch (error) {
        if (contentDiv) {
            contentDiv.innerHTML = "<p style='text-align:center; color:#ef4444;'>تعذر تحميل هذا الورد.</p>";
        }
    }
});

function setupProgressLine() {
    window.addEventListener('scroll', () => {
        let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        let scrolled = (winScroll / height) * 100;
        let line = document.getElementById('progressBar');
        if (line) line.style.width = scrolled + '%';
    });
}

function setupReaderFav(cleanId) {
    const btn = document.getElementById('favoriteBtn');
    if (!btn) return;

    function updateState() {
        try {
            let favs = JSON.parse(localStorage.getItem("libraryFavs")) || [];
            if (favs.includes(cleanId)) {
                btn.innerText = "⭐ مفضل";
                btn.style.background = "#f59e0b";
                btn.style.color = "#fff";
            } else {
                btn.innerText = "⭐";
                btn.style.background = "var(--bg-color)";
                btn.style.color = "var(--text-main)";
            }
        } catch(e) {}
    }

    updateState();

    btn.addEventListener('click', () => {
        try {
            let favs = JSON.parse(localStorage.getItem("libraryFavs")) || [];
            if (favs.includes(cleanId)) {
                favs = favs.filter(i => i !== cleanId);
            } else {
                favs.push(cleanId);
            }
            localStorage.setItem("libraryFavs", JSON.stringify(favs));
            updateState();
        } catch(e) {}
    });
}

function setupShareButton(title) {
    const shareBtn = document.getElementById('shareBtn');
    if (!shareBtn) return;

    shareBtn.addEventListener('click', async () => {
        const shareData = {
            title: title,
            text: `من أوراد ودروس الشيخ أحمد البسفي - ${title}:`,
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {}
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("تم نسخ رابط الدرس إلى الحافظة!");
        }
    });
}

function renderParsedText(data, container) {
    container.innerHTML = "";
    let rawText = "";

    if (typeof data === 'string') {
        rawText = data;
    } else if (data.content) {
        rawText = data.content;
    } else if (Array.isArray(data)) {
        rawText = data.map(i => typeof i === 'string' ? i : (i.content || i.text || '')).join('\n\n');
    } else {
        rawText = data.description || JSON.stringify(data, null, 2);
    }

    let lines = rawText.split(/\r?\n/);
    let html = "";

    lines.forEach(line => {
        let trimmed = line.trim();
        if (!trimmed) return;

        if (trimmed.startsWith("###") || trimmed.startsWith("الكتاب") || trimmed.startsWith("المصباح") || (trimmed.startsWith("الدرس") && trimmed.length < 50)) {
            html += `<h3>${trimmed.replace("###", "").trim()}</h3>`;
        } else if (trimmed.length < 40 && !trimmed.includes(".") && !trimmed.includes("،")) {
            html += `<div class="highlight-box">${trimmed}</div>`;
        } else {
            html += `<p>${trimmed}</p>`;
        }
    });

    container.innerHTML = html;
}

function initTheme() {
    let saved = localStorage.getItem("theme") || "light";
    document.body.setAttribute("data-theme", saved);
}
