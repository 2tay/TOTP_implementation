// Install required packages:
// npm install axios react-router-dom

import React, { useState } from 'react';
import axios from 'axios';

// Component to set up TOTP
function TotpSetup() {
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [token, setToken] = useState('');
  const [verified, setVerified] = useState(false);

  const enableTotp = async () => {
    try {
      // Get the current user ID from local storage or context
      const userId = localStorage.getItem('userId');
      
      const response = await axios.post('/api/enable-totp', { userId });
      setQrCode(response.data.qrCode);
      setSecret(response.data.secret);
    } catch (error) {
      console.error('Error enabling TOTP:', error);
    }
  };

  const verifyTotp = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.post('/api/verify-totp', { 
        userId, 
        token 
      });
      
      if (response.data.success) {
        setVerified(true);
      }
    } catch (error) {
      console.error('Error verifying TOTP:', error);
    }
  };

  return (
    <div>
      <h2>Set Up Two-Factor Authentication</h2>
      <button onClick={enableTotp}>Enable 2FA</button>
      
      {qrCode && (
        <div>
          <p>Scan this QR code with your authenticator app:</p>
          <img src={qrCode} alt="TOTP QR Code" />
          
          <p>Or enter this code manually: {secret}</p>
          
          <div>
            <p>Enter the verification code from your app:</p>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter 6-digit code"
            />
            <button onClick={verifyTotp}>Verify</button>
          </div>
        </div>
      )}
      
      {verified && <p>Two-factor authentication has been enabled!</p>}
    </div>
  );
}

// Component for login with TOTP
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [requireTotp, setRequireTotp] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('/api/login', {
        username,
        password,
        token
      });
      
      // Store the JWT token
      localStorage.setItem('token', response.data.token);
      
      // Redirect to dashboard or home page
      window.location.href = '/dashboard';
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // If user credentials are correct but TOTP is required
        setRequireTotp(true);
      }
      console.error('Login error:', error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        {requireTotp && (
          <div>
            <label>Authentication Code:</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter 6-digit code"
            />
          </div>
        )}
        
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export { TotpSetup, Login };
