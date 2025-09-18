import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { getRecipes } from "../services/recipes";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../services/favorites";

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    Promise.all([getRecipes(), getFavorites()])
      .then(([recipesData, favData]) => {
        setRecipes(recipesData);
        setFavorites(favData.map((f) => f._id || f));
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  const toggleFavorite = async (e, recipeId) => {
    e.stopPropagation();
    try {
      if (favorites.includes(recipeId)) {
        await removeFavorite(recipeId);
        setFavorites((prev) => prev.filter((id) => id !== recipeId));
      } else {
        await addFavorite(recipeId);
        setFavorites((prev) => [...prev, recipeId]);
      }
    } catch (err) {
      console.error("Favorite toggle failed", err);
    }
  };

  if (loading) return <div className="animate-pulse p-4 text-center">Loading recipes…</div>;
  if (error) return <div className="text-red-500 p-4 text-center">Error loading recipes</div>;

  return (
    <div className="p-6 bg-gray-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">All Recipes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.map((r) => {
          const isFav = favorites.includes(r._id);
          return (
            <div
              key={r._id}
              className="relative bg-white border rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden cursor-pointer"
              onClick={() => navigate(`/recipes/${r._id}`)}
            >
              {/* Favorite Button */}
              <button
                className="absolute top-3 right-3 z-10 text-red-500 text-xl"
                onClick={(e) => toggleFavorite(e, r._id)}
              >
                {isFav ? <FaHeart /> : <FaRegHeart />}
              </button>

              {r.image && (
                <img
                  src={r.image}
                  alt={r.title}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-4 flex flex-col h-full">
                <div>
                  <h2 className="mt-2 text-xl font-semibold text-gray-900">{r.title}</h2>
                  <p className="mt-3 text-gray-700 text-sm">
                    {r.description?.length > 100
                      ? `${r.description.slice(0, 100)}...`
                      : r.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
