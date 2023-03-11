import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios';
import { useGetUserID } from '../hooks/useGetUserID';
import { useCookies } from "react-cookie";

const Home = () => {

  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [cookies, _] = useCookies(["access_token"]);



  const userID = useGetUserID();

  useEffect(() => {

    const fetchRecipe = async () => {
      try {
       const response = await axios.get("https://lazy-erin-adder-robe.cyclic.app/recipes");
       setRecipes(response.data);
      } catch (err) {
        console.error(err);
      }
    };


    const fetchSavedRecipes = async () => {
      try {
       const response = await axios.get(`https://lazy-erin-adder-robe.cyclic.app/recipes/savedRecipes/ids/${userID}`);
       setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.error(err);
      }
    }

    fetchRecipe();

    if(cookies.access_token) fetchSavedRecipes();

  }, []);


  const saveRecipe = async (recipeID) => {
    try {
      const response = await axios.put("https://lazy-erin-adder-robe.cyclic.app/recipes", {recipeID, userID}, {headers: {Authorization: cookies.access_token}});
      setSavedRecipes(response.data.savedRecipes);
     } catch (err) {
       console.error(err);
     }
  };

  const isRecipeSaved = (id) => savedRecipes.includes(id); //return a boolean



  return (
    <div>
      <h1>Recipes</h1>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe._id}>
            
            <div>
              <h2>{recipe.name}</h2>
              <button onClick={() => saveRecipe(recipe._id)} disabled={isRecipeSaved(recipe._id)}>
              {isRecipeSaved(recipe._id) ? "Saved" : "Save"}  </button>
            </div>

            <div className='instructions'>
              <p>{recipe.instructions}</p>
            </div>

            <img src={recipe.imageUrl} alt={recipe.name} />

            <p>cooking Time: {recipe.cookingTime} (minutes)</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Home