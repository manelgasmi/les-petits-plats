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
    let filtredRecipes = [];
    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];
      let searchTextMatch = false,
        ingredientsMatch = false,
        appliancesMatch = false,
        ustensilsMatch = false;

      //comparer le titre, la description et les ingrédients
      //par rapport au texte inséré dans la barre de recherche principale
      if (filterChoices.general) {
        let titleMatch = recipe.name
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
            let ingredientSearchtMatch = false;
            let j = 0;
            while (j < recipe.ingredients.length && !ingredientSearchtMatch) {
              if (
                recipe.ingredients[j].ingredient
                  .toLowerCase()
                  .includes(filterChoices.general)
              ) {
                ingredientSearchtMatch = true;
              }
              j++;
            }
            if (ingredientSearchtMatch) {
              searchTextMatch = true;
            }
          }
        }

        // Si aucun texte de recherche n’est fourni
      } else {
        searchTextMatch = true;
      }

      //comparer avec le filtre des ingrédients
      if (filterChoices.ingredients.length > 0) {
        ingredientsMatch = true;
        for (let e = 0; e < filterChoices.ingredients.length; e++) {
          let ingredientFound = false;
          for (let f = 0; f < recipe.ingredients.length; f++) {
            if (
              recipe.ingredients[f].ingredient.toLowerCase() ===
              filterChoices.ingredients[e].toLowerCase()
            ) {
              ingredientFound = true;
              break;
            }
          }

          if (!ingredientFound) {
            ingredientsMatch = false;
            break;
          }
        }
      } else {
        ingredientsMatch = true;
      }

      //comparer avec le filtre des appareils
      if (filterChoices.appliances.length > 0) {
        appliancesMatch = true;
        let l = 0;
        while (l < filterChoices.appliances.length && appliancesMatch) {
          if (
            recipe.appliance.toLowerCase() !==
            filterChoices.appliances[l].toLowerCase()
          ) {
            appliancesMatch = false;
          }
          l++;
        }
      } else {
        appliancesMatch = true;
      }

      //comparer avec le filtre des ustensiles
      if (filterChoices.ustensils.length > 0) {
        ustensilsMatch = true;
        let m = 0;
        while (m < filterChoices.ustensils.length && ustensilsMatch) {
          if (
            !recipe.ustensils.includes(filterChoices.ustensils[m].toLowerCase())
          ) {
            ustensilsMatch = false;
          }
          m++;
        }
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
        filtredRecipes.push(recipe);
      }
    }
    return filtredRecipes;
  }
}
