// Install required packages:
// npm install express mongoose speakeasy qrcode jsonwebtoken

const express = require('express');
const mongoose = require('mongoose');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// Simple User Model
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  totpSecret: { type: String },
  totpEnabled: { type: Boolean, default: false }
});

const User = mongoose.model('User', UserSchema);

// Route to enable TOTP
app.post('/api/enable-totp', async (req, res) => {
  const { userId } = req.body;
  
  // Generate new TOTP secret
  const secret = speakeasy.generateSecret({
    name: `YourApp:${userId}`
  });
  
  // Save the secret to the user's profile
  await User.findByIdAndUpdate(userId, {
    totpSecret: secret.base32
  });
  
  // Generate QR code
  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
  
  res.json({
    secret: secret.base32,
    qrCode: qrCodeUrl
  });
});

// Verify and activate TOTP
app.post('/api/verify-totp', async (req, res) => {
  const { userId, token } = req.body;
  
  // Get user
  const user = await User.findById(userId);
  
  // Verify the token against the secret
  const verified = speakeasy.totp.verify({
    secret: user.totpSecret,
    encoding: 'base32',
    token: token
  });
  
  if (verified) {
    // Enable TOTP for the user
    await User.findByIdAndUpdate(userId, {
      totpEnabled: true
    });
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, message: 'Invalid token' });
  }
});

// Login with TOTP
app.post('/api/login', async (req, res) => {
  const { username, password, token } = req.body;
  
  // Find the user (basic auth)
  const user = await User.findOne({ username });
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Check if TOTP is enabled
  if (user.totpEnabled) {
    // If TOTP enabled, verify the token
    const verified = speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: 'base32',
      token: token
    });
    
    if (!verified) {
      return res.status(401).json({ message: 'Invalid TOTP token' });
    }
  }
  
  // Generate JWT
  const jwtToken = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
  
  res.json({ token: jwtToken });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
