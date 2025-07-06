// src/components/Header.jsx
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/recipes", label: "Recipes" },
  { to: "/categories", label: "Categories" },
  { to: "/favorites", label: "Favorites" },
];

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Left: logo */}
        <NavLink to="/">
          <img src="https://alexharkness.com/wp-content/uploads/2020/06/logo-2.png" alt="Logo" className="h-10" />
        </NavLink>

        {/* Center: main nav */}
        <nav className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `text-lg font-medium ${
                  isActive ? "text-orange-600" : "text-gray-700 hover:text-orange-500"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right: auth links */}
        <div className="flex space-x-4">
          <NavLink
            to="/login"
            className="text-gray-700 hover:text-gray-900"
          >
            Log in
          </NavLink>
          <NavLink
            to="/signup"
            className="bg-orange-600 text-white px-4 py-1 rounded hover:bg-orange-700"
          >
            Sign Up
          </NavLink>
        </div>
      </div>
    </header>
  );
}
