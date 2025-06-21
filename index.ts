class User {
  private name: string;
  private borrowedBooks: Set<Book> = new Set();
  constructor(name: string) {
    this.name = name;
  }

  getUserName(): string {
    return this.name;
  }
  getBook(bookName: string): Book | undefined {
    for (let book of this.borrowedBooks) {
      if (book.getBookName() === bookName) {
        return book;
      }
    }
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
  // Maybe use map for the books?
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

  getBook(bookName: string): Book | undefined {
    return this.books.find((bk) => bk.getBookName() === bookName);
  }
  getUser(userName: string): User | undefined {
    return this.users.find((user) => user.getUserName() === userName);
  }

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

  addUser(name: string): void {
    if (!this.userExists(name)) {
      this.users.push(new User(name));
    }
  }

  borrowBook(bookName: string, userName: string): void {
    const book = this.getBook(bookName);
    const user = this.getUser(userName);

    // First check if book is available and if user has not already borrowed the book
    if (book?.checkBookAvailability() && user && !user.hasBook(book)) {
      // If available and user hasn't, subtract one from book count and add to list of borrowed books from user
      book.borrow();
      user.addToBorrowedBooks(book);
    }
  }

  getUserBorrowedBooks(userName: string): Set<Book> | undefined {
    const user = this.getUser(userName);
    return user?.getBorrowedBooks();
  }

  returnBook(bookName: string, userName: string): void {
    // Check if book and user exists
    const book = this.bookExists(bookName);
    const user = this.userExists(userName);
    if (!book || !user) return;
    // // remove from book
    book.returnBook();
    // // remove from user
    user.removeBook(book);
  }

  bookExists(name: string): Book | undefined {
    return this.books.find((book) => book.getBookName() === name);
  }

  userExists(name: string): User | undefined {
    return this.users.find((currentUser) => currentUser.getUserName() === name);
  }

  removeUser(name: string): void {
    // Check if user exists
    const user = this.userExists(name);
    if (!user) return;
    // Get and remove all the books user has borrowed;
    const borrowedBooks = user.getBorrowedBooks();
    borrowedBooks.forEach((book) => this.returnBook(book.getBookName(), name));
    // Then delete user
    this.users = this.users.filter(
      (currentUser) => currentUser.getUserName() !== name
    );
  }

  removeBook(bookName: string) {
    this.books = this.books.filter((book) => book.getBookName() !== bookName);
  }

  searchBook(bookName: string): Book[] {
    return this.books.filter((book) => book.getBookName() === bookName);
  }
}

const lms = new LMS();

lms.addUser("Temiloluwa");
lms.addUser("Oreoluwa");

lms.addBook("Harry Porter", "JK Rowlings");
lms.addBook("Sweet 16", "Temi Dee");
lms.removeBook("Sweet 16");

lms.removeUser("Oreoluwa")

lms.borrowBook("Harry Porter", "Temiloluwa");
lms.returnBook("Harry Porter", "Temiloluwa");
// console.log(lms.getUserBorrowedBooks("Temiloluwa"));

console.log(lms);
