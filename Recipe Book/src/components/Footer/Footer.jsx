import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-8">
      <div className="max-w-6xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <Link to="/" className="flex items-center mb-4">
            <img
              src="https://alexharkness.com/wp-content/uploads/2020/06/logo-2.png"
              alt="Logo"
              className="h-10"
            />
            <span className="ml-3 font-bold text-xl text-gray-800">Recipe Book</span>
          </Link>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <h3 className="text-gray-800 font-semibold mb-2 uppercase text-sm">Explore</h3>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li><Link to="/recipes" className="hover:text-gray-800">Recipes</Link></li>
              <li><Link to="/categories" className="hover:text-gray-800">Categories</Link></li>
              <li><Link to="/favorites" className="hover:text-gray-800">Favorites</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-gray-800 font-semibold mb-2 uppercase text-sm">Company</h3>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li><Link to="/about" className="hover:text-gray-800">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-gray-800">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-gray-800 font-semibold mb-2 uppercase text-sm">Legal</h3>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li><Link to="/privacy" className="hover:text-gray-800">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-gray-800">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-gray-800 font-semibold mb-2 uppercase text-sm">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-600 hover:text-gray-800">
              {/* Facebook icon */}
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.99h-2.54v-2.888h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.462h-1.26c-1.243 0-1.63.772-1.63 1.562v1.875h2.773l-.443 2.888h-2.33v6.99C18.343 21.128 22 16.991 22 12z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800">
              {/* Twitter icon */}
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43.64a9 9 0 0 1-2.83 1.08A4.48 4.48 0 0 0 16.88 0c-2.48 0-4.5 2.01-4.5 4.5 0 .35.04.69.11 1.02A12.8 12.8 0 0 1 1.67.9a4.48 4.48 0 0 0-.61 2.27c0 1.57.8 2.96 2.02 3.77A4.48 4.48 0 0 1 .96 6.1v.06c0 2.2 1.57 4.04 3.65 4.46a4.48 4.48 0 0 1-2.04.08 4.48 4.48 0 0 0 4.18 3.12A8.98 8.98 0 0 1 1 19.54 12.7 12.7 0 0 0 7.29 21c8.76 0 13.55-7.25 13.55-13.54l-.01-.62A9.68 9.68 0 0 0 23 3z"/>
              </svg>
            </a>
          </div>
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
