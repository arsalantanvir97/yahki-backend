# Yahki Backend

Welcome to the backend repository for our e-commerce platform. This Node.js project serves as the backend for our application, providing the necessary APIs for managing products, categories, orders, and more.

## Technologies Used

- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for Node.js, used for routing and middleware.
- **MongoDB**: NoSQL database used for storing product, user, order, and category data.
- **Stripe & PayPal**: Integrated payment merchants for processing payments securely.
- **JWT (JSON Web Tokens)**: Used for authentication and authorization.
- **Bcrypt**: Hashing library for securing user passwords.
- **Mongoose**: MongoDB object modeling for Node.js.
- **Other Dependencies**: Check `package.json` for a full list.

## Features

- **Product Management**:
  - CRUD operations for managing products.
- **Category Management**:
  - CRUD operations for managing categories.
- **User Authentication**:
  - Secure user authentication using JWT.
- **Order Management**:
  - Creation, tracking, and updating of orders.
- **Payment Integration**:
  - Integration with Stripe and PayPal for processing payments.
- **Admin Dashboard**:
  - Access to admin features such as managing products, categories, and orders.
- **Analytics**:
  - Ability to analyze sales data, including which state has the most products bought.

## Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/e-commerce-backend.git
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

4. **Run the server:**
    ```bash
    npm start
    ```

## Usage
Once the server is running, you can start making requests to the API endpoints using tools like Postman or integrating it with your frontend React application.
