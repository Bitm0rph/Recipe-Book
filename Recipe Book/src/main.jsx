import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Route, Navigate, Routes, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import './index.css'
import Home from './components/Home/Home.jsx'
import Favorites from './components/Favorites/Favorites.jsx'
import Categories from './components/Categories/Categories.jsx'
import Recipes from './components/Recipes/Recipes.jsx'
import Login from './components/Login/Login.jsx'
import Signup from './components/Signup/Signup.jsx';
import User from './User/User.jsx';
import Layout from './Layout.jsx';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout/>}>
      <Route path='' element={<Home/>}/>
      <Route path="recipes" element={<Recipes />} />
      <Route path="categories" element={<Categories />} />
      <Route path="favorites" element={<Favorites />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path='user/:id' element={<User/>}/>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  )
)


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
