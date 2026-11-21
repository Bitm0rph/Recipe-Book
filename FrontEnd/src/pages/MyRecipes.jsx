import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaHeart, FaPen, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import { deleteRecipe, getUserRecipes, updateRecipe } from "../services/recipes";

const createEditForm = (recipe) => ({
  title: recipe.title || "",
  description: recipe.description || "",
  tags: (recipe.tags || []).join(", "),
  ingredients: (recipe.ingredients || [])
    .map((ingredient) => `${ingredient.name}:${ingredient.quantity}`)
    .join(", "),
  steps: (recipe.steps || []).join("\n"),
  image: null,
});

export default function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingRecipeId, setEditingRecipeId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [actionError, setActionError] = useState("");
  const [busyRecipeId, setBusyRecipeId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isCurrent = true;

    getUserRecipes()
      .then((userRecipes) => {
        if (isCurrent) setRecipes(userRecipes);
      })
      .catch((loadError) => {
        console.error("Failed to load your recipes", loadError);
        if (isCurrent) setError("Failed to load your recipes.");
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const startEditing = (recipe) => {
    setEditingRecipeId(recipe._id);
    setEditForm(createEditForm(recipe));
    setActionError("");
  };

  const handleUpdate = async (event, recipeId) => {
    event.preventDefault();
    setBusyRecipeId(recipeId);
    setActionError("");

    try {
      const ingredients = editForm.ingredients
        .split(",")
        .map((pair) => {
          const [name, quantity] = pair.split(":").map((part) => part.trim());
          return { name, quantity: quantity || "" };
        })
        .filter((ingredient) => ingredient.name);
      const steps = editForm.steps.split("\n").map((step) => step.trim()).filter(Boolean);
      const updatedRecipe = await updateRecipe(recipeId, {
        ...editForm,
        tags: editForm.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        ingredients,
        steps,
      });
      setRecipes((previous) => previous.map((recipe) =>
        recipe._id === recipeId ? updatedRecipe : recipe
      ));
      setEditingRecipeId(null);
      setEditForm(null);
    } catch (updateError) {
      console.error("Failed to update recipe", updateError);
      setActionError(updateError.response?.data?.message || "Failed to update recipe.");
    } finally {
      setBusyRecipeId(null);
    }
  };

  const handleDelete = async (recipeId) => {
    if (!window.confirm("Delete this recipe? This cannot be undone.")) return;
    setBusyRecipeId(recipeId);
    setActionError("");

    try {
      await deleteRecipe(recipeId);
      setRecipes((previous) => previous.filter((recipe) => recipe._id !== recipeId));
      if (editingRecipeId === recipeId) {
        setEditingRecipeId(null);
        setEditForm(null);
      }
    } catch (deleteError) {
      console.error("Failed to delete recipe", deleteError);
      setActionError(deleteError.response?.data?.message || "Failed to delete recipe.");
    } finally {
      setBusyRecipeId(null);
    }
  };

  if (loading) return <div className="p-4 text-center animate-pulse">Loading your recipes…</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">My Recipes</h1>
      {actionError && <p className="mb-4 text-red-600" role="alert">{actionError}</p>}
      {recipes.length === 0 ? (
        <p className="text-gray-600">You haven’t created any recipes yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <article key={recipe._id} className="overflow-hidden rounded-2xl border bg-white shadow-lg">
              {recipe.imageUrl && (
                <img src={recipe.imageUrl} alt={recipe.title} className="h-48 w-full object-cover" />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-900">{recipe.title}</h2>
                <p className="mt-2 text-sm text-gray-700">{recipe.description}</p>
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                  <span className="inline-flex items-center gap-1"><FaEye /> {recipe.views?.length ?? 0} views</span>
                  <span className="inline-flex items-center gap-1"><FaHeart /> {recipe.favorites?.length ?? 0} likes</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                    onClick={() => navigate(`/recipes/${recipe._id}`)}
                  >
                    View
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded border border-blue-600 px-3 py-2 text-blue-700 hover:bg-blue-50"
                    onClick={() => startEditing(recipe)}
                  >
                    <FaPen /> Edit
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded border border-red-600 px-3 py-2 text-red-700 hover:bg-red-50"
                    disabled={busyRecipeId === recipe._id}
                    onClick={() => handleDelete(recipe._id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>

                {editingRecipeId === recipe._id && editForm && (
                  <form
                    className="mt-5 space-y-3 border-t pt-4"
                    onSubmit={(event) => handleUpdate(event, recipe._id)}
                  >
                    <input
                      required
                      value={editForm.title}
                      onChange={(event) => setEditForm({ ...editForm, title: event.target.value })}
                      className="w-full rounded border p-2"
                      aria-label="Recipe title"
                    />
                    <textarea
                      required
                      value={editForm.description}
                      onChange={(event) => setEditForm({ ...editForm, description: event.target.value })}
                      className="w-full rounded border p-2"
                      aria-label="Recipe description"
                    />
                    <input
                      value={editForm.tags}
                      onChange={(event) => setEditForm({ ...editForm, tags: event.target.value })}
                      className="w-full rounded border p-2"
                      placeholder="Tags (comma separated)"
                      aria-label="Recipe tags"
                    />
                    <textarea
                      required
                      value={editForm.ingredients}
                      onChange={(event) => setEditForm({ ...editForm, ingredients: event.target.value })}
                      className="w-full rounded border p-2"
                      placeholder="Ingredients (name:quantity, separate by commas)"
                      aria-label="Recipe ingredients"
                    />
                    <textarea
                      required
                      value={editForm.steps}
                      onChange={(event) => setEditForm({ ...editForm, steps: event.target.value })}
                      className="w-full rounded border p-2"
                      placeholder="Steps (one per line)"
                      aria-label="Recipe steps"
                    />
                    <label className="block text-sm text-gray-700">
                      Replace image (optional)
                      <input
                        type="file"
                        accept="image/*"
                        className="mt-1 block w-full"
                        onChange={(event) => setEditForm({ ...editForm, image: event.target.files?.[0] || null })}
                      />
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                        disabled={busyRecipeId === recipe._id}
                      >
                        <FaSave /> {busyRecipeId === recipe._id ? "Saving..." : "Save changes"}
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded border px-3 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => {
                          setEditingRecipeId(null);
                          setEditForm(null);
                          setActionError("");
                        }}
                      >
                        <FaTimes /> Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
