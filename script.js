document.querySelectorAll(".book-card").forEach(card => {
    card.addEventListener("click", () => {
        const bookId = card.dataset.book;
        location.href = `book.html?id=${bookId}`;
    });
});