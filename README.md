# TOTP Authentication in MERN Stack

This repository contains a simple implementation of Time-based One-Time Password (TOTP) authentication in a MERN (MongoDB, Express, React, Node.js) stack application.

## Overview

Two-Factor Authentication (2FA) with TOTP adds an extra layer of security to your application by requiring users to provide a time-based code in addition to their username and password. This implementation uses the following technologies:

- **Backend**: Node.js with Express
- **Database**: MongoDB with Mongoose
- **Frontend**: React
- **Authentication**: JWT (JSON Web Tokens)
- **TOTP Libraries**: Speakeasy and QRCode

## Features

- User registration and login
- TOTP setup with QR code generation
- TOTP verification during login
- JWT-based authentication

## Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/mern-totp-auth.git
   cd mern-totp-auth
   ```

2. Install dependencies
   ```
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/totp-auth
   JWT_SECRET=your_jwt_secret
   ```

4. Start the application
   ```
   # Start the backend server
   cd server
   npm start

   # In a new terminal, start the frontend
   cd client
   npm start
   ```

## Required Packages

### Backend
```
npm install express mongoose speakeasy qrcode jsonwebtoken
```

### Frontend
```
npm install axios react-router-dom
```

## How It Works

### Enabling TOTP

1. The user navigates to their profile settings and clicks "Enable 2FA"
2. The server generates a secret key and creates a QR code
3. The user scans the QR code with their authenticator app (like Google Authenticator)
4. The user enters a verification code from their app to confirm setup
5. The server verifies the code and enables TOTP for the user

### Logging in with TOTP

1. The user enters their username and password
2. If credentials are valid and TOTP is enabled, the user is prompted for a verification code
3. The user opens their authenticator app and enters the current code
4. The server verifies the code against the stored secret
5. If valid, the server issues a JWT and the user is logged in

## Security Considerations

- Secret keys are stored in the database and should be encrypted at rest
- HTTPS should be used to protect data in transit
- Rate limiting should be implemented to prevent brute force attacks
- Recovery options should be provided for users who lose their authenticator device

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Speakeasy](https://github.com/speakeasyjs/speakeasy) - TOTP implementation
- [QRCode](https://github.com/soldair/node-qrcode) - QR code generation
- [React](https://reactjs.org/) - Frontend framework
- [Express](https://expressjs.com/) - Backend framework
- [MongoDB](https://www.mongodb.com/) - Database