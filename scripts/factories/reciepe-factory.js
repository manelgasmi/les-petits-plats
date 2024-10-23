import { Recipe } from "../classes/reciepe.js";

export class RecipeFactory {
  //convertir le json des recipes en array de classes Recipe
  getRecipes(recipesData) {
    return recipesData.map((recipe) => new Recipe(recipe));
  }

  getAppliances(recipes) {
    const appliances = [];
    recipes.forEach((recipe) => {
      if (!appliances.includes(recipe.appliance)) {
        appliances.push(recipe.appliance);
      }
    });
    return appliances;
  }

  getIngredients(recipes) {
    const ingredients = [];
    recipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        if (!ingredients.includes(ingredient.ingredient)) {
          ingredients.push(ingredient.ingredient);
        }
      });
    });

    return ingredients;
  }

  getFilters(recipes) {
    const ingredients = [];
    const appliances = [];
    const ustensils = [];

    recipes.forEach((recipe) => {
      //remplissage des ingredients
      recipe.ingredients.forEach((ingredient) => {
        if (!ingredients.includes(ingredient.ingredient)) {
          ingredients.push(ingredient.ingredient.toLowerCase());
        }
      });
      //remplissage des appareils
      if (!appliances.includes(recipe.appliance)) {
        appliances.push(recipe.appliance.toLowerCase());
      }

      //remplissage des ustensils
      recipe.ustensils.forEach((ustensil) => {
        if (!ustensils.includes(ustensil)) {
            ustensils.push(ustensil.toLowerCase());
        }
      });

    });

    return {
        ingredients : ingredients,
        appliances: appliances, 
        ustensils: ustensils
    };
  }
}
