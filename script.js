const initialBooks = [
  { title: 'El principito', author: 'Antoine de Saint-Exupéry', year: 1943 },
  { title: '1984', author: 'George Orwell', year: 1949 },
  { title: 'Cien años de soledad', author: 'Gabriel García Márquez', year: 1967 }
];

let books = [...initialBooks];

const searchInput = document.getElementById('search');
const toggleFormButton = document.getElementById('toggleForm');
const bookForm = document.getElementById('bookForm');
const booksContainer = document.getElementById('books');

function renderBooks() {
  const query = searchInput.value.trim().toLowerCase();
  const visibleBooks = books.filter((book) => {
    const haystack = `${book.title} ${book.author}`.toLowerCase();
    return haystack.includes(query);
  });

  booksContainer.innerHTML = '';

  if (visibleBooks.length === 0) {
    booksContainer.innerHTML = '<p>No se encontraron libros.</p>';
    return;
  }

  visibleBooks.forEach((book) => {
    const card = document.createElement('article');
    card.className = 'book-card';
    card.innerHTML = `
      <h2>${book.title}</h2>
      <p>${book.author}</p>
      <p>${book.year}</p>
    `;
    booksContainer.appendChild(card);
  });
}

toggleFormButton.addEventListener('click', () => {
  bookForm.classList.toggle('hidden');
});

bookForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(bookForm);
  const newBook = {
    title: formData.get('title').toString().trim(),
    author: formData.get('author').toString().trim(),
    year: Number(formData.get('year') || 2024)
  };

  if (!newBook.title || !newBook.author) {
    return;
  }

  books = [newBook, ...books];
  bookForm.reset();
  bookForm.classList.add('hidden');
  renderBooks();
});

searchInput.addEventListener('input', renderBooks);

renderBooks();
