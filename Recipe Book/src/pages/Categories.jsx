import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";


export default function Categories() {
  const { data: cats = [], loading, error } = useFetch(`/api/categories`);

  if (loading) return <div className="animate-pulse p-4">Loading categories…</div>;
  if (error)   return <div className="text-red-500 p-4">Error loading categories</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {cats.map(cat => (
          <Link
            key={cat}
            to={`/category/${cat}`}
            className="bg-white border py-6 rounded-lg text-center hover:bg-gray-100 transition"
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </Link>
        ))}
      </div>
    </div>
  );
}

