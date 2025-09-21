import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser"
import authRoutes from './routes/user.routes.js';
import recipeRoutes from './routes/recipes.routes.js';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit: "20kb"}));
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.use(cookieParser())

app.get('/',(req,res) => {
    res.send("Hello, Express")
})

// import routes
import userRouter from './routes/user.routes.js'

// declaration of routes
app.use("/api/v1/users",userRouter)


export {app}
