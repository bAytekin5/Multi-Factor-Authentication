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

// Reg Route
router.post("/register",register);
// Login Route
router.post("/login",passport.authenticate('local'), login);

// AUTH Status Route
router.post("/status", authStatus);
// Logout Route
router.post("/logout",logout);

// 2FA SETUP
router.post("/2fa/setup", (req, res, next) => {
    if(req.isAuthenticated()){
        return next(); 
    }else{
        res.status(401).json({ message: "Yetkiniz yok"});
    }
} ,setup2FA);



// Verify Route
router.post("/2fa/verify", (req, res, next) => {
    if(req.isAuthenticated()){
        return next(); 
    }else{
        res.status(401).json({ message: "Yetkiniz yok"});
    }
} ,verify2FA);


// RESET Route
router.post("/2fa/reset", (req, res, next) => {
    if(req.isAuthenticated()){
        return next(); 
    }else{
        res.status(401).json({ message: "Yetkiniz yok"});
    }
} ,reset2FA);

export default router;