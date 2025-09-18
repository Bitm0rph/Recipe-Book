import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaVideo } from "react-icons/fa";
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

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full max-h-96 object-cover rounded-lg mb-4"
        />
      )}
      <h1 className="text-3xl font-bold mb-2 text-center">{recipe.title}</h1>

      {recipe.category && (
        <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded mb-4">
          {recipe.category}
        </span>
      )}

      {recipe.video && (
        <a
          href={recipe.video}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-indigo-600 hover:underline text-sm my-2"
        >
          <FaVideo className="mr-1" />
          Watch Video
        </a>
      )}

      <h3 className="text-2xl font-medium mt-4">Ingredients</h3>
      <p className="mb-3 bg-gray-200 p-2 rounded">{recipe.ingredients}</p>

      <h3 className="text-2xl font-medium mt-3">Recipe</h3>
      <p className="text-gray-700 whitespace-pre-line mb-4">{recipe.content}</p>
    </div>
  );
}
