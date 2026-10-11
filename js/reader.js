document.addEventListener("DOMContentLoaded", async () => {
    initTheme();
    setupProgressBar();

    const params = new URLSearchParams(window.location.search);
    let bookParam = params.get('book');

    const contentDiv = document.getElementById('bookContent');
    const titleHeader = document.getElementById('bookTitle');

    if (!bookParam) {
        if (contentDiv) contentDiv.innerHTML = "<p style='text-align:center;'>لم يتم تحديد مرجع للقراءة.</p>";
        return;
    }

    let cleanId = bookParam.replace(/\.json$/i, '').trim();

    try {
        const response = await fetch(`data/${cleanId}.json`);
        if (!response.ok) throw new Error("فشل الجلب");
        
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

        setupReaderFavBtn(cleanId);
        renderContent(data, contentDiv);

    } catch (error) {
        console.error(error);
        if (contentDiv) {
            contentDiv.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <p style="color: #ef4444; font-weight: bold;">عذراً، تعذر جلب محتوى هذا الملف.</p>
                    <a href="index.html" class="action-chip" style="display:inline-block; margin-top:15px;">العودة للرئيسية</a>
                </div>
            `;
        }
    }
});

function setupProgressBar() {
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const bar = document.getElementById('progressBar');
        if (bar) bar.style.width = scrolled + '%';
    });
}

function setupReaderFavBtn(cleanId) {
    const btn = document.getElementById('favoriteBtn');
    if (!btn) return;

    function refreshState() {
        try {
            const favs = JSON.parse(localStorage.getItem("libraryFavs")) || [];
            if (favs.includes(cleanId)) {
                btn.innerText = "⭐ مفضل عندي";
                btn.classList.add("is-fav");
            } else {
                btn.innerText = "⭐ أضف للمفضلة";
                btn.classList.remove("is-fav");
            }
        } catch(e) {}
    }

    refreshState();

    btn.addEventListener('click', () => {
        try {
            let favs = JSON.parse(localStorage.getItem("libraryFavs")) || [];
            if (favs.includes(cleanId)) {
                favs = favs.filter(i => i !== cleanId);
            } else {
                favs.push(cleanId);
            }
            localStorage.setItem("libraryFavs", JSON.stringify(favs));
            refreshState();
        } catch(e) {}
    });
}

function renderContent(data, container) {
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
    const saved = localStorage.getItem("theme") || "light";
    document.body.setAttribute("data-theme", saved);
}
