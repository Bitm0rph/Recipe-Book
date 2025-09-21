import dotenv from 'dotenv';
import { connectDB } from './DB/db.js';
import { app } from './app.js';

dotenv.config({
    path: './.env'
});


const port = process.env.PORT;

await connectDB()
.then(() => {
    app.on("errror",(err) => {
        console.log("Random errrror");
        throw err;
    })
    app.listen(port, () =>
        console.log(`Server running on http://localhost:${port}`)
    );
})
.catch((err) => {
    console.log("MONGODB connection failed",err);
})
