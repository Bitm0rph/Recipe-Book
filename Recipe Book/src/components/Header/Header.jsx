// src/components/Header.jsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import Container from "../container/container";
import LogoutBtn from "./Logout";
import { useSelector } from "react-redux";



export default function Header() {
  const authStatus = useSelector((state) => state.auth.status)

  const navigate = useNavigate()

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
      name: "Recipes",
      to: "/recipes",
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
        <Link to="/" className="flex-shrink-0 absolute left-4">
          <img
            src="https://alexharkness.com/wp-content/uploads/2020/06/logo-2.png"
            alt="Logo"
            className="h-10"
          />
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
            {authStatus && (
                <LogoutBtn />
            )}
        </div>
      </nav>
    </Container>
  </header>
);

}