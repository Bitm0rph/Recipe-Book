import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import recipeRoutes from './routes/recipes.js';
import { connectDB } from './config/db.js';


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);

app.get('/',(req,res) => {
    res.send("Hello, Express")
})
const port = process.env.PORT;

await connectDB().then(() => {
    app.listen(port, () =>
        console.log(`Server running on http://localhost:${port}`)
    );
});

