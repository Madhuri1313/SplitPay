# 💸 SplitPay — Smart Group Payment Settlement

> **Split expenses. Minimize transactions. Pay instantly.**

SplitPay is a smart group expense management application that helps friends, students, roommates, and travel groups track shared expenses and settle their debts with the **minimum possible number of transactions**.

---

## 🚀 Features

### 👥 Group Management

* Create expense-sharing groups
* Add multiple members
* View all groups
* View individual group details

### 💰 Expense Management

* Add expenses to a group
* Record who paid
* Track how much each member owes
* Automatically calculate member balances

### 🧮 Smart Settlement

SplitPay calculates:

* Total amount spent
* Individual balances
* Who needs to pay
* Who needs to receive
* Optimized settlement transactions

The settlement algorithm matches **debtors with creditors** to reduce unnecessary transactions.

### 💳 Payment Integration

Razorpay integration is planned to allow users to settle their balances through online payments.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* JavaScript
* HTML
* CSS

### Backend

* Node.js
* Express.js
* REST APIs

### Database

* MongoDB
* MongoDB Atlas
* Mongoose

### Payment

* Razorpay

### Development Tools

* Visual Studio Code
* Postman
* Git
* GitHub

---

## 🏗️ Project Structure

```text
SplitPay/
│
├── server/
│   ├── models/
│   │   ├── Expense.js
│   │   ├── Group.js
│   │   └── ...
│   │
│   ├── routes/
│   │   ├── expenseRoutes.js
│   │   ├── groupRoutes.js
│   │   └── ...
│   │
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── src/
│   ├── components/
│   │   └── Navbar.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── CreateGroup.jsx
│   │   ├── Groups.jsx
│   │   ├── GroupDetails.jsx
│   │   ├── AddExpense.jsx
│   │   └── Settlement.jsx
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── public/
├── package.json
└── README.md
```

---

## 🔄 How SplitPay Works

```text
Create Group
     ↓
Add Members
     ↓
Add Expenses
     ↓
Calculate Individual Balances
     ↓
Identify Debtors & Creditors
     ↓
Optimize Settlement
     ↓
Make Payments
```

---

## 🧠 Smart Settlement Algorithm

Suppose three members have the following balances:

```text
Arjun    +₹3028.67
Raju     -₹1514.33
Madhuri  -₹1514.33
```

Here:

* Arjun needs to receive ₹3028.67
* Raju needs to pay ₹1514.33
* Madhuri needs to pay ₹1514.33

SplitPay automatically identifies these relationships and generates the required settlement transactions.

Instead of manually calculating who owes whom, the application performs the calculation automatically.

---

## 🌐 API Overview

### Group APIs

```text
POST   /api/groups
GET    /api/groups
GET    /api/groups/:id
POST   /api/groups/:id/members
```

### Expense APIs

```text
POST   /api/expenses
GET    /api/expenses/:groupId
```

### Settlement

```text
GET    /api/settlement/:groupId
```

> API endpoints may evolve as the project continues to be developed.

---

## 💻 Installation

### 1. Clone the repository

```bash
git clone https://github.com/Madhuri1313/SplitPay.git
```

### 2. Open the project

```bash
cd SplitPay
```

### 3. Install frontend dependencies

```bash
npm install
```

### 4. Install backend dependencies

```bash
cd server
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `server` folder.

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

Never upload your actual MongoDB credentials, passwords, API keys, or payment secrets to GitHub.

---

## ▶️ Running the Application

### Start Backend

From the `server` directory:

```bash
node server.js
```

The backend runs on:

```text
http://localhost:5000
```

### Start Frontend

Open another terminal:

```bash
cd C:\SplitPay
npm run dev
```

Then open the local Vite URL shown in the terminal.

---

## 🧪 API Testing

Postman can be used to test the backend APIs.

The main testing flow is:

```text
Create Group
     ↓
Add Members
     ↓
Add Expense
     ↓
Calculate Balances
     ↓
Generate Settlement
```

---

## 📱 Application Pages

SplitPay currently includes:

* 🏠 Home
* ➕ Create Group
* 👥 Groups
* 📋 Group Details
* 💵 Add Expense
* 🤝 Settlement

---

## 🎯 Use Cases

SplitPay can be useful for:

* 🏖️ Group trips
* 🏠 Roommates
* 🎓 College students
* 🍕 Friends sharing food bills
* 🎉 Events and parties
* 👨‍👩‍👧 Group activities
* 💼 Small team expenses

---

## 🔮 Future Enhancements

* [ ] Razorpay payment integration
* [ ] User authentication
* [ ] Individual user accounts
* [ ] Expense history
* [ ] Payment status tracking
* [ ] Transaction notifications
* [ ] Expense categories
* [ ] Dashboard with charts
* [ ] Mobile-responsive improvements
* [ ] Deployment
* [ ] Payment receipts
* [ ] Real-time settlement updates

---

## 🏆 Project Goal

The goal of SplitPay is to make group expense settlement:

**Simple → Smart → Fast → Transparent**

Instead of spending time manually calculating expenses, users can let SplitPay calculate and optimize the settlement automatically.

---

## 👩‍💻 Developer

**Madhuri Shankar**

GitHub:
https://github.com/Madhuri1313

Project Repository:
https://github.com/Madhuri1313/SplitPay

---

## 📄 License

This project is developed as an educational and buildathon project.

---

# ⭐ SplitPay

> **Split expenses. Minimize transactions. Pay instantly.**
