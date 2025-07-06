import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";


export default function Recipes() {
  const { data: recipes = [], loading, error } = useFetch(`/api/recipes`);

  if (loading) return <div className="animate-pulse p-4">Loading recipes…</div>;
  if (error)   return <div className="text-red-500 p-4">Error loading recipes</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Recipes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map(r => (
          <Link
            key={r.id}
            to={`/recipe/${r.id}`}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition"
          >
            <img src={r.image} alt={r.title} className="w-full h-40 object-cover" />
            <div className="p-3">
              <h2 className="text-lg font-medium">{r.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}