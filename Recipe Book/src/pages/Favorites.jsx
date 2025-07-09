import { useState, useEffect } from 'react';
import service from '../appwrite/config';
import authService from '../appwrite/auth';
import { Link } from 'react-router-dom';
import { FaVideo, FaHeart, FaRegHeart } from 'react-icons/fa';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]); // will hold full recipe objects
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    setLoading(true);
    authService.getCurrentUser()
      .then(user => {
        return service.getFavorites(user.$id);
      })
      .then(res => {
        // res.documents is an array of { $id, recipeId }
        const favDocs = res.documents;
        // fetch each recipe by its recipeId
        return Promise.all(
          favDocs.map(fav =>
            service.getPost(fav.recipeId).then(recipe => ({
              ...recipe,
              favDocId: fav.$id,       // keep the favorite doc ID if you need it
            }))
          )
        );
      })
      .then(recipes => {
        setFavorites(recipes);
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4 text-center">Loading favorites…</div>;
  if (error)   return <div className="p-4 text-red-500">Error loading favorites</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Favorites</h1>

      {favorites.length === 0 ? (
        <p className="text-gray-600">You have no favorite recipes yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map(r => (
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
                <div className="mt-4 flex items-center justify-between">
                  <button
                    className="text-indigo-500 text-sm font-medium hover:underline"
                    onClick={e => {
                      e.stopPropagation();
                      navigate(`/recipes/${r.$id}`);
                    }}
                  >
                    Read more →
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
