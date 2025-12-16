import bcrypt from "bcryptjs";
import User from "../models/user.js";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import jwt from "jsonwebtoken";

// =====================
// REGISTER
// =====================
export const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      isMfaActive: false,
    });

    console.log("New User:", newUser);
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({
      error: "Error registering user",
      message: error.message,
    });
  }
};

// =====================
// LOGIN
// =====================
export const login = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  console.log("User logged in:", req.user);

  res.status(200).json({
    message: "Login successful",
    user: {
      username: req.user.username,
      isMfaActive: req.user.isMfaActive,
    },
  });
};

// =====================
// AUTH STATUS
// =====================
export const authStatus = async (req, res) => {
  if (req.user) {
    return res.status(200).json({
      isAuthenticated: true,
      user: {
        username: req.user.username,
        isMfaActive: req.user.isMfaActive,
      },
    });
  }

  return res.status(200).json({ isAuthenticated: false });
};

// =====================
// LOGOUT
// =====================
export const logout = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized user" });
  }

  req.logout((err) => {
    if (err) {
      return res.status(400).json({
        error: "Logout unsuccessful",
        message: err.message,
      });
    }

    res.status(200).json({ message: "Logout successful" });
  });
};

// =====================
// SETUP 2FA
// =====================
export const setup2FA = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const secret = speakeasy.generateSecret({ length: 20 });

    user.twoFactorSecret = secret.base32;
    user.isMfaActive = true;
    await user.save();

    const otpAuthUrl = speakeasy.otpauthURL({
      secret: secret.base32,
      label: `${user.username}`,
      issuer: "anuragpatil.dev",
      encoding: "base32",
    });

    const qrImageURL = await qrcode.toDataURL(otpAuthUrl);

    res.status(200).json({
      secret: secret.base32,
      qrCode: qrImageURL,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error setting up 2FA",
      message: error.message,
    });
  }
};

// =====================
// VERIFY 2FA
// =====================
export const verify2FA = async (req, res) => {
  try {
    const { token } = req.body;
    const user = req.user;

    if (!user || !user.twoFactorSecret) {
      return res.status(401).json({ message: "2FA not setup" });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token,
      window: 1,
    });

    if (verified) {
      const jwtToken = jwt.sign(
        { username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        message: "2FA successful",
        token: jwtToken,
      });
    }

    return res.status(400).json({ error: "Invalid 2FA token" });
  } catch (error) {
    res.status(500).json({
      error: "2FA verification failed",
      message: error.message,
    });
  }
};

// =====================
// RESET 2FA
// =====================
export const reset2FA = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    user.twoFactorSecret = undefined;
    user.isMfaActive = false;

    await user.save();

    res.status(200).json({ message: "2FA reset successful" });
  } catch (error) {
    res.status(500).json({
      error: "Error resetting 2FA",
      message: error.message,
    });
  }
};