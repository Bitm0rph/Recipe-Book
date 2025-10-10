import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRecipes } from "../services/recipes";

export default function Categories() {
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const data = await getRecipes();
        const catObj = {};
        (data.data || data).forEach((r) => {
          r.tags?.forEach((tag) => {
            if (!catObj[tag]) catObj[tag] = [];
            catObj[tag].push(r);
          });
        });
        setCategories(catObj);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  if (loading) return <div className="p-4 text-center animate-pulse">Loading categories…</div>;

  return (
    <div className="p-6 bg-gray-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Categories</h1>

      {Object.keys(categories).map((cat) => (
        <div key={cat} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">{cat}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories[cat].map((r) => (
              <div
                key={r._id}
                className="bg-white border rounded-2xl shadow-lg hover:shadow-2xl cursor-pointer overflow-hidden"
                onClick={() => navigate(`/recipes/${r._id}`)}
              >
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
      ))}
    </div>
  );
}
