\# SplitPay — Smart Group Payment Settlement



> Split expenses. Minimize transactions. Settle smarter.



SplitPay is a full-stack web application for managing shared group expenses.



It allows users to create groups, add members, record expenses, calculate each member's balance, and generate an optimized settlement plan with fewer transactions.



\## Features



\- Create and manage groups

\- Add members to groups

\- Add shared expenses

\- Automatically split expenses equally

\- View group expenses and total spending

\- Calculate member balances

\- Identify who needs to pay and who should receive

\- Generate an optimized settlement plan

\- Record completed settlement payments

\- Store groups, expenses, and payments in MongoDB

\- Delete groups along with their related data

\- Show payment status after completion

\- Show when all group settlements are completed



\## How It Works



SplitPay follows this flow:



Create Group

→ Add Members

→ Add Expenses

→ Calculate Balances

→ Find Debtors and Creditors

→ Minimize Transactions

→ Confirm Payment

→ Save Payment

→ All Settled



\## Smart Settlement Algorithm



The main feature of SplitPay is its Smart Settlement Algorithm.



For each expense:



1\. The person who paid the expense gets credit for the amount paid.

2\. Each member is charged for their share.

3\. A net balance is calculated for every member.

4\. Members with negative balances need to pay.

5\. Members with positive balances should receive money.

6\. Debtors are matched with creditors.

7\. The system generates a simplified settlement plan.



\### Example



Suppose:



Arjun paid ₹3000



Raju owes ₹1500



Madhuri owes ₹1500



SplitPay generates:



Raju → Arjun ₹1500



Madhuri → Arjun ₹1500



Only 2 transactions are required.



\## Technologies Used



\### Frontend



\- React

\- Vite

\- React Router

\- Tailwind CSS

\- JavaScript



\### Backend



\- Node.js

\- Express.js

\- REST APIs

\- JavaScript



\### Database



\- MongoDB Atlas

\- Mongoose



\### Tools



\- VS Code

\- Postman

\- Git

\- GitHub



\## Project Structure



SplitPay/

│

├── client/

│   ├── src/

│   │   ├── components/

│   │   │   └── Navbar.jsx

│   │   ├── pages/

│   │   │   ├── Home.jsx

│   │   │   ├── CreateGroup.jsx

│   │   │   ├── Groups.jsx

│   │   │   ├── GroupDetails.jsx

│   │   │   ├── AddExpense.jsx

│   │   │   └── Settlement.jsx

│   │   ├── App.jsx

│   │   └── main.jsx

│   └── package.json

│

├── server/

│   ├── models/

│   │   ├── Group.js

│   │   ├── ExpenseTemp.js

│   │   └── Payment.js

│   ├── routes/

│   │   ├── groupRoutes.js

│   │   ├── expenseRoutes.js

│   │   └── PaymentRoutes.js

│   ├── server.js

│   └── package.json

│

├── .gitignore

└── README.md



\## Application Pages



\### Home



Introduction to SplitPay with options to create or view groups.



\### Create Group



Create a new group and add initial members.



\### Groups



View all created groups along with member and expense information.



\### Group Details



Manage members, view expenses, see total spending, and access settlement details.



\### Add Expense



Add an expense, select who paid, and automatically calculate each member's share.



\### Smart Settlement



View:



\- Total expenses

\- Number of members

\- Average share

\- Member balances

\- Required transactions

\- Settlement plan

\- Payment status



\## Payment Flow



SplitPay currently uses a simulated payment flow for project demonstration.



The flow is:



Pay

→ Confirm Payment

→ Payment Successful

→ Payment Saved in MongoDB

→ Paid ✓



The payment status remains available after refreshing the page.



No real money is transferred in the current implementation.



\## REST API



\### Groups



GET /api/groups



GET /api/groups/:id



POST /api/groups



POST /api/groups/:id/members



DELETE /api/groups/:id



\### Expenses



POST /api/expenses



GET /api/expenses/group/:groupId



GET /api/expenses/settlement/:groupId



\### Payments



POST /api/payments



GET /api/payments/group/:groupId



\## Database Models



\### Group



Stores:



\- Group name

\- Members

\- Created date

\- Updated date



\### Expense



Stores:



\- Group ID

\- Description

\- Amount

\- Paid by

\- Member shares

\- Created date



\### Payment



Stores:



\- Group ID

\- Payer

\- Receiver

\- Amount

\- Payment status

\- Payment date

\- Created date

\- Updated date



\## Installation and Setup



\### 1. Clone the repository



git clone https://github.com/Madhuri1313/SplitPay.git



cd SplitPay



\### 2. Install frontend dependencies



cd client



npm install



\### 3. Start the frontend



npm run dev



Frontend:



http://localhost:5173



\### 4. Install backend dependencies



Open another terminal:



cd server



npm install



\### 5. Configure environment variables



Create a `.env` file inside the `server` folder.



Add:



MONGODB\_URI=your\_mongodb\_connection\_string



Do not upload `.env` to GitHub.



\### 6. Start the backend



node server.js



Backend:



http://localhost:5000



\## Security



Sensitive information such as database connection strings and secret keys should be stored in environment variables.



The `.gitignore` file prevents `.env` from being committed to GitHub.



Never expose secret keys in source code or public repositories.



\## What This Project Demonstrates



SplitPay demonstrates practical experience with:



\- Full-stack web development

\- React development

\- REST API development

\- Express.js

\- MongoDB and Mongoose

\- CRUD operations

\- React state management

\- Client-side routing

\- Asynchronous API requests

\- Algorithmic problem solving

\- Payment state management

\- Git and GitHub



\## Learning Outcomes



Through this project, I gained hands-on experience in:



\- Connecting React with an Express backend

\- Designing REST APIs

\- Working with MongoDB

\- Managing application state

\- Handling asynchronous operations

\- Building a settlement algorithm

\- Persisting application data

\- Tracking payment status

\- Debugging full-stack applications

\- Using Git and GitHub



\## Future Improvements



\- User authentication

\- User profiles

\- Group invitations

\- Custom expense splitting

\- Expense editing and deletion

\- Payment history

\- Payment reminders

\- Notifications

\- Real payment gateway test integration

\- Cloud deployment

\- Mobile application



\## Project Repository



GitHub:



https://github.com/Madhuri1313/SplitPay



\## Author



Madhuri Shankar



GitHub:



https://github.com/Madhuri1313



\## Project Highlight



SplitPay transforms complex group expense calculations into a simple and optimized settlement plan with fewer transactions.



> Split expenses. Minimize transactions. Settle smarter.

