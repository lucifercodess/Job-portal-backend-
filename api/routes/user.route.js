import express from "express";
import { getUserProfile, login, logout, register } from "../controllers/user.controller.js";
import { isAuth } from "../middlewares/isAuth.middleware.js";

const router = express.Router();

router.post('/register',register)
router.post('/login',login)
router.get('/logout',isAuth,logout)
router.get('/get-user',isAuth,getUserProfile)



export default router;