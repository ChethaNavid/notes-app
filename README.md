# notes-app

A full-stack Notes application that allows users to sign up, login, create, update, delete, and search notes with tags. Built with **React**, **Node.js**, **Express.js**, and **MySQL**.

---

## Features

- JWT-based user authentication
- Create, edit, and delete personal notes
- Add tags to notes with `#` display
- Pin and unpin notes
- Search notes by keywords
- Secure API with MySQL database

---

## Tech Stack

### Frontend:
- React.js
- React Router
- Axios
- TailwindCSS

### Backend:
- Node.js
- Express.js
- MySQL (mysql2)
- JWT (jsonwebtoken)

---

## Installation
### Prerequisites

Ensure you have the following installed:
- **Node.js** (Latest version)
- **Git** (For version control)

---

## Setup Project

**If you don't have MySQL, you need to install and configure MySQL server properly**
https://dev.mysql.com/doc/refman/8.4/en/windows-installation.html

**If you already have MySQL, run this command in terminal**
```bash
mysql -u root -p
```
**Create a new database in MySQL**
```sql
CREATE DATABASE notes_app;
use notes_app;
```
**Create table users**
```sql
CREATE TABLE users (
   id INT PRIMARY KEY AUTO_INCREMENT,
   full_name VARCHAR(50),
   email VARCHAR(100) unique,
   password VARCHAR(50),
   created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
**Create table notes**
```sql
CREATE TABLE notes (
   id INT AUTO_INCREMENT PRIMARY KEY,
   title VARCHAR(100) NOT NULL,
   content TEXT NOT NULL,
   tags JSON,
   is_pinned tinyint(1) DEFAULT 0,
   user_id INT NOT NULL,
   created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```
---

## Steps to Run Locally

**Clone the repository** 
```bash
git clone https://github.com/ChethaNavid/notes-app.git
cd notes-app
```
### Setup Frontend
**Install Dependencies**
```bash
cd frontend/notes-app
npm install
```
**Run the application**
```bash
npm run dev
```
### Setup Backend
**Create a .env with:**
```ini
ACCESS_TOKEN_SECRET=your_jwt_secret
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=your_db_password
DATABASE=notes_app
```
**Install Dependencies**
```bash
cd backend
npm install
```
**Run the application**
```bash
npm start
```
---

## Contributing
Contributions are welcome! To contribute:
1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature-name`)
3. **Commit your changes** (`git commit -m 'Add feature'`)
4. **Push to GitHub** (`git push origin feature-name`)
5. **Create a Pull Request**

---

## Contact
For questions or collaboration, reach out to:
- **Developer:** Chetha Navid
- **Email:** navid.chetha@student.cadt.edu.kh
- **GitHub:** [github.com/ChethaNavid](https://github.com/ChethaNavid)

---

## Support
If you like this project, please ⭐ star the repository to support future development!

