import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { genTokenAndSetCookie } from '../JWT/genToken.js';

export const register = async (req, res) => {
  const { name, email, phone, password, role } = req.body;
  try {
    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({ code: 0, message: 'All fields are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ code: 0, message: 'Password must be at least 6 characters long' });
    }
    if (phone.length !== 10) {
      return res.status(400).json({ code: 0, message: 'Phone number must be 10 digits' });
    }

    const ifExists = await User.findOne({ email });
    if (ifExists) {
      return res.status(400).json({ code: 0, message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
    });

    
    await newUser.save();

    
    await genTokenAndSetCookie(newUser._id, res);

    return res.status(201).json({ code: 1, message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 1, message: 'Error in register controller' });
  }
};

export const login = async (req, res) => {
  const { email, password,role } = req.body;
  try {
    if (!email || !password ||  !role) {
      return res.status(400).json({ code: 0, message: 'All fields are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ code: 0, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ code: 0, message: 'Invalid credentials' });
    }
    if(user.role !== role){
      return res.status(403).json({ code: 0, message: 'Role mismatch' });
    }
    
    await genTokenAndSetCookie(user._id, res);

    return res.status(200).json({ code: 1, message: 'Logged in successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 1, message: 'Error in login controller' });
  }
};


export const logout = (req, res) => {
  res.clearCookie('job-token');
  return res.status(200).json({ code: 1, message: 'Logged out successfully' });
};


export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ code: 0, message: 'User not found' });
    }
    return res.status(200).json({ code: 1, data:user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 0, message: 'Error in getUserProfile controller' });
  }
}