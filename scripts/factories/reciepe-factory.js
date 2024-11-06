import { Recipe } from "../classes/reciepe.js";

export class RecipeFactory {
  
  //convertir le json des recipes en array de classes Recipe
  getRecipes(recipesData) {
    return recipesData.map((recipe) => new Recipe(recipe));
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
      ingredients: ingredients,
      appliances: appliances,
      ustensils: ustensils,
    };
  }

  filterRecipes(recipes, filterChoices) {
    return recipes.filter((recipe) => {
        let searchTextMatch = false,
        ingredientsMatch = false,
        appliancesMatch = false,
        ustensilsMatch = false;

      //comparer le titre, la description et les ingrédients
      //par rapport au texte inséré dans la barre de recherche principale
      if (filterChoices.general) {
        const titleMatch = recipe.name
          .toLowerCase()
          .includes(filterChoices.general);
        if (titleMatch) {
          searchTextMatch = true;
        } else {
          const descriptionMatch = recipe.description
            .toLowerCase()
            .includes(filterChoices.general);
          if (descriptionMatch) {
            searchTextMatch = true;
          } else {
            const ingredientSearchtMatch = recipe.ingredients.filter((ingredient) =>
              ingredient.ingredient.toLowerCase().includes(filterChoices.general)
            )
            if (ingredientSearchtMatch) {
              searchTextMatch = true;
            }
          }
        }
      } else {
        searchTextMatch = true;
      }

      //comparer avec le filtre des ingrédients
      if (filterChoices.ingredients.length > 0) {
        ingredientsMatch = filterChoices.ingredients.every((ingredientName) =>
          recipe.ingredients.some(
            (ingredient) =>
              ingredient.ingredient.toLowerCase() === ingredientName
          )
        );
      // si auncun ingrédient n'est précisé dans le filtre
      } else {
        ingredientsMatch = true;
      }

      //comparer avec le filtre des appareils
      if (filterChoices.appliances.length > 0) {
        appliancesMatch = filterChoices.appliances.every(
          (applianceName) => recipe.appliance.toLowerCase() === applianceName
        );
     
      } else {
        appliancesMatch = true;
      }

      //comparer avec le filtre des ustensiles
      if (filterChoices.ustensils.length > 0) {
        ustensilsMatch = filterChoices.ustensils.every((ustensilName) =>
          recipe.ustensils.some(
            (ustensil) =>
                ustensil.toLowerCase() === ustensilName
          )
        );
      } else {
        ustensilsMatch = true;
      }

      //retourner le résultat des 4 filtres
      if (
        searchTextMatch &&
        ingredientsMatch &&
        ustensilsMatch &&
        appliancesMatch
      ) {
        return recipe;
      }
    });
  }
}
