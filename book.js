const params = new URLSearchParams(location.search);
const bookId = params.get("id");

if (!bookId) {
    location.href = "index.html";
}

let pages = [];
let currentPage = 0;

// ✅ [2번] 저장된 페이지 불러오기
const savedPage = localStorage.getItem(`page_${bookId}`);
if (savedPage !== null) {
    currentPage = Number(savedPage);
}

fetch(`books/${bookId}.md`)
    .then(res => {
        if (!res.ok) throw new Error();
        return res.text();
    })
    .then(md => {
        // 🔹 제목 추출
        const lines = md.split("\n");
        const titleIndex = lines.findIndex(line => line.startsWith("# "));
        let title = "PageLoop";

        if (titleIndex !== -1) {
            title = lines[titleIndex].replace("# ", "");
            lines.splice(titleIndex, 1); // ❗ 제목 줄 제거
        }

        document.getElementById("title").innerText = title;
        document.title = `${title} | PageLoop`;

        // 다시 문자열로
        const cleanedMd = lines.join("\n");

        // 🔹 페이지 분리
        pages = cleanedMd.split("---page---");

        // 페이지 범위 보호
        if (currentPage >= pages.length) {
            currentPage = 0;
        }

        renderPage();
    });

// 버튼 클릭
document.getElementById("prev").onclick = () => {
    if (currentPage > 0) {
        currentPage--;
        renderPage();
    }
};

document.getElementById("next").onclick = () => {
    if (currentPage < pages.length - 1) {
        currentPage++;
        renderPage();
    }
};

// ✅ [4번] 키보드 조작
document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft" && currentPage > 0) {
        currentPage--;
        renderPage();
    }
    if (e.key === "ArrowRight" && currentPage < pages.length - 1) {
        currentPage++;
        renderPage();
    }
});

function updateButtons() {
    document.getElementById("page-indicator").innerText =
        `${currentPage + 1} / ${pages.length}`;

    document.getElementById("prev").disabled = currentPage === 0;
    document.getElementById("next").disabled =
        currentPage === pages.length - 1;
}

function renderPage() {
    const pageContent = pages[currentPage];
    document.getElementById("content").innerHTML =
        marked.parse(pageContent);

    // ✅ [2번] 현재 페이지 저장
    localStorage.setItem(`page_${bookId}`, currentPage);

    updateButtons();
}
