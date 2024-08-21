import express from "express";
import {  deleteApp, EmployergetAllApplications, postApp, SeekergetAllApplications } from "../controllers/app.controller.js";
import { isAuth } from "../middlewares/isAuth.middleware.js";

const router = express.Router();

router.get('/seeker/get-apps',isAuth,SeekergetAllApplications);
router.get('/employer/get-apps',isAuth,EmployergetAllApplications);
router.delete('/seeker/delete-app/:id',isAuth,deleteApp);
router.post('/post-app',isAuth,postApp);



export default router;