import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [filterByArea, setFilterByArea] = useState('');
  const [areaOptions, setAreaOptions] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [showCollection, setShowCollection] = useState(false); // State to toggle showing collection

  useEffect(() => {
    const areas = searchResults.reduce((acc, recipe) => {
      if (recipe.strArea && !acc.includes(recipe.strArea)) {
        acc.push(recipe.strArea);
      }
      return acc;
    }, []);
    setAreaOptions(areas);
  }, [searchResults]);

  useEffect(() => {
    if (showCollection) {
      fetchSavedRecipes(); // Fetch saved recipes when showCollection is true
    }
  }, [showCollection]);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchButtonClick = () => {
    setShowCollection(false);
    if (searchQuery.trim() !== '') {
      fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + searchQuery)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setSearchResults(data.meals || []);
          setError(null);
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
          setError('There was a problem fetching recipes. Please try again later.');
        });
    }
  };

  const handleCollectionButtonClick = () => {
    setShowCollection(true); // Set showCollection to true when viewing collection
  };

  const handleFilterChange = (e) => {
    setFilterByArea(e.target.value);
  };

  const handleFilterButtonClick = () => {
    if (filterByArea) {
      const filteredResults = searchResults.filter(recipe => recipe.strArea === filterByArea);
      setSearchResults(filteredResults);
    }
  };

  const handleSortByIngredientClick = () => {
    const sortedResults = [...searchResults].sort((a, b) => {
      const totalIngredientsA = countIngredients(a);
      const totalIngredientsB = countIngredients(b);
      return totalIngredientsA - totalIngredientsB;
    });
    setSearchResults(sortedResults);
  };

  const countIngredients = (recipe) => {
    let count = 0;
    for (let i = 1; i <= 20; i++) {
      const ingredientKey = `strIngredient${i}`;
      if (recipe[ingredientKey]) {
        count++;
      }
    }
    return count;
  };

  const handleSaveButtonClick = (recipe) => {
    console.log(`Recipe "${recipe.strMeal}" saved!`);
    axios.post('http://localhost:3001/saveRecipe', {
        name: recipe.strMeal,
        category: recipe.strCategory,
        area: recipe.strArea,
        instructions: recipe.strInstructions,
        ingredients: Object.entries(recipe)
          .filter(([key, value]) => key.startsWith("strIngredient") && value)
          .map(([key, value]) => value),
        measures: Object.entries(recipe)
          .filter(([key, value]) => key.startsWith("strMeasure") && value)
          .map(([key, value]) => value),
        youtube: recipe.strYoutube,
        source: recipe.strSource,
        image: recipe.strMealThumb
      })
      .then(result => {
        if (result.statusText === "OK"){
          window.alert("Successfully added to collection");
          fetchSavedRecipes();
        }
      })
      .catch(err => console.log(err))
  };
  

  const fetchSavedRecipes = () => {
    axios.get('http://localhost:3001/savedRecipes')
      .then(response => {
        console.log(response.data);
        setSavedRecipes(response.data);
      })
      .catch(error => {
        console.error('Error fetching saved recipes:', error);
      });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Recipe Finder</h1>
      <div className="glass-container p-4 rounded shadow">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter recipe name"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
          <button className="btn btn-primary" onClick={handleSearchButtonClick}>Search</button>
          <button className="btn btn-secondary" onClick={handleCollectionButtonClick}>My Collection</button>
        </div>
        <hr />
        {error && <div className="alert alert-danger">{error}</div>}
        {!showCollection && searchResults.length > 0 && (
          <div>
            <div className="mb-3">
              <select className="form-select" value={filterByArea} onChange={handleFilterChange}>
                <option value="">Filter by Area</option>
                {areaOptions.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
              <hr />
              <button className="btn btn-info ms-2" onClick={handleFilterButtonClick}>Filter</button>
              &nbsp;&nbsp;&nbsp;
              <button className="btn btn-info" onClick={handleSortByIngredientClick}>Sort by Ingredients</button>
            </div>
            <h2 className="text-center mb-4">Search Results:</h2>
            {searchResults.map(recipe => (
              <div key={recipe.idMeal} className="glass-card mb-4 rounded shadow">
                <img src={recipe.strMealThumb} alt={recipe.strMeal} className="rounded-top" style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }} />
                <div className="p-3">
                  <h5 className="mt-0">{recipe.strMeal}</h5>
                  <p>Category: {recipe.strCategory}</p>
                  <p>Area: {recipe.strArea}</p>
                  <p>Instructions: {recipe.strInstructions}</p>
                  <p>Ingredients:</p>
                  <ul>
                    {Object.entries(recipe).map(([key, value]) => {
                      if (value && key.startsWith("strIngredient")) {
                        const ingredientNumber = key.replace("strIngredient", "");
                        const measureKey = `strMeasure${ingredientNumber}`;
                        const measure = recipe[measureKey];
                        return (
                          <li key={key}>
                            {value} - {measure}
                          </li>
                        );
                      }
                      return null;
                    })}
                  </ul>
                  {recipe.strYoutube && (
                    <p>
                      <a href={recipe.strYoutube}>Watch on YouTube</a>
                    </p>
                  )}
                  {recipe.strSource && (
                    <p>
                      <a href={recipe.strSource}>Source</a>
                    </p>
                  )}
                  <button className="btn btn-success" onClick={() => handleSaveButtonClick(recipe)}>Save Recipe to Collection</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {showCollection && savedRecipes.length > 0 && (
          <div>
            <h2 className="text-center mb-4">My Collection:</h2>
            {savedRecipes.map(recipe => (
              <div key={recipe._id} className="glass-card mb-4 rounded shadow">
                <img src={recipe.image} alt={recipe.name} className="rounded-top" style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }} />
                <div className="p-3">
                  <h5 className="mt-0">{recipe.name}</h5>
                  <p>Category: {recipe.category}</p>
                  <p>Area: {recipe.area}</p>
                  <p>Instructions: {recipe.instructions}</p>
                  <p>Ingredients:</p>
                  <ul>
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient} - {recipe.measures[index]}</li>
                    ))}
                  </ul>
                  {recipe.youtube && (
                    <p>
                      <a href={recipe.youtube}>Watch on YouTube</a>
                    </p>
                  )}
                  {recipe.source && (
                    <p>
                      <a href={recipe.source}>Source</a>
                    </p>
                  )}
                  {/* Add any other details you want to display */}
                </div>
              </div>
            ))}
          </div>
        )}
        {showCollection && savedRecipes.length === 0 && (
          <p className="text-center">No recipes saved in your collection.</p>
        )}
        {!showCollection && searchResults.length === 0 && searchQuery.trim() !== '' && (
          <p className="text-center">No recipes found.</p>
        )}
      </div>
    </div>
  );
}

export default App;
