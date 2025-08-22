import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import './index.css'
import Home from './pages/Home.jsx'
import Favorites from './pages/Favorites.jsx'
import Categories from './pages/Categories.jsx'
import Recipes from './pages/Recipes.jsx'
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
import PrivacyPolicy from './components/PrivacyPolicy.jsx';
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
            path: "/recipes",
            element: (
                <AuthLayout authentication>
                    {" "}
                    <Recipes />
                </AuthLayout>
            ),
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
            element: (
                <AuthLayout authentication>
                    {" "}
                    <About />
                </AuthLayout>
            )
        },
        {
            path: "/contact",
            element: (
                <AuthLayout authentication>
                    {" "}
                    <Contact />
                </AuthLayout>
            )
        },
        {
            path: "/privacy",
            element: (
                <AuthLayout authentication>
                    {" "}
                    <PrivacyPolicy />
                </AuthLayout>
            )
        },
        {
            path: "/terms",
            element: (
                <AuthLayout authentication>
                    {" "}
                    <TermsOfService />
                </AuthLayout>
            )
        }
    ]
}
])


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
            <RouterProvider router={router}/>
        </Provider>
    </StrictMode>,
)
