import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import auth from '../middlewares/auth.middleware.js';


const router = express.Router();


// register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: 'Please enter all fields' });


        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'User exists' });


        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);


        const user = new User({ name, email, password: hashed });
        await user.save();


        const payload = { id: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });


        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


// login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Please enter all fields' });


        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });


        const payload = { id: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });


        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


router.get("/me", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password"); // exclude password
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({user});
    } catch (error) {
        console.error("Error in /me:", error);
        res.status(500).json({ message: "Server error" });
    }
});


export default router;