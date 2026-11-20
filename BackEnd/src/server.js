import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './DB/db.js';
import { app } from './app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.resolve(__dirname, '../.env')
});

const port = process.env.PORT || 3000;

await connectDB()
.then(() => {
    app.on("error",(err) => {
        console.log("Server error", err);
        throw err;
    })
    app.listen(port, () =>
        console.log(`Server running on http://localhost:${port}`)
    );
})
.catch((err) => {
    console.log("MONGODB connection failed",err);
})
