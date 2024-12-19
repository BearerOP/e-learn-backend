# GyanSagar

GyanSagar is a course-selling web platform where users can browse and purchase educational courses, managed and operated by an admin. It provides a robust interface for users to buy courses and for the admin to manage course listings and user activities.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features
- Users can browse and purchase courses.
- Admin can manage course listings, user roles, and view sales reports.
- Passwords are securely hashed using `bcrypt`.
- JWT-based authentication for secure user sessions.
- MongoDB as the primary database for storing users, courses, and transactions.

## Tech Stack
- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for handling HTTP requests and routing.
- **MongoDB & Mongoose**: NoSQL database and ODM for managing data.
- **bcrypt**: Password hashing for secure user authentication.
- **JWT (jsonwebtoken)**: For handling user authentication via tokens.
- **Nodemon**: Development tool for automatic server restarts on file changes.
- **dotenv**: For managing environment variables.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/BearerOP/gyansagar-backend.git
   cd gyan-sagar
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root of your project and add the following environment variables:

   ```bash
   touch .env
   ```

   Sample content for the `.env` file:

   ```bash
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:

   ```bash
   npm start
   ```

   The server will start and can be accessed at `http://localhost:5000`.

## Scripts

- **start**: This will run the project using `nodemon` to automatically restart the server when file changes are detected.

   ```bash
   npm start
   ```

   Nodemon will watch the project for changes, making development easier.

## Environment Variables

The application relies on a few key environment variables, which should be added to a `.env` file:

- **PORT**: The port on which the server will run (e.g., 5000).
- **MONGO_URI**: Your MongoDB connection URI.
- **JWT_SECRET**: The secret key for signing JSON Web Tokens (JWT).

Example `.env` file:

```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/gyansagar
JWT_SECRET=mysecretkey
```

## Usage

1. **User Features**:
   - Users can register and log in.
   - Browse available courses.
   - Purchase courses via secure payment methods.
   - Leave reviews and feedback for purchased courses.

2. **Admin Features**:
   - Manage the course catalog (add, edit, remove courses).
   - Manage users (view, edit, remove users).
   - Access sales and performance reports.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a Pull Request.

## License

This project is licensed under the **ISC License**.