const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Recipe = require("./models/Recipe");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/recipes", async (req, res) => {
  try {
    const search = String(req.query.search || "").trim();

    const filter = {};

    if (search) {
      const escaped = search.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      filter.$or = [
        { title: { $regex: escaped, $options: "i" } },
        { description: { $regex: escaped, $options: "i" } },
        { ingredients: { $regex: escaped, $options: "i" } }
      ];
    }

    const recipes = await Recipe.find(filter)
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ recipes });
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch recipes"
    });
  }
});

app.post("/api/recipes", async (req, res) => {
  try {
    const recipe = await Recipe.create({
      title: req.body.title,
      description: req.body.description,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      category: req.body.category,
      prepTime: Number(req.body.prepTime)
    });

    res.status(201).json({ recipe });
  } catch (error) {
    res.status(400).json({
      message: "Invalid recipe data. Please check all fields."
    });
  }
});

mongoose
  .connect(
    process.env.MONGODB_URI ||
    "mongodb://127.0.0.1:27017/recipe_sharing"
  )
  .then(() => {
    app.listen(5001, () => {
      console.log("Recipe backend running on port 5001");
    });
  })
  .catch(error => {
    console.error("MongoDB connection failed:", error.message);
  });
