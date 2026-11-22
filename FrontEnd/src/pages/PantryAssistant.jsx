import { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaRobot, FaUtensils } from "react-icons/fa";
import { getPantrySuggestions } from "../services/pantryAssistant";

const getErrorMessage = (error) =>
  error.response?.data?.message || "Could not get suggestions right now.";

export default function PantryAssistant() {
  const [ingredientsText, setIngredientsText] = useState("");
  const [preferences, setPreferences] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const ingredients = ingredientsText
      .split(/[\n,]/)
      .map((ingredient) => ingredient.trim())
      .filter(Boolean);
    if (ingredients.length === 0) {
      setError("Enter at least one ingredient.");
      return;
    }

    setLoading(true);
    setError("");
    setHasSearched(false);
    try {
      const result = await getPantrySuggestions(ingredients, preferences);
      setSuggestions(result.suggestions || []);
      setHasSearched(true);
    } catch (requestError) {
      console.error("Pantry assistant request failed", requestError);
      setError(getErrorMessage(requestError));
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl text-blue-700">
            <FaRobot aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">AI Pantry Assistant</h1>
          <p className="mx-auto mt-2 max-w-2xl text-gray-600">
            Tell us what you have. Get ideas from recipes already in Recipe Book, plus ingredients you may be missing.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-5 shadow-sm sm:p-7">
          <label className="block font-medium text-gray-800" htmlFor="pantry-ingredients">
            Ingredients you have
            <textarea
              id="pantry-ingredients"
              required
              value={ingredientsText}
              onChange={(event) => setIngredientsText(event.target.value)}
              className="mt-2 min-h-32 w-full rounded-lg border p-3 font-normal"
              placeholder={"For example:\nchickpeas\nspinach\ncoconut milk"}
            />
            <span className="mt-1 block text-sm font-normal text-gray-500">
              Separate items with commas or new lines. Add up to 40 ingredients. The assistant can recognize common name variations, but does not calculate quantities.
            </span>
          </label>

          <label className="block font-medium text-gray-800" htmlFor="pantry-preferences">
            Preferences (optional)
            <input
              id="pantry-preferences"
              value={preferences}
              onChange={(event) => setPreferences(event.target.value)}
              maxLength={500}
              className="mt-2 w-full rounded-lg border p-3 font-normal"
              placeholder="For example: quick weekday meal, vegetarian"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FaRobot /> {loading ? "Finding ideas..." : "Get recipe ideas"}
          </button>
        </form>

        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          AI suggestions and substitutions can be inaccurate. Check the recipe and ingredient labels yourself;
          do not rely on suggestions for allergy or medical safety.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Your ingredient list and preferences are sent to the configured AI provider to generate suggestions.
        </p>

        {error && (
          <p className="mt-5 rounded-lg bg-red-50 p-4 text-red-700" role="alert">{error}</p>
        )}

        {hasSearched && !suggestions.length && (
          <p className="mt-6 rounded-lg bg-white p-5 text-center text-gray-600 shadow-sm">
            No matching recipes were found in the current recipe collection. Try adding ingredients or adjusting preferences.
          </p>
        )}

        {suggestions.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">Recipes to try</h2>
            <div className="grid gap-5 md:grid-cols-2">
              {suggestions.map((suggestion) => (
                <article key={suggestion.recipe._id} className="overflow-hidden rounded-xl bg-white shadow-sm">
                  {suggestion.recipe.imageUrl && (
                    <img
                      src={suggestion.recipe.imageUrl}
                      alt={suggestion.recipe.title}
                      className="h-48 w-full object-cover"
                    />
                  )}
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-gray-900">{suggestion.recipe.title}</h3>
                    <p className="mt-2 text-gray-700">{suggestion.reason}</p>
                    {suggestion.matchedIngredients.length > 0 && (
                      <p className="mt-3 text-sm text-green-800">
                        <strong>Likely pantry matches:</strong> {suggestion.matchedIngredients.join(", ")}
                      </p>
                    )}
                    {suggestion.missingIngredients.length > 0 && (
                      <p className="mt-2 text-sm text-gray-700">
                        <strong>Still needed:</strong> {suggestion.missingIngredients.join(", ")}
                      </p>
                    )}
                    {suggestion.substitutionIdeas.length > 0 && (
                      <div className="mt-3 text-sm text-gray-700">
                        <strong>Possible swaps:</strong>
                        <ul className="mt-1 list-inside list-disc">
                          {suggestion.substitutionIdeas.map((idea) => <li key={idea}>{idea}</li>)}
                        </ul>
                      </div>
                    )}
                    <Link
                      to={`/recipes/${suggestion.recipe._id}`}
                      className="mt-4 inline-flex items-center gap-2 font-medium text-blue-700 hover:underline"
                    >
                      View recipe <FaArrowRight aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <div className="mt-8 text-center">
          <Link to="/meal-planner" className="inline-flex items-center gap-2 text-blue-700 hover:underline">
            <FaUtensils aria-hidden="true" /> Open meal planner
          </Link>
        </div>
      </div>
    </main>
  );
}
