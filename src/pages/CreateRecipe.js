import axios from 'axios';
import React, { useState } from 'react'
import { useGetUserID } from '../hooks/useGetUserID';
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const CreateRecipe = () => {

  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"])


  const [recipe, setRecipe] = useState({
    name: "",
    ingredients: [],
    instructions: "",
    imageUrl: "",
    cookingTime: 0,
    userOwner: userID
  });

  const navigate = useNavigate();


 



  const handleChange = (event) => {
    const {name, value} = event.target;                           //for grabbing the name value from the input
    setRecipe({...recipe, [name]: value});    //we use the spread operator to keep recipe obj same as before and just updating the name field with the value we enter //so for name=name it will beupdated with the value we enter and for name = imageUrl it will be updated with the value we enter
  };


  //for changing the value of the ingredient which is already added //empty input
  const handleIngredientChange = (event, idx) => {
    const {value} = event.target;    
    const ingredients = recipe.ingredients;
    ingredients[idx]  = value;                    
    setRecipe({...recipe, ingredients: ingredients});    
  };



  //for adding an extra input field we set the recipe as before but add a empty " " to the ingredients array    
  const addIngredient = () => {
      setRecipe({...recipe, ingredients: [...recipe.ingredients, ""]})
  };



  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("https://lazy-erin-adder-robe.cyclic.app/recipes", recipe, {headers: {Authorization: cookies.access_token}});
      alert("Recipe created");
      navigate("/"); //for redirecting to the home page
    } catch (err) {
      console.error(err);
    }

  }


  return (
    <div className='create-recipe'>
      <h2>Create Recipe</h2>
      <form onSubmit={onSubmit}>
        <label htmlFor="name">Name</label>
        <input type="text" id='name' name='name' onChange={handleChange}/>

        <label htmlFor="ingredients">Ingredients</label>
        {recipe.ingredients.map((ingredient, idx) => (
          <input key={idx} type="text" name='ingredients' value={ingredient} onChange={(event) => handleIngredientChange(event, idx)} />
        ))}
        <button onClick={addIngredient} type="button">Add Ingredient</button>

        <label htmlFor="instructions">Instructions</label>
        <textarea name="instructions" id="instructions" onChange={handleChange}></textarea>

        <label htmlFor="imageUrl">Image URL</label>
        <input type="text" name="imageUrl" id="imageUrl" onChange={handleChange} />

        <label htmlFor="cookingTime">Cooking Time (minutes)</label>
        <input type="number" id='cookingTime' name='cookingTime' onChange={handleChange}/>

        <button type='submit'>Create Recipe</button>
      </form>
    </div>
  )
}

export default CreateRecipe