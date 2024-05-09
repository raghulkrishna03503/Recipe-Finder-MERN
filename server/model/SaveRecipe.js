const mongoose = require("mongoose")

const saveRecipeSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    category: {
      type: String
    },
    area: {
      type: String
    },
    instructions: {
      type: String
    },
    ingredients: [{
      type: String
    }],
    measures: [{
      type: String
    }],
    youtube: {
      type: String
    },
    source: {
      type: String
    }
  });

const SaveRecipeModel = mongoose.model("saved_recipes", saveRecipeSchema)

module.exports = SaveRecipeModel