// src/pages/CategoryDetail.jsx
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import service from '../appwrite/config';
import { FaVideo } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function CategoryDetail() {
  const { id } = useParams(); // category document ID
  const [recipes, setRecipes] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    // fetch recipes by category name or ID
    service.getCategory(id)
      .then(catDoc => {
        setCategoryName(catDoc.name);
        return service.getSelectedRecipes(catDoc.name);
      })
      .then(res => {
        setRecipes(res.documents);
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-4 text-center">Loading…</div>;
  if (error)   return <div className="p-4 text-red-500">Error loading recipes</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Recipes in “{categoryName}”
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.map(r => (
          <Link
            key={r.$id}
            to={`/recipes/${r.$id}`}
            className="block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
          >
            {r.image && (
              <img
                src={r.image}
                alt={r.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-900">{r.title}</h2>
              <p className="mt-2 text-gray-700 text-sm">
                {r.description?.length > 100
                  ? `${r.description.slice(0, 100)}...`
                  : r.description}
              </p>
            </div>
          </Link>
        ))}
        {recipes.length === 0 && (
          <p className="text-gray-600 col-span-full">
            No recipes found in this category.
          </p>
        )}
      </div>
    </div>
  );
}
