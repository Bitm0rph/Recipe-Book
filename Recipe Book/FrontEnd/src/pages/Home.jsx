import { NavLink } from "react-router-dom";

export default function Home() {
    return (
      <div className="min-h-screen bg-gray-200">
        <section className="pt-32 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Find Your Next Favorite Recipe
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Browse thousands of recipes, search by categories, and save your favorites.
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
  
        
      </div>
    );
  }
  