
const API_URL = 'https://www.googleapis.com/books/v1/volumes?q=flowers+inauthor:keyes&key=AIzaSyAZegUXBwLYI8LNO4CAHeZ5cTyULc66XPE';

let page = 1;
let isLoading = false;

const bookList = document.getElementById('book-list');
const loadingMessage = document.getElementById('loading-message');

// Function to fetch books from the API
async function fetchBooks() {
  try {
    const response = await fetch(`${API_URL}?page=${page}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error fetching books:', error);
    return [];
  }
}


function renderBook(book) {
  const { title, authors, pageCount, imageLinks, previewLink } = book.volumeInfo;
  const bookRow = document.createElement('tr');

  const thumbnailCell = document.createElement('td');
  const thumbnailElement = document.createElement('img');
  thumbnailElement.src = imageLinks.thumbnail;
  thumbnailElement.alt = title;
  thumbnailElement.classList.add('book-thumbnail');
  thumbnailCell.appendChild(thumbnailElement);

  const titleCell = document.createElement('td');
  titleCell.textContent = title;

  const authorCell = document.createElement('td');
  authorCell.textContent = authors.join(', ');

  const pageCountCell = document.createElement('td');
  pageCountCell.textContent = pageCount;

  const previewLinkCell = document.createElement('td');
  const previewLinkAnchor = document.createElement('a');
  previewLinkAnchor.href = previewLink;
  previewLinkAnchor.textContent = 'Preview';
  previewLinkAnchor.target = '_blank';
  previewLinkCell.appendChild(previewLinkAnchor);

  bookRow.appendChild(thumbnailCell);
  bookRow.appendChild(titleCell);
  bookRow.appendChild(authorCell);
  bookRow.appendChild(pageCountCell);
  bookRow.appendChild(previewLinkCell);

  bookList.appendChild(bookRow);
}


// Function to handle lazy loading and infinite scrolling
function handleLazyLoad() {
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 10 && !isLoading) {
    isLoading = true;
    loadingMessage.style.display = 'block';

    fetchBooks()
      .then((books) => {
        if (Array.isArray(books)) {
          books.forEach((book) => {
            renderBook(book);
          });
        } else {
          console.log('Error: Invalid book data');
        }

        page++;
        isLoading = false;
        loadingMessage.style.display = 'none';
      })
      .catch((error) => {
        console.log('Error loading books:', error);
        isLoading = false;
        loadingMessage.style.display = 'none';
      });
  }
}


// Event listener for scroll event
window.addEventListener('scroll', handleLazyLoad);

// Initial load of books
handleLazyLoad();
