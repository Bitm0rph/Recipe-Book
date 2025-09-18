// src/components/Footer.jsx
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-8">
      <div className="max-w-6xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Branding */}
        <div className="col-span-1 flex items-center">
          <Link to="/" className="flex items-center ">
            <img
              src="https://alexharkness.com/wp-content/uploads/2020/06/logo-2.png"
              alt="Logo"
              className="h-10"
            />
            <span className="ml-3 font-bold text-xl text-gray-800">Recipe Book</span>
          </Link>
        </div>

        {/* Explore */}
        <div className="col-span-1">
          <h3 className="text-gray-800 font-semibold mb-2 uppercase text-sm">Explore</h3>
          <ul className="space-y-1 text-gray-600 text-sm">
            <li><Link to="/recipes"    className="hover:text-gray-800">Recipes</Link></li>
            <li><Link to="/categories" className="hover:text-gray-800">Categories</Link></li>
            <li><Link to="/favorites"  className="hover:text-gray-800">Favorites</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div className="col-span-1">
          <h3 className="text-gray-800 font-semibold mb-2 uppercase text-sm">Company</h3>
          <ul className="space-y-1 text-gray-600 text-sm">
            <li><Link to="/about"   className="hover:text-gray-800">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-gray-800">Contact</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div className="col-span-1">
          <h3 className="text-gray-800 font-semibold mb-2 uppercase text-sm">Legal</h3>
          <ul className="space-y-1 text-gray-600 text-sm">
            <li><Link to="/privacy" className="hover:text-gray-800">Privacy Policy</Link></li>
            <li><Link to="/terms"          className="hover:text-gray-800">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      <div className="bg-gray-100 py-4">
        <div className="max-w-6xl mx-auto text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} Recipe Book. All rights reserved.
        </div>
      </div>
    </footer>
);
}
