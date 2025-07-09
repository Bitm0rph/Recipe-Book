import { useState, useEffect } from 'react';
import authService from '../appwrite/auth';
import service from '../appwrite/config';
import { Link, useNavigate } from 'react-router-dom';
import { FaVideo, FaHeart, FaRegHeart } from 'react-icons/fa';

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    authService.getCurrentUser()
      .then(user => {
        const uid = user.$id;
        setUserId(uid);
        return Promise.all([
          service.getPosts(),
          service.getFavorites(uid)
        ]);
      })
      .then(([postRes, favRes]) => {
        setRecipes(postRes.documents);
        setFavorites(favRes.documents);
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  const toggleFavorite = async (e, recipeId) => {
    e.stopPropagation();
    if (!userId) return;

    try {
      // check if already favorited
      const existing = favorites.find(f => f.recipeId === recipeId);
      if (existing) {
        // remove using favorite doc's $id
        await service.removeFavorite(existing.$id);
        setFavorites(favs => favs.filter(f => f.$id !== existing.$id));
      } else {
        // add favorite and capture new doc
        const newFav = await service.addFavorite(userId, recipeId);
        setFavorites(favs => [...favs, newFav]);
      }
    } catch (err) {
      console.error('Favorite toggle failed', err);
    }
  };

  if (loading) return <div className="animate-pulse p-4 text-center">Loading recipes…</div>;
  if (error)   return <div className="text-red-500 p-4 text-center">Error loading recipes</div>;

  return (
    <div className="p-6 bg-gray-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">All Recipes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.map(r => {
          const isFav = favorites.some(f => f.recipeId === r.$id);
          return (
            <div
              key={r.$id}
              className="relative bg-white border rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden cursor-pointer"
              onClick={() => navigate(`/recipes/${r.$id}`)}
            >
              {/* Favorite Button */}
              <button
                className="absolute top-3 right-3 z-10 text-red-500 text-xl"
                onClick={e => toggleFavorite(e, r.$id)}
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
