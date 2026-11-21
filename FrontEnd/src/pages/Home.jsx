import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { FaEye, FaHeart } from "react-icons/fa";
import { getAllRecipes } from "../services/recipes";

export default function Home() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const authStatus = useSelector((state) => state.auth.status);
    const navigate = useNavigate();

    useEffect(() => {
      let isCurrent = true;

      const loadRecipes = async () => {
        try {
          const firstPage = await getAllRecipes(1, 100);
          const pages = [firstPage];

          for (let page = 2; page <= firstPage.totalPages; page += 1) {
            pages.push(await getAllRecipes(page, 100));
          }

          if (isCurrent) {
            setRecipes(pages.flatMap((result) => result.data));
          }
        } catch (loadError) {
          console.error("Failed to load home page recipes", loadError);
          if (isCurrent) setError("Failed to load recipes.");
        } finally {
          if (isCurrent) setLoading(false);
        }
      };

      loadRecipes();
      return () => {
        isCurrent = false;
      };
    }, []);

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
            <a href="#all-recipes" className="btn-primary">
              Browse Recipes
            </a>
            <NavLink to="/categories" className="btn-secondary">
              Explore Categories
            </NavLink>
          </div>
        </section>

        <section id="all-recipes" className="p-6">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">All Recipes</h2>
          {loading && <p className="text-center">Loading recipes…</p>}
          {error && <p className="text-center text-red-600">{error}</p>}
          {!loading && !error && recipes.length === 0 && (
            <p className="text-center text-gray-600">No recipes yet.</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <article
                key={recipe._id}
                className="bg-white border rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden"
              >
                {recipe.imageUrl && (
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900">{recipe.title}</h3>
                  <p className="mt-2 text-gray-700 text-sm">
                    {recipe.description?.length > 100
                      ? `${recipe.description.slice(0, 100)}...`
                      : recipe.description}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                    <span className="inline-flex items-center gap-1">
                      <FaEye /> {recipe.views ?? 0} views
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <FaHeart /> {recipe.favorites?.length ?? 0} likes
                    </span>
                  </div>
                  <button
                    type="button"
                    className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    onClick={() => navigate(authStatus ? `/recipes/${recipe._id}` : "/login")}
                  >
                    {authStatus ? "View full recipe" : "Log in to view full recipe"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    );
  }
  