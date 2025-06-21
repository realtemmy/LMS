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
    this.user = null;

    this.booksToAdd = [
      {
        name: "To Kill a Mockingbird",
        author: "Harper Lee",
        isAvailable: true,
        bookCount: 1,
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
        name: "The Catcher in the Rye",
        author: "J.D. Salinger",
        isAvailable: true,
      },
    ];

    this.initElements();
    this.bindEvents();
    this.addToBooks();
    this.displayBooks();
    this.addUser("John Doe");
  }

  initElements() {
    this.tabContents = document.querySelectorAll(".tab-content");
    this.tabButtons = document.querySelectorAll(".tab-button");
    this.booksGrid = document.getElementById("booksGrid");
    this.searchTerm = document.getElementById("searchBooks");
    this.addUserButton = document.getElementById("addMemberForm");
    this.searchBookBtn = document.getElementById("searchBooks");
  }

  bindEvents() {
    // Add new book
    document
      .getElementById("tab-books")
      .addEventListener("click", () => this.showTab("books"));
    document
      .getElementById("tab-add-book")
      .addEventListener("click", () => this.showTab("add-book"));
    document
      .getElementById("tab-add-user")
      .addEventListener("click", () => this.showTab("add-user"));
    document
      .getElementById("tab-my-books")
      .addEventListener("click", () => this.showTab("my-books"));
    document
      .getElementById("searchBook")
      .addEventListener("click", () => this.searchBooks());

    document
      .getElementById("clearSearch")
      .addEventListener("click", () => this.displayBooks());

    document
      .getElementById("addBookForm")
      .addEventListener("submit", (event) => {
        event.preventDefault();
        let name = document.getElementById("bookName").value;
        let author = document.getElementById("bookAuthor").value;
        let bookCount = document.getElementById("bookCount").value;
        let isAvailable = true;

        this.addBook(name, author, isAvailable, bookCount);
        document.getElementById("addBookForm").reset();
      });
    this.searchTerm.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.searchBooks();
      }
    });
    this.addUserButton.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("memberName").value;
      this.addUser(name);

      this.showMessage(
        "addMemberMessage",
        "Member added successfully!",
        "success"
      );

      // Clear form
      this.addUserButton.reset();
    });
    this.searchBookBtn.addEventListener("keypress", function (e) {
      // Search on enter key
      if (e.key === "Enter") {
        this.searchBooks();
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

    // Refresh content based on tab
    if (tabName === "books") {
      this.displayBooks();
    } else if (tabName === "my-books") {
      document.getElementById(
        "currentUserName"
      ).textContent = `Current user: ${this.user.name}`;
      this.getUserBorrowedBooks();
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
                      <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div class="book-status ${
                          book.isAvailable
                            ? "status-available"
                            : "status-borrowed"
                        }">
                            ${book.isAvailable ? "Available" : "Borrowed"}
                        </div>
                        <div class="book-author">${
                          book.bookCount
                        } book left</div>
                      </div>
                      
                      <div>
                          ${
                            book.isAvailable
                              ? `<button class="btn btn-primary" id="borrow-btn" data-name="${book.getBookName()}">Borrow</button>`
                              : `<button class="btn btn-warning" disabled>Not Available</button>`
                          }
                          <button class="btn btn-danger" id="remove-btn" data-name="${book.getBookName()}">Remove</button>
                      </div>
                  `;
      booksGrid.appendChild(bookCard);
    });

    this.booksGrid.querySelectorAll("#borrow-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const bookName = e.target.getAttribute("data-name");
        if (!this.user)
          return this.showMessage(
            "notification",
            "Please select a user first!",
            "error"
          );

        this.borrowBook(bookName, this.user.name);

        this.displayBooks(); // Refresh UI
      });
    });

    this.booksGrid.querySelectorAll("#remove-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const bookName = e.target.getAttribute("data-name");
        this.removeBook(bookName);
        this.displayBooks();
        this.showMessage(
          "notification",
          "Book removed successfully!",
          "success"
        );
      });
    });
  }

  searchBooks() {
    const searchTerm = this.searchTerm.value.toLowerCase();
    const filteredBooks = this.books.filter(
      (book) =>
        book.name.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm)
    );
    this.displayBooks(filteredBooks);
  }

  getBook(bookName) {
    return this.books.find((bk) => bk.getBookName() === bookName);
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
      return this.showMessage(
        "addBookMessage",
        `${name} added successfully!`,
        "success"
      );
    }
    this.showMessage("notification", "Book already exist in Library", "error");
  }
  addUser(userName) {
    if (!userName.trim()) return;
    this.user = new User(userName);
  }
  borrowBook(bookName) {
    const book = this.getBook(bookName);
    const user = this.user;
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
      this.showMessage(
        "notification",
        `Book "${bookName}" borrowed successfully!`,
        "success"
      );
    } else {
      this.showMessage(
        "notification",
        `Book "${bookName}" is not available or already borrowed by you!`,
        "error"
      );
    }
  }
  getUserBorrowedBooks() {
    const user = this.user;

    const borrowedList = document.getElementById("borrowedBooksList");
    const borrowedBooks = Array.from(user.getBorrowedBooks());

    borrowedList.innerHTML = "";

    if (borrowedBooks.length === 0) {
      borrowedList.innerHTML =
        '<p style="text-align: center; color: #7f8c8d; font-style: italic;">No books currently borrowed.</p>';
      return;
    }

    borrowedBooks.forEach((book) => {
      const borrowedItem = document.createElement("div");
      borrowedItem.className = "borrowed-item";
      borrowedItem.innerHTML = `
                      <div class="borrowed-info">
                          <div class="borrowed-title">${book.name}</div>
                          <div class="borrowed-author">by ${book.author}</div>
                      </div>
                      <button class="btn btn-success" id="returnbook" data-name="${book.getBookName()}">Return Book</button>
                  `;
      borrowedList.appendChild(borrowedItem);
    });

    document.querySelectorAll("#returnbook").forEach((btn) => {
      btn.addEventListener("click", (event) => {
        const bookName = event.target.getAttribute("data-name");
        this.returnBook(bookName);
      });
    });
  }
  returnBook(bookName) {
    // Check if book and user exists
    const book = this.getBook(bookName);
    const user = this.user;
    if (!book || !user) return;
    // // remove from book
    book.returnBook();
    // // remove from user
    user.removeBook(book);
    this.showMessage(
      "borrowedBooksMessage",
      `${bookName} has been successfully returned`,
      "success"
    );

    this.getUserBorrowedBooks(); // To update borrowed books
  }
  removeUser(name) {
    // Check if user exists
    const user = this.user;
    if (!user) return;
    // Get and remove all the books user has borrowed;
    const borrowedBooks = user.getBorrowedBooks();
    borrowedBooks.forEach((book) => this.returnBook(book.getBookName(), name));
    // Then delete user
    this.user = null;
  }
  removeBook(bookName) {
    this.books = this.books.filter((book) => book.getBookName() !== bookName);
  }
  searchBook(bookName) {
    this.books = this.books.filter((book) => book.getBookName() === bookName);
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
