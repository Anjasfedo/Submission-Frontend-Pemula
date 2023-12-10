// Array to store books
const Books = [];

// Array to be displayed, initially set to the full list of books
let showBooks = Books;

// Event constant for rendering books
const RENDER_EVENT = "render-book";

// Function to generate unique IDs based on the current timestamp
const genereteId = () => +new Date();

// Function to generate a book object
const generateBookObject = (id, title, author, year, isComplete) => {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
};

// Function to create a book element based on a book object
const makeBook = (bookObject) => {
  // Creating HTML elements for book details
  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = `Penulis: ${bookObject.author}`;

  const textYear = document.createElement("p");
  textYear.innerText = `Tahun: ${bookObject.year}`;

  // Creating button container
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("action");

  // Creating delete button
  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Hapus buku";
  deleteButton.classList.add("red");

  // Event listener for delete button
  deleteButton.addEventListener("click", () => {
    deleteHandler(bookObject.id);
  });

  // Creating buttons based on book completion status
  if (bookObject.isComplete) {
    const notCompleteButton = document.createElement("button");
    notCompleteButton.innerText = "Belum Selesai dibaca";
    notCompleteButton.classList.add("green");

    // Event listener for marking as unread button
    notCompleteButton.addEventListener("click", () => {
      toNotCompleteHandler(bookObject.id);
    });

    buttonContainer.append(notCompleteButton, deleteButton);
  } else {
    const completeButton = document.createElement("button");
    completeButton.innerText = "Selesai dibaca";
    completeButton.classList.add("green");

    // Event listener for marking as read button
    completeButton.addEventListener("click", () => {
      toCompleteHandler(bookObject.id);
    });

    buttonContainer.append(completeButton, deleteButton);
  }

  // Creating article container for the book
  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(textTitle, textAuthor, textYear, buttonContainer);
  container.setAttribute("id", `book-${bookObject.id}`);

  return container;
};

// Handler for marking a book as read
const toCompleteHandler = (bookID) => {
  const bookTargetIndex = showBooks.findIndex((book) => book.id === bookID);

  // Check if the book is found before updating isComplete property
  if (bookTargetIndex === -1)
    console.error(`Buku Dengan ID: ${bookID} Tidak Ditemukan.`);

  showBooks[bookTargetIndex].isComplete = true;

  // Trigger rendering event and save data
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

// Handler for deleting a book
const deleteHandler = (bookID) => {
  const bookTargetIndex = showBooks.findIndex((book) => book.id === bookID);

  // Check if the book is found before deleting
  if (bookTargetIndex === -1)
    console.error(`Buku Dengan ID: ${bookID} Tidak Ditemukan.`);

  showBooks.splice(bookTargetIndex, 1);

  // Trigger rendering event and save data
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

// Handler for marking a book as unread
const toNotCompleteHandler = (bookID) => {
  const bookTargetIndex = showBooks.findIndex((book) => book.id === bookID);

  // Check if the book is found before updating isComplete property
  if (bookTargetIndex === -1)
    console.error(`Buku Dengan ID: ${bookID} Tidak Ditemukan.`);

  showBooks[bookTargetIndex].isComplete = false;

  // Trigger rendering event and save data
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

// Event listener when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Event listener for book submission form
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addBook();
  });

  // Event listener for book search form
  const searchForm = document.getElementById("searchBook");
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    searchBookHandler();
  });

  // Load data from storage if it exists
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

// Function to add a book
const addBook = () => {
  // Retrieving input values
  const inputTitle = document.getElementById("inputBookTitle").value;
  const inputAuthor = document.getElementById("inputBookAuthor").value;
  const inputYear = document.getElementById("inputBookYear").value;
  const inputIsComplete = document.getElementById(
    "inputBookIsComplete"
  ).checked;

  // Generating unique book ID
  const bookID = genereteId();

  // Creating a book object
  const bookObject = generateBookObject(
    bookID,
    inputTitle,
    inputAuthor,
    inputYear,
    inputIsComplete
  );

  // Adding the book to the array
  showBooks.push(bookObject);

  // Trigger rendering event and save data
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

// Handler for book search
const searchBookHandler = () => {
  // Retrieving search input value
  const searchTitle = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();

  // Filtering books based on the search title
  const searchedBooks = Books.filter((book) =>
    book.title.toLowerCase().includes(searchTitle)
  );

  // Update showBooks with the search results
  showBooks = searchedBooks;

  // Trigger rendering event and save data
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

// Event listener for rendering books
document.addEventListener(RENDER_EVENT, () => {
  // Retrieving bookshelf containers
  const notCompleteBook = document.getElementById("incompleteBookshelfList");
  notCompleteBook.innerHTML = "";

  const completeBook = document.getElementById("completeBookshelfList");
  completeBook.innerHTML = "";

  // Loop through books and create book elements
  for (const data of showBooks) {
    const bookElement = makeBook(data);

    // Append book elements to the appropriate bookshelf container
    if (!data.isComplete) {
      notCompleteBook.append(bookElement);
    } else {
      completeBook.append(bookElement);
    }
  }
});

// Event constant for saving books to storage
const SAVE_EVENT = "save-book";

// Storage key constant
const STORAGE_KEY = "BOOK_SHELF";

// Function to check if localStorage is supported
const isStorageExist = () => {
  if (typeof Storage === undefined) {
    alert("Maaf Browser Anda Tidak Support locakStorage");
    return false;
  }

  return true;
};

// Function to save data to localStorage
const saveData = () => {
  if (isStorageExist()) {
    const parseJSON = JSON.stringify(Books);
    localStorage.setItem(STORAGE_KEY, parseJSON);

    // Trigger save event
    document.dispatchEvent(new Event(SAVE_EVENT));
  }
};

// Function to load data from localStorage
const loadDataFromStorage = () => {
  const booksData = localStorage.getItem(STORAGE_KEY);
  let dataJSON = JSON.parse(booksData);

  // If data exists, populate the Books array
  if (dataJSON !== null) {
    for (const book of dataJSON) {
      Books.push(book);
    }
  }

  // Trigger rendering event
  document.dispatchEvent(new Event(RENDER_EVENT));
};
