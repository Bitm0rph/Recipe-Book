import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { getFavorites, removeFavorite } from "../services/favorites";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const data = await getFavorites();
        setFavorites(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const removeFav = async (e, id) => {
    e.stopPropagation();
    try {
      await removeFavorite(id);
      setFavorites((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-4 text-center animate-pulse">Loading favorites…</div>;
  if (favorites.length === 0) return <div className="p-4 text-center text-gray-700">No favorite recipes yet.</div>;

  return (
    <div className="p-6 bg-gray-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Favorites</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((r) => (
          <div
            key={r._id}
            className="relative bg-white border rounded-2xl shadow-lg hover:shadow-2xl cursor-pointer overflow-hidden"
            onClick={() => navigate(`/recipes/${r._id}`)}
          >
            <button
              className="absolute top-3 right-3 z-10 text-red-500 text-xl"
              onClick={(e) => removeFav(e, r._id)}
            >
              <FaHeart />
            </button>
            {r.imageUrl && <img src={r.imageUrl} alt={r.title} className="w-full h-48 object-cover" />}
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-900">{r.title}</h3>
              <p className="text-gray-700 text-sm mt-2">
                {r.description?.length > 100 ? `${r.description.slice(0, 100)}...` : r.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
