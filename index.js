class User {
  constructor(name) {
    this.borrowedBooks = new Set();
    this.name = name;
  }
  getUserName() {
    return this.name;
  }
  getBook(bookName) {
    for (let book of this.borrowedBooks) {
      if (book.getBookName() === bookName) {
        return book;
      }
    }
  }
  getBorrowedBooks() {
    return this.borrowedBooks;
  }
  hasBook(book) {
    return this.borrowedBooks.has(book);
  }
  addToBorrowedBooks(book) {
    // Since it's a set, it should be unique yeah?
    this.borrowedBooks.add(book);
    return;
  }
  removeBook(book) {
    this.borrowedBooks.delete(book);
    return;
  }
}
class Book {
  constructor(name, author, isAvailable, bookCount) {
    this.name = name;
    this.author = author;
    this.isAvailable = isAvailable;
    this.bookCount = bookCount;
  }
  getBookName() {
    return this.name;
  }
  getBookAuthor() {
    return this.author;
  }
  checkBookAvailability() {
    if (this.bookCount === 0) {
      this.isAvailable = false;
      return false;
    }
    return true;
  }
  borrow() {
    if (this.bookCount > 0) {
      this.bookCount--;
      this.isAvailable = this.bookCount > 0;
    }
  }
  returnBook() {
    this.isAvailable = true;
    this.bookCount++;
  }
}
class LMS {
  constructor() {
    this.books = [];
    this.users = [];

    this.booksToAdd = [
      {
        name: "To Kill a Mockingbird",
        author: "Harper Lee",
        isAvailable: true,
        bookCount: 3,
      },
      { name: "1984", author: "George Orwell", isAvailable: false },
      {
        name: "Pride and Prejudice",
        author: "Jane Austen",
        isAvailable: true,
      },
      {
        name: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        isAvailable: false,
        bookCount: 0,
      },
      {
        name: "Harry Potter and the Philosopher's Stone",
        author: "J.K. Rowling",
        isAvailable: true,
        bookCount: 5,
      },
      {
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        isAvailable: true,
      },
    ];

    this.initElements();
    this.bindEvents();
    this.addToBooks();
    this.displayBooks();
  }

  initElements() {
    this.tabContents = document.querySelectorAll(".tab-content");
    this.tabButtons = document.querySelectorAll(".tab-button");
    this.booksGrid = document.getElementById("booksGrid");
    this.searchTerm = document.getElementById("searchBooks");
    this.bookForm = document.getElementById("addBookForm");
    this.addUserButton = document.getElementById("addMemberForm");
    this.searchBookBtn = document.getElementById("searchBooks");
  }

  bindEvents() {
    // Add new book
    document.getElementById("books").addEventListener("click", () => this.showTab("books"));
    document.getElementById("tab-add-book").addEventListener("click", () => this.showTab("add-book"));
    document.getElementById("tab-add-user").addEventListener("click", () => this.showTab("add-user"));
    document.getElementById("tab-my-books").addEventListener("click", () => this.showTab("my-books"));

    this.bookForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const title = document.getElementById("bookTitle").value;
      const author = document.getElementById("bookAuthor").value;

      const newBook = {
        id: nextBookId++,
        title: title,
        author: author,
        available: true,
      };

      books.push(newBook);

      showMessage("addBookMessage", "Book added successfully!", "success");

      // Clear form
      document.getElementById("addBookForm").reset();

      // Refresh books display if on books tab
      if (document.getElementById("books").classList.contains("active")) {
        displayBooks();
      }
    });
    this.addUserButton.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("memberName").value;
      const email = document.getElementById("memberEmail").value;
      const phone = document.getElementById("memberPhone").value;

      const newMember = {
        id: nextMemberId++,
        name: name,
        email: email,
        phone: phone,
      };

      members.push(newMember);

      showMessage("addMemberMessage", "Member added successfully!", "success");

      // Clear form
      this.addUserButton.reset();
    });
    this.searchBookBtn.addEventListener("keypress", function (e) {
      // Search on enter key
      if (e.key === "Enter") {
        searchBooks();
      }
    });
  }

  addToBooks() {
    this.booksToAdd.forEach((book) =>
      this.addBook(book.name, book.author, book.isAvailable, book.bookCount)
    );
  }

  showTab(tabName = "books") {
    // Hide all tabs
    this.tabContents.forEach((tab) => {
      tab.classList.remove("active");
    });

    // Remove active class from all buttons
    this.tabButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    // Show selected tab
    document.getElementById(tabName).classList.add("active");

    // Add active class to clicked button
    event.target.classList.add("active");

    // Refresh content based on tab
    if (tabName === "books") {
      this.displayBooks();
    } else if (tabName === "my-books") {
      this.displayBorrowedBooks();
    }
  }

  displayBooks(books = this.books) {
    this.booksGrid.innerHTML = "";

    books.forEach((book) => {
      const bookCard = document.createElement("div");
      bookCard.className = "book-card";
      bookCard.innerHTML = `
                      <div class="book-title">${book.name}</div>
                      <div class="book-author">by ${book.author}</div>
                      <div class="book-status ${
                        book.available ? "status-available" : "status-borrowed"
                      }">
                          ${book.available ? "Available" : "Borrowed"}
                      </div>
                      <div>
                          ${
                            book.available
                              ? `<button class="btn btn-primary" onclick="borrowBook(${book.id})">Borrow</button>`
                              : `<button class="btn btn-warning" disabled>Not Available</button>`
                          }
                          <button class="btn btn-danger" onclick="removeBook(${
                            book.id
                          })">Remove</button>
                      </div>
                  `;
      booksGrid.appendChild(bookCard);
    });
  }

  searchBooks() {
    const searchTerm = this.searchTerm.value.toLowerCase();
    const filteredBooks = books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm)
    );
    this.displayBooks(filteredBooks);
  }

  getBook(bookName) {
    return this.books.find((bk) => bk.getBookName() === bookName);
  }
  getUser(userName) {
    return this.users.find((user) => user.getUserName() === userName);
  }
  addBook(name, author, isAvailable = true, bookCount = 2) {
    // if (!name.trim()) return;
    const book = new Book(name, author, isAvailable, bookCount);
    // Check if book exists on books
    const bookExists = this.books.find(
      (bk) => bk.getBookName() === book.getBookName()
    );
    if (!bookExists) {
      this.books.push(book);
    }
  }
  addUser(userName) {
    if (!userName.trim()) return;
    if (!this.getUser(userName)) {
      this.users.push(new User(userName));
    }
  }
  borrowBook(bookName, userName) {
    const book = this.getBook(bookName);
    const user = this.getUser(userName);
    // First check if book is available and if user has not already borrowed the book
    if (
      (book === null || book === void 0
        ? void 0
        : book.checkBookAvailability()) &&
      user &&
      !user.hasBook(book)
    ) {
      // If available and user hasn't, subtract one from book count and add to list of borrowed books from user
      book.borrow();
      user.addToBorrowedBooks(book);
    }
  }
  getUserBorrowedBooks(userName) {
    var _a;
    const user = this.getUser(userName);
    return (_a =
      user === null || user === void 0 ? void 0 : user.getBorrowedBooks()) !==
      null && _a !== void 0
      ? _a
      : new Set();
  }
  returnBook(bookName, userName) {
    // Check if book and user exists
    const book = this.getBook(bookName);
    const user = this.getUser(userName);
    if (!book || !user) return;
    // // remove from book
    book.returnBook();
    // // remove from user
    user.removeBook(book);
  }
  removeUser(name) {
    // Check if user exists
    const user = this.getUser(name);
    if (!user) return;
    // Get and remove all the books user has borrowed;
    const borrowedBooks = user.getBorrowedBooks();
    borrowedBooks.forEach((book) => this.returnBook(book.getBookName(), name));
    // Then delete user
    this.users = this.users.filter(
      (currentUser) => currentUser.getUserName() !== name
    );
  }
  removeBook(bookName) {
    this.books = this.books.filter((book) => book.getBookName() !== bookName);
  }
  searchBook(bookName) {
    return this.books.filter((book) => book.getBookName() === bookName);
  }
  showMessage(elementId, message, type) {
    const messageDiv = document.getElementById(elementId);
    messageDiv.innerHTML = `<div class="message ${type}">${message}</div>`;

    // Clear message after 3 seconds
    setTimeout(() => {
      messageDiv.innerHTML = "";
    }, 3000);
  }
}

new LMS();

//  ====================================================================//
class LMSS {
  constructor() {
    this.books = [
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        available: true,
      },
      { id: 2, title: "1984", author: "George Orwell", available: false },
      {
        id: 3,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        available: true,
      },
      {
        id: 4,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        available: false,
      },
      {
        id: 5,
        title: "Harry Potter and the Philosopher's Stone",
        author: "J.K. Rowling",
        available: true,
      },
      {
        id: 6,
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        available: true,
      },
    ];
    this.initElements();
    this.bindEvents();
    this.displayBooks();
  }

  clearSearch() {
    this.searchTerm.value = "";
    this.displayBooks();
  }

  // borrowBook(bookId) {
  //   const book = books.find((b) => b.id === bookId);
  //   if (book && book.available) {
  //     book.available = false;
  //     borrowedBooks.push({
  //       id: book.id,
  //       title: book.title,
  //       author: book.author,
  //       borrowedBy: currentUser.id,
  //     });
  //     displayBooks();
  //     displayBorrowedBooks();
  //   }
  // }

  // removeBook(bookId) {
  //   if (confirm("Are you sure you want to remove this book?")) {
  //     books = books.filter((book) => book.id !== bookId);
  //     borrowedBooks = borrowedBooks.filter((book) => book.id !== bookId);
  //     displayBooks();
  //     displayBorrowedBooks();
  //   }
  // }
}

// Sample data storage
// let books = [
//   {
//     id: 1,
//     title: "To Kill a Mockingbird",
//     author: "Harper Lee",
//     available: true,
//   },
//   { id: 2, title: "1984", author: "George Orwell", available: false },
//   {
//     id: 3,
//     title: "Pride and Prejudice",
//     author: "Jane Austen",
//     available: true,
//   },
//   {
//     id: 4,
//     title: "The Great Gatsby",
//     author: "F. Scott Fitzgerald",
//     available: false,
//   },
//   {
//     id: 5,
//     title: "Harry Potter and the Philosopher's Stone",
//     author: "J.K. Rowling",
//     available: true,
//   },
//   {
//     id: 6,
//     title: "The Catcher in the Rye",
//     author: "J.D. Salinger",
//     available: true,
//   },
// ];

let members = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "123-456-7890" },
];

let borrowedBooks = [
  { id: 2, title: "1984", author: "George Orwell", borrowedBy: 1 },
  {
    id: 4,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    borrowedBy: 1,
  },
];

let currentUser = members[0];
let nextBookId = 7;
let nextMemberId = 2;

// Tab functionality

// Display all books

// Search books

// Clear search

// Remove book

// Borrow book

// Return book
function returnBook(bookId) {
  const book = books.find((b) => b.id === bookId);
  if (book) {
    book.available = true;
    borrowedBooks = borrowedBooks.filter((b) => b.id !== bookId);
    displayBooks();
    displayBorrowedBooks();
    showMessage(
      "borrowedBooksMessage",
      "Book returned successfully!",
      "success"
    );
  }
}

// Display borrowed books
function displayBorrowedBooks() {
  const borrowedList = document.getElementById("borrowedBooksList");
  const userBorrowedBooks = borrowedBooks.filter(
    (book) => book.borrowedBy === currentUser.id
  );

  borrowedList.innerHTML = "";

  if (userBorrowedBooks.length === 0) {
    borrowedList.innerHTML =
      '<p style="text-align: center; color: #7f8c8d; font-style: italic;">No books currently borrowed.</p>';
    return;
  }

  userBorrowedBooks.forEach((book) => {
    const borrowedItem = document.createElement("div");
    borrowedItem.className = "borrowed-item";
    borrowedItem.innerHTML = `
                    <div class="borrowed-info">
                        <div class="borrowed-title">${book.title}</div>
                        <div class="borrowed-author">by ${book.author}</div>
                    </div>
                    <button class="btn btn-success" onclick="returnBook(${book.id})">Return Book</button>
                `;
    borrowedList.appendChild(borrowedItem);
  });
}

// Show message

// Initialize the application
// document.addEventListener("DOMContentLoaded", function () {
//   displayBooks();
//   displayBorrowedBooks();
//   document.getElementById("currentUserName").textContent = currentUser.name;
// });
