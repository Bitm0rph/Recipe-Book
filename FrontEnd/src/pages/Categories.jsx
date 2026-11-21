import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../services/categories";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategories(await getCategories());
      } catch (err) {
        console.error("Failed to load categories", err);
        setError("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  if (loading) return <div className="p-4 text-center animate-pulse">Loading categories…</div>;

  return (
    <div className="p-6 bg-gray-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Categories</h1>
      <label className="mb-6 block max-w-lg">
        <span className="sr-only">Search categories</span>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search categories..."
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
        />
      </label>

      {error && <p className="mb-4 text-red-600" role="alert">{error}</p>}
      {!error && filteredCategories.length === 0 && (
        <p className="text-gray-600">
          {search ? "No matching categories found." : "No categories yet. Add recipe tags to create categories."}
        </p>
      )}
      {!error && filteredCategories.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((category) => (
            <Link
              key={category._id}
              to={`/categories/${category._id}`}
              className="rounded-2xl border bg-white p-6 shadow-lg transition-shadow hover:shadow-2xl"
            >
              <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
              <p className="mt-2 text-sm text-gray-600">
                {category.description || "Browse recipes in this category."}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
