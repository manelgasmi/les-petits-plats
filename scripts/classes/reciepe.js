import { Ingredient } from "./ingredient.js";

export class Recipe {
    constructor(recipeData) {
        this.id = recipeData.id;
        this.name = recipeData.name;
        this.servings = recipeData.servings;
        this.ingredients = recipeData.ingredients.map(ingredientData => new Ingredient(ingredientData) );
        this.time = recipeData.time;
        this.description = recipeData.description;
        this.appliance = recipeData.appliance;
        this.ustensils = recipeData.ustensils;
        this.image = recipeData.image;
    }
}