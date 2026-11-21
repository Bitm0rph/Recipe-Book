import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN === "*" ? true : (process.env.CORS_ORIGIN || true),
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
import mealPlannerRoutes from './routes/mealPlanner.routes.js';
import shoppingListRoutes from './routes/shoppingList.routes.js';

// declaration of routes
app.use("/api/v1/users",userRouter)
app.use("/api/v1/recipes",recipeRoutes)
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/favorites", favoritesRoutes);
app.use("/api/v1/meal-plans", mealPlannerRoutes);
app.use("/api/v1/shopping-list", shoppingListRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    return res.status(statusCode).json({
        statusCode,
        data: null,
        message,
        success: false,
        errors: err.errors || []
    });
});

export {app}
