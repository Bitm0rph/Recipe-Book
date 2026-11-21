import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaEye, FaHeart } from "react-icons/fa";
import { getRecipe } from "../services/recipes";

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getRecipe(id)
      .then((res) => setRecipe(res))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-4">Loading recipe...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading recipe</div>;
  if (!recipe) return <div className="p-4 text-red-500">Recipe not found.</div>;

  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  const steps = Array.isArray(recipe.steps) ? recipe.steps : [];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {recipe.imageUrl && (
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full max-h-96 object-cover rounded-lg mb-4"
        />
      )}
      <h1 className="text-3xl font-bold mb-2 text-center">{recipe.title}</h1>
      <div className="mb-4 flex justify-center items-center gap-4 text-sm text-gray-600">
        <span className="inline-flex items-center gap-1"><FaEye /> {recipe.views?.length ?? 0} views</span>
        <span className="inline-flex items-center gap-1"><FaHeart /> {recipe.favorites?.length ?? 0} likes</span>
      </div>

      {recipe.tags?.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {recipe.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-800">
              {tag}
            </span>
          ))}
        </div>
      )}

      <p className="mb-6 text-gray-700">{recipe.description}</p>

      <h2 className="text-2xl font-medium mt-4">Ingredients</h2>
      {ingredients.length > 0 ? (
        <ul className="mb-6 list-disc list-inside space-y-2 rounded bg-gray-100 p-4">
          {ingredients.map((ingredient, index) => (
            <li key={`${ingredient.name}-${index}`}>
              {ingredient.name}
              {ingredient.quantity && ` — ${ingredient.quantity}`}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-6 text-gray-600">No ingredients listed.</p>
      )}

      <h2 className="text-2xl font-medium mt-4">Instructions</h2>
      {steps.length > 0 ? (
        <ol className="mb-4 list-decimal list-inside space-y-3">
          {steps.map((step, index) => (
            <li key={`${index}-${step}`} className="text-gray-700">{step}</li>
          ))}
        </ol>
      ) : (
        <p className="mb-4 text-gray-600">No instructions listed.</p>
      )}
    </div>
  );
}
