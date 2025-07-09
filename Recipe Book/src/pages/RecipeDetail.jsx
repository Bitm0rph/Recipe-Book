import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import service from '../appwrite/config';
import { FaVideo, FaHeart, FaRegHeart } from 'react-icons/fa';

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    service.getPost(id)
      .then(res => setRecipe(res))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-4">Loading recipe...</div>;
  if (!recipe) return <div className="p-4 text-red-500">Recipe not found.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {recipe.image && (
        <img src={recipe.image} alt={recipe.title} className="w-full max-h-96 object-cover rounded-lg mb-4" />
      )}
      <h1 className="text-3xl font-bold mb-2 text-center">{recipe.title}</h1>
      {recipe.Category && (
        <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded mb-4">
          {recipe.Category}
        </span>
      )}
      <br />
      {recipe.video && (
        <a
          href={recipe.video}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-indigo-600 hover:underline text-sm"
        >
          <FaVideo className="mr-1" />
          Watch Video
        </a>
      )}
      <br />
      <h3 className='text-2xl font-medium'>Ingredients</h3>
      {
        recipe.Ingredients && (
          <span className='mb-3 bg-gray-200'
          >{recipe.Ingredients}</span>
        )
      }
      <h3 className='text-2xl font-medium mt-3'>Recipe</h3>
      <p className="text-gray-700 whitespace-pre-line mb-4">{recipe.content}</p>
      
    </div>
  );
}
