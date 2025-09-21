import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFavorites } from "../services/favorites";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getFavorites()
      .then((recipes) => setFavorites(recipes))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4 text-center">Loading favorites…</div>;
  if (error) return <div className="p-4 text-red-500">Error loading favorites</div>;

  return (
    <div className="p-6 bg-gray-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Favorites</h1>

      {favorites.length === 0 ? (
        <p className="text-gray-600">You have no favorite recipes yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map((r) => (
            <Link
              key={r._id}
              to={`/recipes/${r._id}`}
              className="block bg-white border rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
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
        </div>
      )}
    </div>
  );
}
