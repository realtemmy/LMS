# 📚 Library Management System

A simple Library Management System built using JavaScript (ES6+) to demonstrate core **Object-Oriented Programming (OOP)** concepts in a browser-based environment.

---

## 🚀 Features

- Add, borrow, return, and remove books
- Track borrowed books by user
- Prevent borrowing of unavailable books
- Dynamic DOM updates
- Search books by title or author

---

## 🏗️ Technologies Used

- JavaScript (ES6 Classes)
- HTML, CSS
- DOM Manipulation

---

## 🧠 Object-Oriented Programming Concepts Used

This project is a practical implementation of major **OOP principles**, including:

---

### ✅ 1. **Encapsulation**

Encapsulation means bundling data and methods within a class, and restricting direct access to some components.

- **`Book` class**:
  - Encapsulates details like `name`, `author`, `bookCount`, and `isAvailable`.
  - Provides methods like `borrowBook()` and `returnBook()` to manage internal state securely.

- **`User` class**:
  - Stores the `name` and a set of `borrowedBooks`.
  - Uses methods like `borrowBook()`, `returnBook()`, and `hasBook()` to manage borrowing logic internally.

➡️ Internal states are not directly exposed. Other parts of the code interact via clearly defined interfaces.

---

### ✅ 2. **Abstraction**

Abstraction hides complex implementation and exposes only essential features.

- Users don’t need to understand how books are stored or how availability is checked. They just use:
  ```js
  user.borrowBook(book);
But each book's behavior depends on its availability and count.

### ✅ 3. Polymorphism
Polymorphism is the ability of different objects to respond to the same method in different ways.
- Every Book instance implements:
  ```js
  book.borrowBook();
  book.returnBook();
But each book's behavior depends on its availability and count.
➡️ The method name stays the same, but the underlying behavior differs.

### ✅ 4. Modularity & Separation of Concerns
Each class has a single, well-defined responsibility:
| Class  | Responsibility                                   |
| ------ | ------------------------------------------------ |
| `Book` | Manage individual book state and availability    |
| `User` | Manage books borrowed by a user                  |
| `LMS`  | Manage the UI, book collection, and interactions |
➡️ This separation keeps the code maintainable and scalable.

### ✅ 5. Composition Over Inheritance
Rather than using inheritance, the project uses composition:
- A User has a collection of Book instances.
- The LMS class composes User, Book, and the DOM together to handle system logic.

➡️ This encourages flexibility and easier extension.




