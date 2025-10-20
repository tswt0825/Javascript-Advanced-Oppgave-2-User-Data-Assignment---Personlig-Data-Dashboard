const defaultBooks = [
  {
    id: "Book-001",
    title: "Eragon",
    author: "Christopher Paolini",
    genre: "Fantasy",
    pages: 250,
    favorite: false,
  },
  {
    id: "Book-002",
    title: "Den eldste",
    author: "Christopher Paolini",
    genre: "Fantasy",
    pages: 250,
    favorite: false,
  },
  {
    id: "Book-003",
    title: "Brisingr",
    author: "Christopher Paolini",
    genre: "Fantasy",
    pages: 250,
    favorite: false,
  },
  {
    id: "Book-004",
    title: "Arven",
    author: "Christopher Paolini",
    genre: "Fantasy",
    pages: 250,
    favorite: false,
  },
  {
    id: "Book-005",
    title: "Dune",
    author: "Frank Herbert",
    genre: "Science Fiction",
    pages: 412,
    favorite: true,
  },
];

console.log(defaultBooks);

// === DOM ELEMENTS ===
const form = document.getElementById("book-form");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const genreInput = document.getElementById("genre");
const pagesInput = document.getElementById("pages");
const favoriteInput = document.getElementById("favorite");

const filterFavoritesBtn = document.getElementById("filterFavorites");
const sortTitleBtn = document.getElementById("sortTitle");
const clearAllBtn = document.getElementById("clearAll");
const darkModeBtn = document.getElementById("darkMode");

darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

//
const container = document.querySelector(".book-container");

// Opprett visningsområder
const listDiv = document.createElement("div");
listDiv.id = "book-list";
container.appendChild(listDiv);

const statsDiv = document.createElement("div");
statsDiv.id = "stats";
statsDiv.style.marginTop = "20px";
statsDiv.style.padding = "10px";
container.appendChild(statsDiv);

// === Local Storage helpers ===
const getBooks = () => JSON.parse(localStorage.getItem("books")) || [];
const saveBooks = (books) =>
  localStorage.setItem("books", JSON.stringify(books));

// Hvis tom localStorage -> legg inn standardbøkene
if (getBooks().length === 0) {
  saveBooks(defaultBooks);
}

let showFavoritesOnly = false;
let sortAlphabetically = false;

// === Legg til ny bok ===
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const newBook = {
    id: "Book-" + Date.now(),
    title: titleInput.value.trim(),
    author: authorInput.value.trim(),
    genre: genreInput.value.trim(),
    pages: parseInt(pagesInput.value),
    // 🔧 Bruk .checked for å sjekke om favoritt er haket av
    favorite: favoriteInput.checked,
  };

  const books = getBooks();
  books.push(newBook);
  saveBooks(books);

  form.reset();
  renderBooks();
});

// === Render bøker ===
function renderBooks() {
  let books = getBooks();

  if (showFavoritesOnly) {
    books = books.filter((b) => b.favorite);
  }

  if (sortAlphabetically) {
    books.sort((a, b) => a.title.localeCompare(b.title));
  }

  listDiv.innerHTML = "";

  if (books.length === 0) {
    listDiv.innerHTML = "<p>Ingen bøker funnet.</p>";
    statsDiv.innerHTML = "";
    return;
  }

  books.map((book) => {
    const card = document.createElement("div");
    card.classList.add("book-card");
    card.style.border = "1px solid #ccc";
    card.style.padding = "10px";
    card.style.margin = "10px 0";
    card.style.borderRadius = "8px";
    card.style.background = "#f8f8f8";

    const favStar = book.favorite ? "★" : "☆";

    card.innerHTML = `
      <h3>${book.title}</h3>
      <p><strong>Forfatter:</strong> ${book.author}</p>
      <p><strong>Sjanger:</strong> ${book.genre}</p>
      <p><strong>Sider:</strong> ${book.pages}</p>
      <button class="fav-btn">${favStar}</button>
      <button class="delete-btn">Slett</button>
    `;

    // Toggle favoritt
    card.querySelector(".fav-btn").addEventListener("click", () => {
      toggleFavorite(book.id);
    });

    // Slett bok
    card.querySelector(".delete-btn").addEventListener("click", () => {
      deleteBook(book.id);
    });

    listDiv.appendChild(card);
  });

  renderStats(books);
}

// === Statistikk med reduce() ===
function renderStats(books) {
  const totalBooks = books.length;
  const totalPages = books.reduce((sum, b) => sum + (b.pages || 0), 0);
  const favoriteCount = books.filter((b) => b.favorite).length;

  statsDiv.innerHTML = `
    <p><strong>Totalt antall bøker:</strong> ${totalBooks}</p>
    <p><strong>Totalt antall sider:</strong> ${totalPages}</p>
    <p><strong>Antall favorittbøker:</strong> ${favoriteCount}</p>
  `;
}

// === Toggle favoritt ===
function toggleFavorite(id) {
  const books = getBooks().map((b) => {
    if (b.id === id) b.favorite = !b.favorite;
    return b;
  });
  saveBooks(books);
  renderBooks();
}

// === Slett bok ===
function deleteBook(id) {
  if (!confirm("Vil du slette denne boken?")) return;
  const books = getBooks().filter((b) => b.id !== id);
  saveBooks(books);
  renderBooks();
}

// === Slett alle ===
clearAllBtn.addEventListener("click", () => {
  if (!confirm("Vil du slette alle bøker?")) return;
  localStorage.removeItem("books");
  renderBooks();
});

// === Filtrer favoritter ===
filterFavoritesBtn.addEventListener("click", () => {
  showFavoritesOnly = !showFavoritesOnly;
  filterFavoritesBtn.textContent = showFavoritesOnly
    ? "Vis alle"
    : "Vis favoritter";
  renderBooks();
});

// === Sorter A–Å ===
sortTitleBtn.addEventListener("click", () => {
  sortAlphabetically = !sortAlphabetically;
  sortTitleBtn.textContent = sortAlphabetically ? "Sorter Å–A" : "Sorter A–Å";
  renderBooks();
});

// === Init ===
renderBooks();
