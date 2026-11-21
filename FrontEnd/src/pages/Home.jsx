import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { FaEye, FaHeart, FaPlus, FaRegHeart } from "react-icons/fa";
import { createRecipe, getAllRecipes } from "../services/recipes";
import { addFavorite, getFavorites, removeFavorite } from "../services/favorites";

export default function Home() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [favorites, setFavorites] = useState([]);
    const [favoriteError, setFavoriteError] = useState("");
    const [newRecipe, setNewRecipe] = useState({ title: "", description: "", tags: "", ingredients: "", steps: "" });
    const [imageFile, setImageFile] = useState(null);
    const [imageInputKey, setImageInputKey] = useState(0);
    const [addError, setAddError] = useState("");
    const [adding, setAdding] = useState(false);
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

    useEffect(() => {
      if (!authStatus) {
        setFavorites([]);
        return undefined;
      }

      let isCurrent = true;
      getFavorites()
        .then((userFavorites) => {
          if (isCurrent) {
            setFavorites(Array.isArray(userFavorites) ? userFavorites.map((recipe) => recipe._id || recipe) : []);
            setFavoriteError("");
          }
        })
        .catch((favoriteLoadError) => {
          console.error("Failed to load favorites", favoriteLoadError);
          if (isCurrent) setFavoriteError("Failed to load favorites.");
        });

      return () => {
        isCurrent = false;
      };
    }, [authStatus]);

    const handleAddRecipe = async () => {
      if (!newRecipe.title || !newRecipe.description) return;
      try {
        setAdding(true);
        setAddError("");
        const ingredientsArray = newRecipe.ingredients
          ? newRecipe.ingredients.split(",").map((pair) => {
              const [name, quantity] = pair.split(":").map((part) => part.trim());
              return { name: name || "", quantity: quantity || "" };
            })
          : [];
        const stepsArray = newRecipe.steps
          ? newRecipe.steps.split("\n").map((step) => step.trim()).filter(Boolean)
          : [];
        const created = await createRecipe({
          ...newRecipe,
          tags: newRecipe.tags.split(",").map((tag) => tag.trim()),
          ingredients: ingredientsArray,
          steps: stepsArray,
          image: imageFile,
        });
        setRecipes((previous) => [created, ...previous]);
        setNewRecipe({ title: "", description: "", tags: "", ingredients: "", steps: "" });
        setImageFile(null);
        setImageInputKey((key) => key + 1);
      } catch (addRecipeError) {
        console.error("Failed to add recipe", addRecipeError);
        setAddError(addRecipeError.response?.data?.message || "Failed to add recipe.");
      } finally {
        setAdding(false);
      }
    };

    const toggleFavorite = async (event, recipeId) => {
      event.stopPropagation();
      if (!authStatus) {
        navigate("/login");
        return;
      }

      const removingFavorite = favorites.includes(recipeId);
      setFavoriteError("");
      try {
        if (removingFavorite) {
          await removeFavorite(recipeId);
          setFavorites((previous) => previous.filter((id) => id !== recipeId));
        } else {
          await addFavorite(recipeId);
          setFavorites((previous) => [...previous, recipeId]);
        }
        setRecipes((previous) => previous.map((recipe) => {
          if (recipe._id !== recipeId) return recipe;
          const currentCount = recipe.favoriteCount ?? recipe.favorites?.length ?? 0;
          return {
            ...recipe,
            favoriteCount: Math.max(0, currentCount + (removingFavorite ? -1 : 1)),
          };
        }));
      } catch (favoriteActionError) {
        console.error("Favorite toggle failed", favoriteActionError);
        setFavoriteError(favoriteActionError.response?.data?.message || "Failed to update favorites.");
      }
    };

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
            <NavLink to="/myRecipes" className="btn-primary">
              My Recipes
            </NavLink>
            <NavLink to="/categories" className="btn-secondary">
              Explore Categories
            </NavLink>
          </div>
        </section>

        {authStatus && (
          <section className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Add a Recipe</h2>
            <div className="p-4 bg-white rounded-xl shadow flex flex-col md:flex-row gap-4">
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
              <label className="flex-1 border p-2 rounded text-gray-600">
                <span className="block mb-1">Recipe image (optional)</span>
                <input
                  key={imageInputKey}
                  type="file"
                  accept="image/*"
                  className="w-full"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
              </label>
              <textarea
                placeholder="Ingredients (name:quantity, separate by commas)"
                className="border p-2 rounded flex-1"
                rows={3}
                value={newRecipe.ingredients}
                onChange={(e) => setNewRecipe({ ...newRecipe, ingredients: e.target.value })}
              />
              <textarea
                placeholder="Steps (one per line)"
                className="border p-2 rounded flex-1"
                rows={3}
                value={newRecipe.steps}
                onChange={(e) => setNewRecipe({ ...newRecipe, steps: e.target.value })}
              />
              <button
                type="button"
                onClick={handleAddRecipe}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                disabled={adding}
              >
                <FaPlus /> {adding ? "Adding..." : "Add Recipe"}
              </button>
            </div>
            {addError && <p className="mt-3 text-red-600" role="alert">{addError}</p>}
          </section>
        )}

        <section id="all-recipes" className="p-6">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">All Recipes</h2>
          {loading && <p className="text-center">Loading recipes…</p>}
          {error && <p className="text-center text-red-600">{error}</p>}
          {!loading && !error && recipes.length === 0 && (
            <p className="text-center text-gray-600">No recipes yet.</p>
          )}
          {favoriteError && <p className="mb-4 text-red-600" role="alert">{favoriteError}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <article
                key={recipe._id}
                className="relative bg-white border rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden"
              >
                <button
                  type="button"
                  aria-label={favorites.includes(recipe._id) ? "Remove from favorites" : "Add to favorites"}
                  aria-pressed={favorites.includes(recipe._id)}
                  title={authStatus ? "Toggle favorite" : "Log in to add favorites"}
                  className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-3 text-red-500 shadow hover:bg-white"
                  onClick={(event) => toggleFavorite(event, recipe._id)}
                >
                  {favorites.includes(recipe._id) ? <FaHeart /> : <FaRegHeart />}
                </button>
                {recipe.imageUrl && (
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900">{recipe.title}</h3>
                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                    <span className="inline-flex items-center gap-1">
                      <FaEye /> {recipe.views?.length ?? 0} views
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <FaHeart /> {recipe.favoriteCount ?? recipe.favorites?.length ?? 0} likes
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
  