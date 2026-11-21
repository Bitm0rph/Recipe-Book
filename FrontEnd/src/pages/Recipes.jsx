import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaHeart, FaRegHeart, FaPlus } from "react-icons/fa";
import { getRecipes, createRecipe } from "../services/recipes";
import { getFavorites, addFavorite, removeFavorite } from "../services/favorites";

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newRecipe, setNewRecipe] = useState({ title: "", description: "", imageUrl: "", tags: "", ingredients: "", steps: "" });
  const [adding, setAdding] = useState(false);

  const navigate = useNavigate();

  // Load recipes and favorites
  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const recipesData = await getRecipes();
        const data = Array.isArray(recipesData) ? recipesData : (recipesData?.data || []);
        setRecipes(data);
        try {
          const favsData = await getFavorites();
          setFavorites(Array.isArray(favsData) ? favsData.map((f) => f._id || f) : []);
        } catch (favErr) {
          console.error("Failed to load favorites", favErr);
        }
        setError(null);
      } catch (err) {
        console.error(err);
        setRecipes([]);
        setError("Failed to load recipes");
      } finally {
        setLoading(false);
      }
    };
  
    fetchRecipes();
  }, []);
  

  const toggleFavorite = async (e, recipeId) => {
    e.stopPropagation();
    const removingFavorite = favorites.includes(recipeId);
    try {
      if (removingFavorite) {
        await removeFavorite(recipeId);
        setFavorites((prev) => prev.filter((id) => id !== recipeId));
      } else {
        await addFavorite(recipeId);
        setFavorites((prev) => [...prev, recipeId]);
      }
      setRecipes((prev) => prev.map((recipe) => {
        if (recipe._id !== recipeId) return recipe;
        const currentCount = recipe.favoriteCount ?? recipe.favorites?.length ?? 0;
        return {
          ...recipe,
          favoriteCount: Math.max(0, currentCount + (removingFavorite ? -1 : 1)),
        };
      }));
    } catch (err) {
      console.error("Favorite toggle failed", err);
    }
  };

  const handleAddRecipe = async () => {
    if (!newRecipe.title || !newRecipe.description) return;
    try {
      setAdding(true);
      // Parse ingredients string "name:quantity, name2:quantity2"
      const ingredientsArray = newRecipe.ingredients
        ? newRecipe.ingredients.split(',').map(pair => {
            const [name, quantity] = pair.split(':').map(s => s.trim());
            return { name: name || '', quantity: quantity || '' };
          })
        : [];
      // Parse steps string (one per line)
      const stepsArray = newRecipe.steps
        ? newRecipe.steps.split('\n').map(s => s.trim()).filter(Boolean)
        : [];
      const created = await createRecipe({
        ...newRecipe,
        tags: newRecipe.tags.split(',').map(t => t.trim()),
        ingredients: ingredientsArray,
        steps: stepsArray,
      });
      setRecipes(prev => [created, ...prev]);
      // Clear all fields after adding
      setNewRecipe({ title: "", description: "", imageUrl: "", tags: "", ingredients: "", steps: "" });
    } catch (err) {
      console.error("Failed to add recipe", err);
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="p-4 text-center animate-pulse">Loading recipes…</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">All Recipes</h1>

      {/* Add new recipe form */}
      <div className="mb-8 p-4 bg-white rounded-xl shadow flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Title"
          className="border p-2 rounded flex-1"
          value={newRecipe.title}
          onChange={(e) => setNewRecipe({ ...newRecipe, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          className="border p-2 rounded flex-1"
          value={newRecipe.description}
          onChange={(e) => setNewRecipe({ ...newRecipe, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          className="border p-2 rounded flex-1"
          value={newRecipe.tags}
          onChange={(e) => setNewRecipe({ ...newRecipe, tags: e.target.value })}
        />
        {/* Ingredients (comma separated) */}
        <textarea
          placeholder="Ingredients (name:quantity, separate by commas)"
          className="border p-2 rounded flex-1"
          rows={3}
          value={newRecipe.ingredients}
          onChange={(e) => setNewRecipe({ ...newRecipe, ingredients: e.target.value })}
        />
        {/* Steps (one per line) */}
        <textarea
          placeholder="Steps (one per line)"
          className="border p-2 rounded flex-1"
          rows={3}
          value={newRecipe.steps}
          onChange={(e) => setNewRecipe({ ...newRecipe, steps: e.target.value })}
        />
        <button
          onClick={handleAddRecipe}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          disabled={adding}
        >
          <FaPlus /> {adding ? "Adding..." : "Add Recipe"}
        </button>
      </div>

      {/* Recipe cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((r) => {
          const isFav = favorites.includes(r._id);
          return (
            <div
              key={r._id}
              className="relative bg-white border rounded-2xl shadow-lg hover:shadow-2xl cursor-pointer overflow-hidden"
              onClick={() => navigate(`/recipes/${r._id}`)}
            >
              <button
                className="absolute top-3 right-3 z-10 text-red-500 text-xl"
                onClick={(e) => toggleFavorite(e, r._id)}
              >
                {isFav ? <FaHeart /> : <FaRegHeart />}
              </button>

              {r.imageUrl && <img src={r.imageUrl} alt={r.title} className="w-full h-48 object-cover" />}

              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-900">{r.title}</h2>
                <p className="mt-2 text-gray-700 text-sm">
                  {r.description?.length > 100 ? `${r.description.slice(0, 100)}...` : r.description}
                </p>
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                  <span className="inline-flex items-center gap-1"><FaEye /> {r.views ?? 0} views</span>
                  <span className="inline-flex items-center gap-1"><FaHeart /> {r.favoriteCount ?? r.favorites?.length ?? 0} likes</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
