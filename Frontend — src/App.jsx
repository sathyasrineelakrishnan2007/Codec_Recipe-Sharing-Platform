import { useEffect, useState } from "react";
import "./styles.css";

const API = "http://localhost:5001/api/recipes";

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [category, setCategory] = useState("Dinner");
  const [prepTime, setPrepTime] = useState(30);
  const [message, setMessage] = useState("");

  async function loadRecipes(query = "") {
    try {
      const response = await fetch(
        `${API}?search=${encodeURIComponent(query)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load recipes");
      }

      setRecipes(data.recipes);
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    loadRecipes();
  }, []);

  async function addRecipe(e) {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          description,
          ingredients: ingredients
            .split("\n")
            .map(item => item.trim())
            .filter(Boolean),
          instructions: instructions
            .split("\n")
            .map(item => item.trim())
            .filter(Boolean),
          category,
          prepTime: Number(prepTime)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to add recipe");
      }

      setTitle("");
      setDescription("");
      setIngredients("");
      setInstructions("");
      setMessage("Recipe added successfully!");

      await loadRecipes(search);
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main className="container">
      <h1>Recipe Sharing Platform</h1>

      <form
        onSubmit={e => {
          e.preventDefault();
          loadRecipes(search);
        }}
      >
        <input
          placeholder="Search recipes"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button>Search</button>
      </form>

      <h2>Share Your Recipe</h2>

      <form onSubmit={addRecipe}>
        <input
          placeholder="Recipe title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />

        <textarea
          placeholder="Ingredients (one per line)"
          value={ingredients}
          onChange={e => setIngredients(e.target.value)}
          required
        />

        <textarea
          placeholder="Instructions (one per line)"
          value={instructions}
          onChange={e => setInstructions(e.target.value)}
          required
        />

        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
          <option>Snack</option>
          <option>Dessert</option>
          <option>Other</option>
        </select>

        <input
          type="number"
          min="1"
          max="1440"
          value={prepTime}
          onChange={e => setPrepTime(e.target.value)}
          required
        />

        <button type="submit">Add Recipe</button>
      </form>

      {message && <p>{message}</p>}

      <h2>Available Recipes</h2>

      {recipes.map(recipe => (
        <article className="recipe" key={recipe._id}>
          <h3>{recipe.title}</h3>
          <p>{recipe.description}</p>
          <p>Category: {recipe.category}</p>
          <p>Preparation: {recipe.prepTime} minutes</p>

          <h4>Ingredients</h4>
          <ul>
            {recipe.ingredients.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h4>Instructions</h4>
          <ol>
            {recipe.instructions.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </article>
      ))}
    </main>
  );
      }
