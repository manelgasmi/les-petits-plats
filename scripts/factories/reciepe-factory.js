import { Recipe } from "../classes/reciepe.js";

export class RecipeFactory {
    //convertir le json des recipes en array de classes Recipe
    getRecipes(recipesData) {
        return recipesData.map(recipe => new Recipe(recipe));
    }
  
    getAppliances(recipes) {
        const appliances = [];
        recipes.forEach(recipe => {
            if(!appliances.includes(recipe.appliance)) {
                appliances.push(recipe.appliance);
            }
        })
        return appliances;
    }  

   // getIngredients (recipes) {
    //    const ingredients = [];
     //   recipes.forEach(recipe => {
     //       if(!ingredients.includes(recipe.ingredient)) {
    //            ingredients.push(recipe.ingredient);
   //         }
   // })
    //    return ingredients;
        
   // }
    
}

