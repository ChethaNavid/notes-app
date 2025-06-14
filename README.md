# notes-app

A full-stack Notes application that allows users to sign up, login, create, update, delete, and search notes with tags. Built with **React**, **Node.js**, **Express**, and **PostgreSQL**.

---

## Features

- JWT-based user authentication
- Create, edit, and delete personal notes
- Add tags to notes with `#` display
- Pin and unpin notes
- Search notes by keywords
- View profile info and logout
- Secure API with PostgreSQL database

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

## 📥 Installation & Setup
### Prerequisites

Ensure you have the following installed:
- **Node.js** (Latest version)
- **Git** (For version control)

### Steps to Run Locally

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

**Create a new database in MySQL**
```sql
CREATE DATABASE notes_app_db;
use notes_app_db;
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
   is_pinned BOOLEAN DEFAULT FALSE,
   user_id INT NOT NULL,
   created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```
**Create a .env with:**
```ini
ACCESS_TOKEN_SECRET=your_jwt_secret
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=_notes_app_db
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

## 🛠️ Technologies Used
- **Frontend:** React.js (for dynamic UI)
- **API:** OpenWeatherMap API (for weather data)
- **Deployment:** Netlify ([Visit our Weather App](https://weather-app-cadt-sn.netlify.app/))
- **Version Control:** Git & GitHub

---

## 📥 Installation & Setup
### Prerequisites
Ensure you have the following installed:
- **Node.js** (Latest version)
- **Git** (For version control)

### Steps to Run Locally
1. **Clone the repository**
   ```bash
   git clone https://github.com/Samnang-Vouen/weather-app.git
   cd weatherapp
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Run the application**
   ```bash
   npm run dev
   ```
---

## 📌 Usage Guide
- Enter a city name in the search bar and press enter to get the weather details.
- Click on the "Current Location" button to fetch weather data based on your location.
- View temperature, humidity, wind speed, and general weather conditions.

---

## 💡 Future Improvements
 - 🌦 **7-Day Weather Forecast**: Adding weekly weather predictions.
 - 🔔 **Weather Alerts**: Notifications for severe weather conditions.
 - 🏙 **Multiple Cities Support**: Ability to save and track weather for multiple locations.
 - 📱 **Mobile App Version**: Developing a native app for better mobile experience.

---

## 🤝 Contributing
Contributions are welcome! To contribute:
1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature-name`)
3. **Commit your changes** (`git commit -m 'Add feature'`)
4. **Push to GitHub** (`git push origin feature-name`)
5. **Create a Pull Request**

---

## 📜 License
This project is licensed under the [MIT License](LICENSE).

---

## 💬 Contact
For questions or collaboration, reach out to:
- **Developer:** Vouen Samnang, Chetha Navid
- **Email:** samnang.vouen@student.cadt.edu.kh, navid.chetha@student.cadt.edu.kh
- **GitHub:** [github.com/ChethaNavid](https://github.com/ChethaNavid), [github.com/Samnang-Vouen](https://github.com/Samnang-Vouen)

---

##  Support
If you like this project, please ⭐ star the repository to support future development!

