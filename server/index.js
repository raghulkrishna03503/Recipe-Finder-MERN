const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const SaveRecipeModel = require('./model/SaveRecipe');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/recipe");

app.post('/saveRecipe', (req, res) => {
    const { name, category, area, instructions, ingredients, measures, youtube, source, image } = req.body;
    SaveRecipeModel.create({ name, category, area, instructions, ingredients, measures, youtube, source, image })
        .then(() => res.json("Success"))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.get('/savedRecipes', (req, res) => {
    SaveRecipeModel.find()
        .then(recipes => res.json(recipes))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.listen(3001, () => {
    console.log("Server is running");
})
