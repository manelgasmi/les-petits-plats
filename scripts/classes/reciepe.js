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
        this.ustensiles = recipeData.ustensiles;
        this.image = recipeData.image;
    }
}