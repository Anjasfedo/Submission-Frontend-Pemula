const Books = [];

const RENDER_EVENT = "render-book";

const genereteId = () => +new Date();

const generateBookObject = (id, title, author, year, isComplete) => {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
};

const makeBook = (bookObject) => {
  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = `Penulis: ${bookObject.author}`;

  const textYear = document.createElement("p");
  textYear.innerText = `Tahun: ${bookObject.year}`;

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("action");

  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Hapus buku";
  deleteButton.classList.add("red");

  deleteButton.addEventListener("click", () => {
    deleteHandler(bookObject.id);
  });

  if (bookObject.isComplete) {
    const notCompleteButton = document.createElement("button");
    notCompleteButton.innerText = "Selesai dibaca";
    notCompleteButton.classList.add("green");

    notCompleteButton.addEventListener("click", () => {
      console.log("anjas");
      toNotCompleteHandler(bookObject.id);
    });

    buttonContainer.append(notCompleteButton, deleteButton);
  } else {
    const completeButton = document.createElement("button");
    completeButton.innerText = "Belum Selesai dibaca";
    completeButton.classList.add("green");

    completeButton.addEventListener("click", () => {
      toCompleteHandler(bookObject.id);
    });

    buttonContainer.append(completeButton, deleteButton);
  }

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(textTitle, textAuthor, textYear, buttonContainer);
  container.setAttribute("id", `book-${bookObject.id}`);

  return container;
};

const toCompleteHandler = (bookID) => {
  const bookTargetIndex = Books.findIndex((book) => book.id === bookID);

  if (bookTargetIndex === -1)
    console.error("Buku dengan ID", bookID, "tidak ditemukan.");

  Books[bookTargetIndex].isComplete = true;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const deleteHandler = (bookID) => {
  const bookTargetIndex = Books.findIndex((book) => book.id === bookID);

  if (bookTargetIndex === -1)
    console.error("Buku dengan ID", bookID, "tidak ditemukan.");

  Books.splice(bookTargetIndex, 1);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const toNotCompleteHandler = (bookID) => {
  const bookTargetIndex = Books.findIndex((book) => book.id === bookID);

  if (bookTargetIndex === -1)
    console.error("Buku dengan ID", bookID, "tidak ditemukan.");

  Books[bookTargetIndex].isComplete = false;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

document.addEventListener("DOMContentLoaded", () => {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

const addBook = () => {
  const inputTitle = document.getElementById("inputBookTitle").value;
  const inputAuthor = document.getElementById("inputBookAuthor").value;
  const inputYear = document.getElementById("inputBookYear").value;
  const inputIsComplete = document.getElementById(
    "inputBookIsComplete"
  ).checked;
  console.log(inputIsComplete);

  const bookID = genereteId();

  const bookObject = generateBookObject(
    bookID,
    inputTitle,
    inputAuthor,
    inputYear,
    inputIsComplete
  );

  Books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

document.addEventListener(RENDER_EVENT, () => {
  const notCompleteBook = document.getElementById("incompleteBookshelfList");
  notCompleteBook.innerHTML = "";

  const completeBook = document.getElementById("completeBookshelfList");
  completeBook.innerHTML = "";

  for (const data of Books) {
    const bookElement = makeBook(data);

    if (!data.isComplete) {
      notCompleteBook.append(bookElement);
    } else {
      completeBook.append(bookElement);
    }
  }
});

const SAVE_EVENT = "save-book";

const STORAGE_KEY = "BOOK_SHELF";

const isStorageExist = () => {
  if (typeof Storage === undefined) {
    alert("Your Browser Not Support localStorage");
    return false;
  }

  return true;
};

const saveData = () => {
  if (isStorageExist()) {
    const parseJSON = JSON.stringify(Books);
    localStorage.setItem(STORAGE_KEY, parseJSON);

    document.dispatchEvent(new Event(SAVE_EVENT));
  }

  document.addEventListener(SAVE_EVENT, () => {
    console.log(localStorage.getItem(STORAGE_KEY));
  });
};

const loadDataFromStorage = () => {
  const booksData = localStorage.getItem(STORAGE_KEY);
  let dataJSON = JSON.parse(booksData);

  if (dataJSON !== null) {
    for (const book of dataJSON) {
      Books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
};
