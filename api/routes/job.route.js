import express from "express";
import { isAuth } from "../middlewares/isAuth.middleware.js";
import { deleteJob, getAllJobs, getMyJobs, postJob, updateJobField } from "../controllers/job.controller.js";

const router = express.Router();

router.get('/get-all-jobs',isAuth,getAllJobs)
router.post('/post-job',isAuth,postJob)
router.get('/get-my-jobs',isAuth,getMyJobs)
router.put('/update/:id',isAuth,updateJobField);
router.delete('/delete/:id',isAuth,deleteJob);


export default router;