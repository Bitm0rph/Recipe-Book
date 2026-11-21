// src/components/Header.jsx
import { Link, NavLink } from "react-router-dom";
import Container from "../container/container";
import ProfileMenu from "./ProfileMenu";
import { useSelector } from "react-redux";
import { FaUtensils } from "react-icons/fa";

export default function Header() {
  const authStatus = useSelector((state) => state.auth.status)

  const navItems = [
    {
      name: "Home",
      to: "/",
      active: true
    },
    {
      name: "Login",
      to: "/login",
      active: !authStatus
    },
    {
      name: "Signup",
      to: "/signup",
      active: !authStatus
    },
    {
      name: "My Recipes",
      to: "/myRecipes",
      active: authStatus
    },
    {
      name: "Meal Planner",
      to: "/meal-planner",
      active: authStatus
    },
    {
      name: "Categories",
      to: "/categories",
      active: authStatus
    },
    {
      name: "Favorites",
      to: "/favorites",
      active: authStatus
    }
  ];


return (
  <header className="bg-white shadow-md">
    <Container>
      <nav className="flex items-center py-4 justify-center space-x-8">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0 absolute left-4 flex items-center gap-2 text-gray-800">
          <FaUtensils className="text-xl text-blue-600" aria-hidden="true" />
          <span className="font-bold">Recipe Book</span>
        </Link>

        {/* Navigation items */}
        <ul className="flex space-x-4 flex-grow justify-center">
        {navItems.map(item =>
          item.active ? (
            <li key={item.name}>
              <NavLink
                to={item.to}
                end={item.to === '/'}              // exact match on “Home”
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full transition ${
                    isActive
                      ? 'bg-blue-500 text-white'  // Active style
                      : 'text-gray-700 hover:bg-blue-50'
                  }`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ) : null
        )}
        </ul>

        {/* Auth/logout */}
        <div className="flex items-center space-x-4">
          {authStatus && <ProfileMenu />}
        </div>
      </nav>
    </Container>
  </header>
);

}