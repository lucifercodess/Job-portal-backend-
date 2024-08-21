import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
export const isAuth = async(req,res,next)=>{
  const token = req.cookies['job-token'];
  if(!token){
    return res.status(401).json({ code: 0, message: 'no token provided' });
  }
  const isAuthenticated = jwt.verify(token,process.env.JWT_SECRET);
  if(!isAuthenticated){
    return res.status(401).json({ code: 0, message: 'wrong token provided' });
  }
  const user = await User.findById(isAuthenticated.userId);
  req.user = user;
  next();
}