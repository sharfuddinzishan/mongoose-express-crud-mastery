# Project Name

Mongoose Express CRUD Mastery.

## Live Link

[CRUD Mastery API](https://crud.sharfuddin.com.bd)

[VERCEL](https://crud-xi-coral.vercel.app)

## Built With

- **Express:** Web framework for Node.js
- **Mongoose:** MongoDB object modeling tool
- **bcrypt:** Password hashing library
- **Cors:** Cross-Origin Resource Sharing middleware
- **Validator:** Input validation library
- **Zod:** Type-safe schema declaration for JavaScript
- **TypeScript:** A superset of JavaScript that adds static typing to the language

## Getting Started

These instructions are given to set up and run the project on local machine.

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)

### Installing

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/your-username/your-repo.git
   ```

2. Create a .env file in the project's root folder with the following content:

   ```bash
   PORT=your_preferred_port
   DATABASE_URL=your_mongodb_cluster_address
   SALT_ROUNDS=your_bcrypt_salt_rounds
   ```

3. Install Node and Dependencies
   ```bash
   npm install
   ```
4. Run Server in Development by following command
   ```bash
   npm run start:dev
   ```
5. Check API on Browser. Open broweser and navigate to [http://localhost:your_preferred_port/api/users](http://localhost:your_preferred_port/api/users). If the API is set up correctly, then response displayed.

# API Testing

## Input Requirements For This Project

### Orders

- Orders can be empty.
- If orders are present:
  - `productName` should be a string with a minimum length of 2 characters.
  - `price` should be a positive number and not zero or less.

### Address

- Address is optional.
- If an address is provided:
  - `street`, `city`, and `country` should be strings, and each should have a length greater than 1.

### FullName

- `firstName` and `lastName` are required.
- `firstName` should be a string with a minimum length of 2 and a maximum length of 50 characters.
- `lastName` should be a string with a minimum length of 2 and a maximum length of 50 characters.

### User

- `userId` is optional but, if provided, should be a positive number.
- `username` is required and should be a string with a minimum length of 2 characters.
- `password` is required and should be a string with a minimum length of 3 characters, containing at least one letter.
- `age` is optional but, if provided, should be a positive number below 200.
- `hobbies` is optional but, if provided, should be a non-empty array with a maximum length of 10.
- `email` is required and should be a string with a minimum length of 6 characters, following a valid email format.
- `isActive` is a boolean and defaults to true.
- `address` follows the Address requirements.
- `orders` is optional but, if provided, should be an array following the Orders requirements.

# API Documentation

## Status Codes

### 404 Not Found - User Not Exist

- **Description:** Returned when the requested user is not found in the system.
- **Example Scenario:** Trying to retrieve information for a user that does not exist.

### 400 Bad Request - Wrong UserId Input

- **Description:** userId in the request is an unexpected format (For example, expected number instead of a string).
- **Example Scenario:** Attempting to update a user with an invalid userId format like '1'.

### 201 Created - Order Added Successfully

- **Description:** \New order has been successfully created.
- **Example Scenario:** Adding an order to a user.

### 400 Bad Request - Zod Validation Error

- **Description:** Find validation error in the client's request, based on Zod schema validation.
- **Example Scenario:** Providing invalid data that doesn't conform to the expected schema.

### 409 Conflict - Unique Constraint Conflict

- **Description:** Conflict of uniqueness in fields during user creation (For example, duplicate userId, email, or username).
- **Example Scenario:** Trying to create a user with a userId, email, or username that is already in used by another user.

---

# Developed By

[Sharfuddin Ahamed](https://sharfuddin.com.bd)

---
