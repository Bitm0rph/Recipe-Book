import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser"

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
import recipeRoutes from './routes/recipes.routes.js'
import categoryRoutes from './routes/categories.routes.js';
import favoritesRoutes from './routes/favorites.routes.js';

// declaration of routes
app.use("/api/v1/users",userRouter)
app.use("/api/v1/recipes",recipeRoutes)
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/favorites", favoritesRoutes);


export {app}
