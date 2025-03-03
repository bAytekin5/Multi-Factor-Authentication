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

router.post("/register",register);

router.post("/login",passport.authenticate('local'), login);

router.post("/status", authStatus);

router.post("/logout",logout);


router.post("/2fa/setup", (req, res, next) => {
    if(req.isAuthenticated()){
        return next(); 
    }else{
        res.status(401).json({ message: "Yetkiniz yok"});
    }
} ,setup2FA);




router.post("/2fa/verify", (req, res, next) => {
    if(req.isAuthenticated()){
        return next(); 
    }else{
        res.status(401).json({ message: "Yetkiniz yok"});
    }
} ,verify2FA);



router.post("/2fa/reset", (req, res, next) => {
    if(req.isAuthenticated()){
        return next(); 
    }else{
        res.status(401).json({ message: "Yetkiniz yok"});
    }
} ,reset2FA);

export default router;
