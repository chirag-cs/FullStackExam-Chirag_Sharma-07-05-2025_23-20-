E-Commerce Full-Stack Application

This is a full-stack e-commerce web application, built using Node.js and Express for the backend, and Next.js for the frontend. The app includes user authentication, product catalog, shopping cart functionality, and order management.

Installation Steps
1. Clone the repository

git clone https://github.com/yourusername/FullStackExam<yourname><dateofsubmission>.git
cd FullStackExam-Chirag_Sharma-07-05-2025_23-20-

2. Install Dependencies
Install dependencies for both the frontend and the backend:

Install backend dependencies (in the root directory):


npm install
Install frontend dependencies (inside the frontend directory):

cd frontend
npm install
cd ..


3. Environment Variables
Create a .env file in the root directory of the project and include the following environment variables:

PORT=5000
MONGO_URI=mongodb+srv://cs04631:PuhZ2xcXymZtWpWx@cluster01.pcrid8l.mongodb.net/?retryWrites=true&w=majority&appName=cluster01
SQL_DB=ecommerce_db
SQL_USER=chirag
SQL_PASSWORD=tanuman
SQL_HOST=localhost
JWT_SECRET=supersecretkey


Database Setup
The application uses both MongoDB and SQL (MySQL).

1. SQL Database Setup (MySQL)
Set up the MySQL database and create a database called ecommerce_db.

Apply the following SQL schema for the required tables:


CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

MongoDB tables will be automatically created upon insertion of records.


RUN THE BACKEND : npm run dev
RUN THE FRONTEND : cd frontend npm run dev

Folder Structure Backend : 

Main file : server.ts
Routes Folder : Contains routes for Auth, Cart, Orders, Products and Reports
Models Folder: Contains SQL and MongoDB models and schema.
Middleware Folder: Cointains middleware for authentication
Controller Folder : Contains Controller functions for the respective routes.

Folder Structure Frontend : 
cd src

Context Folder : Contains AuthContext
Pages Folder : Contains all the pages required for displaying data and operating backend routes.

