import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import './index.css'
import Home from './pages/Home.jsx'
import Favorites from './pages/Favorites.jsx'
import Categories from './pages/Categories.jsx'
import MyRecipes from './pages/MyRecipes.jsx'
import MealPlanner from './pages/MealPlanner.jsx'
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'
import { Provider } from 'react-redux';
import store from './store/store.js';
import AuthLayout from './components/AuthLayout.jsx';
import App from './App.jsx';
import RecipeDetail from './pages/RecipeDetail.jsx';
import CategoryDetail from './pages/CategoryDetail.jsx';
import About from './components/AboutUs.jsx';
import Contact from './components/ContactUs.jsx';
import DataNotice from './components/DataNotice.jsx';
import TermsOfService from './components/TermsOfService.jsx';


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/login",
                element: (
                    <AuthLayout authentication={false}>
                        <Login />
                    </AuthLayout>
                ),
            },
            {
                path: "/signup",
                element: (
                    <AuthLayout authentication={false}>
                        <Signup />
                    </AuthLayout>
                ),
            },
            {
                path: "/myRecipes",
                element: (
                    <AuthLayout authentication>
                        {" "}
                        <MyRecipes />
                    </AuthLayout>
                ),
            },
            {
                path: "/meal-planner",
                element: (
                    <AuthLayout authentication>
                        <MealPlanner />
                    </AuthLayout>
                ),
            },
            {
                path: "/recipes",
                element: <Navigate to="/myRecipes" replace />,
            },
            {
                path: "/favorites",
                element: (
                    <AuthLayout authentication>
                        {" "}
                        <Favorites />
                    </AuthLayout>
                ),
            },
            {
                path: "/categories",
                element: (
                    <AuthLayout authentication>
                        {" "}
                        <Categories />
                    </AuthLayout>
                ),
            },
            {
                path: "/recipes/:id",
                element: (
                    <AuthLayout authentication>
                        {" "}
                        <RecipeDetail />
                    </AuthLayout>
                ),
            },
            {
                path: "/categories/:id",
                element: (
                    <AuthLayout authentication>
                        {" "}
                        <CategoryDetail />
                    </AuthLayout>
                ),
            },
            {
                path: "/about",
                element: <About />
            },
            {
                path: "/contact",
                element: <Contact />
            },
            {
                path: "/privacy",
                element: <DataNotice />
            },
            {
                path: "/terms",
                element: <TermsOfService />
            }
        ]
    }
])


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </StrictMode>,
)
