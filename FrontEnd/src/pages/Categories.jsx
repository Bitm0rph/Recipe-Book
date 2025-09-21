import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../services/categories";

export default function Categories() {
  const [categories, setCategories] = useState([]); // always an array
  const [filterText, setFilterText] = useState(""); // search string
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getCategories()
      .then((res) => {
        setCategories(res); // res is array from backend
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <div className="p-4 text-center">Loading categories…</div>;
  if (error)
    return (
      <div className="p-4 text-red-500">Error loading categories</div>
    );

  // Filter safely—categories is always an array
  const filtered = categories.filter((cat) =>
    cat.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Categories</h1>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search categories…"
        className="mb-6 w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />

      {filtered.length === 0 ? (
        <p className="text-gray-600">
          {filterText
            ? `No categories match “${filterText}”.`
            : "No categories available."}
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map((cat) => (
            <Link
              key={cat._id} // Mongo uses _id, not $id
              to={`/categories/${cat._id}`}
              className="block bg-indigo-100 text-indigo-800 rounded-xl p-3 text-center hover:bg-indigo-200 transition"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
