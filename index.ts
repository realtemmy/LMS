class User {
  private name: string;
  private borrowedBooks: Set<Book> = new Set();
  constructor(name: string) {
    this.name = name;
  }

  getUserName(): string {
    return this.name;
  }
  getBorrowedBooks(): Set<Book> {
    return this.borrowedBooks;
  }
  hasBook(book: Book): boolean {
    return this.borrowedBooks.has(book);
  }
  addToBorrowedBooks(book: Book): void {
    // Since it's a set, it should be unique yeah?
    this.borrowedBooks.add(book);
    return;
  }
  removeFromBorrowedBooks(book: Book) {
    this.borrowedBooks.delete(book);
    return;
  }

  removeBook(book: Book): void {
    this.borrowedBooks.delete(book);
    return;
  }
}

class Book {
  private name: string;
  private author: string;
  private isAvailable: boolean;
  private bookCount: number;
  constructor(
    name: string,
    author: string,
    isAvailable: boolean,
    bookCount: number
  ) {
    this.name = name;
    this.author = author;
    this.isAvailable = isAvailable;
    this.bookCount = bookCount;
  }

  getBookName(): string {
    return this.name;
  }
  getBookAuthor(): string {
    return this.author;
  }
  checkBookAvailability(): boolean {
    if (this.bookCount === 0) {
      this.isAvailable = false;
      return false;
    }
    return true;
  }
  borrow() {
    this.bookCount--;
    // maybe keep track of who it was borrowed to
  }
  returnBook() {
    this.isAvailable = true;
    this.bookCount++;
  }
}

class LMS {
  books: Book[] = [];
  users: User[] = [];

  addBook(
    name: string,
    author: string,
    isAvailable: boolean = true,
    bookCount: number = 2
  ): void {
    const book = new Book(name, author, isAvailable, bookCount);
    // Check if book exists on books
    const bookExists = this.books.find(
      (bk) => bk.getBookName() === book.getBookName()
    );
    if (!bookExists) {
      this.books.push(book);
    }
  }

  borrowBook(book: Book, user: User): void {
    // First check if book is available and if user has not already borrowed the book
    if (book.checkBookAvailability() && user.hasBook(book)) {
      // If available and user hasn't, subtract one from book count and add to list of borrowed books from user
      book.borrow();
      user.addToBorrowedBooks(book);
    }
  }

  returnBook(book: string, user: string): void {
    // // remove from book
    // book.returnBook();
    // // remove from user
    // user.removeBook(book);
  }

  userExists(name: string): User | undefined {
    const userExists = this.users.find(
      (currentUser) => currentUser.getUserName() === name
    );
    return userExists;
  }
  addUser(name: string): void {
    if (!this.userExists(name)) {
      this.users.push(new User(name));
    }
  }

  removeUser(name: string): void {
    // Check if user exists
    const user = this.userExists(name);
    if (!user) return;
    // Get and remove all the books user has borrowed;
    const borrowedBooks = user.getBorrowedBooks();
    borrowedBooks.forEach((book) => this.returnBook(book.getBookName(), name));
    // Then delete user;
  }
}

// library has users that allows borrowing and returning of books, a list of books, available or not
// Books has the name, author and availability of a book
// User has the details of a student: matric no and name, and the books borrowed by the user. basically user can borrow and return books
