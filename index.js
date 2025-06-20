// Sample data storage
let books = [
  {
    id: 1,
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
function showTab(tabName) {
  // Hide all tabs
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active");
  });

  // Remove active class from all buttons
  document.querySelectorAll(".tab-button").forEach((btn) => {
    btn.classList.remove("active");
  });

  // Show selected tab
  document.getElementById(tabName).classList.add("active");

  // Add active class to clicked button
  event.target.classList.add("active");

  // Refresh content based on tab
  if (tabName === "books") {
    displayBooks();
  } else if (tabName === "my-books") {
    displayBorrowedBooks();
  }
}

// Display all books
function displayBooks(booksToShow = books) {
  const booksGrid = document.getElementById("booksGrid");
  booksGrid.innerHTML = "";

  booksToShow.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.className = "book-card";
    bookCard.innerHTML = `
                    <div class="book-title">${book.title}</div>
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

// Search books
function searchBooks() {
  const searchTerm = document.getElementById("searchBooks").value.toLowerCase();
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm)
  );
  displayBooks(filteredBooks);
}

// Clear search
function clearSearch() {
  document.getElementById("searchBooks").value = "";
  displayBooks();
}

// Add new book
document.getElementById("addBookForm").addEventListener("submit", function (e) {
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

// Remove book
function removeBook(bookId) {
  if (confirm("Are you sure you want to remove this book?")) {
    books = books.filter((book) => book.id !== bookId);
    borrowedBooks = borrowedBooks.filter((book) => book.id !== bookId);
    displayBooks();
    displayBorrowedBooks();
  }
}

// Borrow book
function borrowBook(bookId) {
  const book = books.find((b) => b.id === bookId);
  if (book && book.available) {
    book.available = false;
    borrowedBooks.push({
      id: book.id,
      title: book.title,
      author: book.author,
      borrowedBy: currentUser.id,
    });
    displayBooks();
    displayBorrowedBooks();
  }
}

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

// Add new member
document
  .getElementById("addMemberForm")
  .addEventListener("submit", function (e) {
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
    document.getElementById("addMemberForm").reset();
  });

// Show message
function showMessage(elementId, message, type) {
  const messageDiv = document.getElementById(elementId);
  messageDiv.innerHTML = `<div class="message ${type}">${message}</div>`;

  // Clear message after 3 seconds
  setTimeout(() => {
    messageDiv.innerHTML = "";
  }, 3000);
}

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  displayBooks();
  displayBorrowedBooks();
  document.getElementById("currentUserName").textContent = currentUser.name;
});

// Search on Enter key
document
  .getElementById("searchBooks")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      searchBooks();
    }
  });
