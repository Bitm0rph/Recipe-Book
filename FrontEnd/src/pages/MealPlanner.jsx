import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaPen,
  FaPlus,
  FaShoppingBasket,
  FaTrash,
  FaTimes,
} from "react-icons/fa";
import { getAllRecipes } from "../services/recipes";
import {
  addShoppingItem,
  createMealPlan,
  deleteMealPlan,
  deleteShoppingItem,
  generateShoppingList,
  getMealPlans,
  getShoppingList,
  updateShoppingItem,
} from "../services/mealPlanner";

const mealTypes = ["breakfast", "lunch", "dinner", "snack"];
const mealLabels = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

const toDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const fromDateKey = (dateKey) => new Date(`${dateKey}T12:00:00`);

const addDays = (dateKey, amount) => {
  const date = fromDateKey(dateKey);
  date.setDate(date.getDate() + amount);
  return toDateKey(date);
};

const getMonday = (date) => {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return toDateKey(monday);
};

const formatDate = (dateKey, options = { weekday: "short", month: "short", day: "numeric" }) =>
  new Intl.DateTimeFormat(undefined, options).format(fromDateKey(dateKey));

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || fallback;

export default function MealPlanner() {
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => getMonday(new Date()));
  const [recipes, setRecipes] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [shoppingList, setShoppingList] = useState({ items: [] });
  const [recipeLoading, setRecipeLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [recipeId, setRecipeId] = useState("");
  const [mealType, setMealType] = useState("dinner");
  const [addingMeal, setAddingMeal] = useState(false);
  const [generatingList, setGeneratingList] = useState(false);
  const [addingItem, setAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [busyItemId, setBusyItemId] = useState("");
  const [editingItemId, setEditingItemId] = useState("");
  const [editItem, setEditItem] = useState({ name: "", quantity: "" });

  const weekEnd = addDays(weekStart, 6);
  const weekDays = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));

  useEffect(() => {
    let isCurrent = true;

    const loadRecipes = async () => {
      try {
        const firstPage = await getAllRecipes(1, 100);
        const pages = [firstPage];
        for (let page = 2; page <= firstPage.totalPages; page += 1) {
          pages.push(await getAllRecipes(page, 100));
        }
        if (isCurrent) setRecipes(pages.flatMap((page) => page.data || []));
      } catch (loadError) {
        console.error("Failed to load recipes for the meal planner", loadError);
        if (isCurrent) setActionError(getErrorMessage(loadError, "Failed to load recipes."));
      } finally {
        if (isCurrent) setRecipeLoading(false);
      }
    };

    loadRecipes();
    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    let isCurrent = true;
    setLoading(true);
    setError("");

    Promise.all([
      getMealPlans(weekStart, weekEnd),
      getShoppingList(weekStart),
    ])
      .then(([plans, list]) => {
        if (!isCurrent) return;
        setMealPlans(plans);
        setShoppingList(list);
      })
      .catch((loadError) => {
        console.error("Failed to load meal planner data", loadError);
        if (isCurrent) setError(getErrorMessage(loadError, "Failed to load this week's plan."));
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [weekStart, weekEnd]);

  const changeWeek = (offset) => {
    const nextWeek = addDays(weekStart, offset * 7);
    setWeekStart(nextWeek);
    setSelectedDate(nextWeek);
  };

  const handleAddMeal = async (event) => {
    event.preventDefault();
    if (!recipeId) return;

    setAddingMeal(true);
    setActionError("");
    try {
      const newPlan = await createMealPlan({ recipeId, date: selectedDate, mealType });
      setMealPlans((previous) => [...previous, newPlan]);
      setRecipeId("");
    } catch (addError) {
      console.error("Failed to add meal plan entry", addError);
      setActionError(getErrorMessage(addError, "Failed to add this recipe to the plan."));
    } finally {
      setAddingMeal(false);
    }
  };

  const handleRemoveMeal = async (planId) => {
    setActionError("");
    try {
      await deleteMealPlan(planId);
      setMealPlans((previous) => previous.filter((plan) => plan._id !== planId));
    } catch (removeError) {
      console.error("Failed to remove meal plan entry", removeError);
      setActionError(getErrorMessage(removeError, "Failed to remove the planned meal."));
    }
  };

  const handleGenerateList = async () => {
    setGeneratingList(true);
    setActionError("");
    try {
      setShoppingList(await generateShoppingList(weekStart));
    } catch (generateError) {
      console.error("Failed to generate shopping list", generateError);
      setActionError(getErrorMessage(generateError, "Failed to generate the shopping list."));
    } finally {
      setGeneratingList(false);
    }
  };

  const handleAddShoppingItem = async (event) => {
    event.preventDefault();
    if (!newItemName.trim()) return;

    setAddingItem(true);
    setActionError("");
    try {
      const list = await addShoppingItem(weekStart, {
        name: newItemName.trim(),
        quantity: newItemQuantity.trim(),
      });
      setShoppingList(list);
      setNewItemName("");
      setNewItemQuantity("");
    } catch (addError) {
      console.error("Failed to add shopping list item", addError);
      setActionError(getErrorMessage(addError, "Failed to add shopping list item."));
    } finally {
      setAddingItem(false);
    }
  };

  const handleUpdateShoppingItem = async (itemId, updates) => {
    setBusyItemId(itemId);
    setActionError("");
    try {
      setShoppingList(await updateShoppingItem(weekStart, itemId, updates));
      if (itemId === editingItemId) setEditingItemId("");
    } catch (updateError) {
      console.error("Failed to update shopping list item", updateError);
      setActionError(getErrorMessage(updateError, "Failed to update shopping list item."));
    } finally {
      setBusyItemId("");
    }
  };

  const handleDeleteShoppingItem = async (itemId) => {
    setBusyItemId(itemId);
    setActionError("");
    try {
      setShoppingList(await deleteShoppingItem(weekStart, itemId));
    } catch (deleteError) {
      console.error("Failed to delete shopping list item", deleteError);
      setActionError(getErrorMessage(deleteError, "Failed to remove shopping list item."));
    } finally {
      setBusyItemId("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meal Planner</h1>
            <p className="mt-1 text-gray-600">Plan the week and keep your shopping list in sync.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded border bg-white p-2 text-gray-700 hover:bg-gray-50"
              aria-label="Previous week"
              onClick={() => changeWeek(-1)}
            >
              <FaArrowLeft />
            </button>
            <span className="min-w-40 text-center font-medium text-gray-800">
              {formatDate(weekStart, { month: "short", day: "numeric" })} –{" "}
              {formatDate(weekEnd, { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <button
              type="button"
              className="rounded border bg-white p-2 text-gray-700 hover:bg-gray-50"
              aria-label="Next week"
              onClick={() => changeWeek(1)}
            >
              <FaArrowRight />
            </button>
            <button
              type="button"
              className="rounded border bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => {
                const currentWeek = getMonday(new Date());
                setWeekStart(currentWeek);
                setSelectedDate(currentWeek);
              }}
            >
              This week
            </button>
          </div>
        </div>

        {actionError && <p className="mb-4 rounded bg-red-50 p-3 text-red-700" role="alert">{actionError}</p>}
        {error && <p className="mb-4 rounded bg-red-50 p-3 text-red-700" role="alert">{error}</p>}

        <section className="mb-8 rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Add a meal</h2>
          <form className="grid gap-3 md:grid-cols-4" onSubmit={handleAddMeal}>
            <label className="text-sm font-medium text-gray-700">
              Day
              <select
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="mt-1 block w-full rounded border p-2"
              >
                {weekDays.map((date) => (
                  <option key={date} value={date}>{formatDate(date)}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-gray-700">
              Meal
              <select
                value={mealType}
                onChange={(event) => setMealType(event.target.value)}
                className="mt-1 block w-full rounded border p-2"
              >
                {mealTypes.map((type) => (
                  <option key={type} value={type}>{mealLabels[type]}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-gray-700">
              Recipe
              <select
                required
                value={recipeId}
                onChange={(event) => setRecipeId(event.target.value)}
                className="mt-1 block w-full rounded border p-2"
                disabled={recipeLoading || recipes.length === 0}
              >
                <option value="">{recipeLoading ? "Loading recipes..." : "Select a recipe"}</option>
                {recipes.map((recipe) => (
                  <option key={recipe._id} value={recipe._id}>{recipe.title}</option>
                ))}
              </select>
            </label>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={addingMeal || recipeLoading || recipes.length === 0}
                className="inline-flex w-full items-center justify-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                <FaPlus /> {addingMeal ? "Adding..." : "Add to plan"}
              </button>
            </div>
          </form>
          {!recipeLoading && recipes.length === 0 && (
            <p className="mt-3 text-sm text-gray-600">There are no recipes to plan yet.</p>
          )}
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">This week</h2>
          {loading ? (
            <p className="rounded bg-white p-6 text-center text-gray-600">Loading your plan...</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {weekDays.map((date) => (
                <article key={date} className="rounded-xl border bg-white p-4 shadow-sm">
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">{formatDate(date, { weekday: "long", month: "short", day: "numeric" })}</h3>
                  <div className="space-y-4">
                    {mealTypes.map((type) => {
                      const plans = mealPlans.filter((plan) => plan.date === date && plan.mealType === type);
                      return (
                        <div key={type}>
                          <h4 className="mb-1 text-sm font-semibold uppercase tracking-wide text-gray-500">{mealLabels[type]}</h4>
                          {plans.length === 0 ? (
                            <p className="text-sm text-gray-400">Nothing planned</p>
                          ) : (
                            <ul className="space-y-2">
                              {plans.map((plan) => (
                                <li key={plan._id} className="flex items-center justify-between gap-2 rounded bg-gray-50 px-3 py-2">
                                  {plan.recipe ? (
                                    <Link to={`/recipes/${plan.recipe._id}`} className="min-w-0 truncate text-blue-700 hover:underline">
                                      {plan.recipe.title}
                                    </Link>
                                  ) : (
                                    <span className="text-sm text-gray-500">Recipe no longer available</span>
                                  )}
                                  <button
                                    type="button"
                                    aria-label="Remove planned recipe"
                                    title="Remove from plan"
                                    className="shrink-0 rounded p-2 text-red-600 hover:bg-red-50"
                                    onClick={() => handleRemoveMeal(plan._id)}
                                  >
                                    <FaTrash />
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                <FaShoppingBasket className="text-blue-600" /> Shopping list
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Planned ingredients are grouped by name. Quantities remain as entered in each recipe.
              </p>
            </div>
            <button
              type="button"
              disabled={generatingList || loading}
              onClick={handleGenerateList}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {generatingList ? "Building list..." : "Build / refresh from plan"}
            </button>
          </div>

          <form className="mb-5 grid gap-2 sm:grid-cols-[1fr_1fr_auto]" onSubmit={handleAddShoppingItem}>
            <input
              required
              value={newItemName}
              onChange={(event) => setNewItemName(event.target.value)}
              className="rounded border p-2"
              placeholder="Add an item"
              aria-label="Shopping item name"
            />
            <input
              value={newItemQuantity}
              onChange={(event) => setNewItemQuantity(event.target.value)}
              className="rounded border p-2"
              placeholder="Quantity (optional)"
              aria-label="Shopping item quantity"
            />
            <button
              type="submit"
              disabled={addingItem}
              className="inline-flex items-center justify-center gap-2 rounded border border-blue-600 px-4 py-2 text-blue-700 hover:bg-blue-50 disabled:opacity-60"
            >
              <FaPlus /> Add item
            </button>
          </form>

          {shoppingList.items?.length ? (
            <ul className="divide-y">
              {shoppingList.items.map((item) => (
                <li key={item._id} className="flex flex-wrap items-center gap-3 py-3">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    disabled={busyItemId === item._id}
                    onChange={(event) => handleUpdateShoppingItem(item._id, { checked: event.target.checked })}
                    aria-label={`Mark ${item.name} as ${item.checked ? "not purchased" : "purchased"}`}
                    className="h-4 w-4"
                  />
                  {editingItemId === item._id ? (
                    <>
                      <input
                        value={editItem.name}
                        onChange={(event) => setEditItem({ ...editItem, name: event.target.value })}
                        className="min-w-32 flex-1 rounded border p-2"
                        aria-label="Edit item name"
                      />
                      <input
                        value={editItem.quantity}
                        onChange={(event) => setEditItem({ ...editItem, quantity: event.target.value })}
                        className="min-w-32 flex-1 rounded border p-2"
                        aria-label="Edit item quantity"
                      />
                      <button
                        type="button"
                        className="rounded p-2 text-green-700 hover:bg-green-50"
                        aria-label="Save item"
                        disabled={busyItemId === item._id}
                        onClick={() => handleUpdateShoppingItem(item._id, editItem)}
                      >
                        <FaCheck />
                      </button>
                      <button
                        type="button"
                        className="rounded p-2 text-gray-600 hover:bg-gray-100"
                        aria-label="Cancel editing"
                        onClick={() => setEditingItemId("")}
                      >
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className={`min-w-32 flex-1 ${item.checked ? "text-gray-400 line-through" : "text-gray-800"}`}>
                        {item.name}
                        {item.source === "custom" && <span className="ml-2 text-xs text-gray-400">Custom</span>}
                      </span>
                      <span className={`flex-1 text-sm ${item.checked ? "text-gray-400 line-through" : "text-gray-600"}`}>
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="rounded p-2 text-blue-700 hover:bg-blue-50"
                        aria-label={`Edit ${item.name}`}
                        onClick={() => {
                          setEditingItemId(item._id);
                          setEditItem({ name: item.name, quantity: item.quantity || "" });
                        }}
                      >
                        <FaPen />
                      </button>
                      <button
                        type="button"
                        className="rounded p-2 text-red-600 hover:bg-red-50"
                        aria-label={`Remove ${item.name}`}
                        disabled={busyItemId === item._id}
                        onClick={() => handleDeleteShoppingItem(item._id)}
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded bg-gray-50 p-4 text-center text-gray-600">
              Your list is empty. Build it from this week’s plan or add items above.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
