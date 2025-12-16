import { Router } from "express";
import passport from "passport";
import {
  register,
  login,
  authStatus,
  logout,
  setup2FA,
  verify2FA,
  reset2FA
} from "../controllers/authController.js";

const router = Router();

// Registration
router.post("/register", register);

// Login
router.post("/login", passport.authenticate("local"), login);


// Auth status (check if user logged in)
router.get("/status", authStatus);

// Logout
router.post("/logout", logout);

// 2FA setup
router.post("/2fa/setup", (req, res, next) => {
    if(req.isAuthenticated()) return next();
    res.status(401).json({ message: "Unauthorized user" });
}, setup2FA);

// 2FA verify
router.post("/2fa/verify", (req, res, next) => {
    if(req.isAuthenticated()) return next();
    res.status(401).json({ message: "Unauthorized user" });
}, verify2FA);

// 2FA reset
router.post("/2fa/reset",(req, res, next) => {
    if(req.isAuthenticated()) return next();
    res.status(401).json({ message: "Unauthorized user" });
}, reset2FA);

export default router;