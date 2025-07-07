import { NavLink } from "react-router-dom";

export default function Home() {
    return (
      <div className="min-h-screen bg-gray-50">
        <section className="pt-32 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Find Your Next Favorite Recipe
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Browse thousands of recipes by category, search by ingredients, and save your favorites.
          </p>
          <div className="space-x-4">
            <NavLink to="/recipes" className="btn-primary">
              Browse Recipes
            </NavLink>
            <NavLink to="/categories" className="btn-secondary">
              Explore Categories
            </NavLink>
          </div>
        </section>
  
        {/* Optional: Feature cards under hero */}
        <section className="py-16 grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {/* Card: Live Search */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">Live Ingredient Search</h2>
            <p className="text-gray-600">Quickly filter recipes by whatever’s in your pantry.</p>
          </div>
          {/* More feature cards… */}
        </section>
      </div>
    );
  }
  