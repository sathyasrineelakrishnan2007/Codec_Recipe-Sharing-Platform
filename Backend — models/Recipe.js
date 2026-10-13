const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100
    },
    description: {
      type: String,
      required: true,
      maxlength: 500
    },
    ingredients: {
      type: [String],
      required: true,
      validate: value => value.length > 0
    },
    instructions: {
      type: [String],
      required: true,
      validate: value => value.length > 0
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Breakfast",
        "Lunch",
        "Dinner",
        "Snack",
        "Dessert",
        "Other"
      ]
    },
    prepTime: {
      type: Number,
      required: true,
      min: 1,
      max: 1440
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", recipeSchema);
