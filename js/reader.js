// js/reader.js - محرك تنسيق وتنظيف وعرض النصوص فقرة فقرة وحفظ القراءة الأخيرة
document.addEventListener("DOMContentLoaded", async () => {
    initTheme();
    const params = new URLSearchParams(window.location.search);
    let bookParam = params.get('book');

    const contentDiv = document.getElementById('bookContent');
    const titleHeader = document.getElementById('bookTitle');

    if (!bookParam) {
        contentDiv.innerHTML = "<p style='text-align:center;'>لم يتم تحديد كتاب للعرض.</p>";
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

        // حفظ أحدث كتاب في التخزين المحلي لخاصية "متابعة القراءة"
        localStorage.setItem("lastReadBook", JSON.stringify({
            id: cleanId,
            title: title
        }));

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

function formatAndRenderBook(data, container) {
    container.innerHTML = "";
    let rawText = "";

    if (typeof data === 'string') {
        rawText = data;
    } else if (data.content) {
        rawText = data.content;
    } else if (Array.isArray(data)) {
        rawText = data.map(item => item.title ? `\n\n### ${item.title}\n\n` + (item.content || item.text || '') : (item.content || item.text || item)).join('\n\n');
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
