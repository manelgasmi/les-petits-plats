import { recipesData } from "./recipes.js";
import { Recipe } from "./classes/reciepe.js";
import { Ingredient } from "./classes/ingredient.js";
import { RecipeFactory } from "./factories/reciepe-factory.js";

class App {
  init() {
    // récuperer la liste des Recipes
    const recipeFactory = new RecipeFactory();
    const recipes = recipeFactory.getRecipes(recipesData);
    console.log(recipes);

    // afficher les recettes
    this.buildRecipes(recipes);

    this.buildfilters(recipes);
  }

  buildRecipes(recipes) {
    const recipesContainer = document.querySelector(".recipes .row");
    recipes.forEach((recipe) => {
      const article = document.createElement("article");
      article.classList = "col-lg-4 col-sm-6 mb-5";
      article.innerHTML = `
                <div class="card">
                    <span class="position-absolute badge rounded-pill text-bg-warning">${recipe.time} min</span>
                    <div class="card-header p-0">
                        <img
                        class="card-img-top"
                        src="./assets/images/recettes/${recipe.image}"
                        alt="Card image cap"
                        />
                    </div>
                    <div class="card-body fs-14">
                        <h5 class="card-title my-3">${recipe.name}</h5>
                        <p class="card-subtitle mt-4 mb-2 text-muted text-uppercase">
                        Recette
                        </p>
                        <p class="card-text">
                        ${recipe.description}
                        </p>

                        <p class="card-subtitle mt-4 mb-2 text-muted text-uppercase">
                        Ingrédients
                        </p>
                        <div class="row ingredients-container"></div>
                    </div>
                </div>`;
      const ingredientsContainer = article.querySelector(
        ".ingredients-container"
      );
      const ingredientsElements = this.buildIngredients(recipe.ingredients);
      ingredientsElements.forEach((ingredientsElement) => {
        ingredientsContainer.appendChild(ingredientsElement);
      });

      recipesContainer.appendChild(article);
    });
  }

  buildIngredients(ingredients) {
    const ingredientsElements = [];
    ingredients.forEach((ingredient) => {
        //transformer la valeur de Unit en chaine vide si c'est undefined
        if (ingredient.unit === undefined) {
          ingredient.unit = "";
        }
        //transformer la valeur de quantity en chaine vide si c'est undefined
        if (ingredient.quantity === undefined) {
          ingredient.quantity = "-";
        }

      const ingredientCard = document.createElement("div");
      ingredientCard.classList.add("col-6", "mb-4");
      ingredientCard.innerHTML = `<span class="fs-6 fw-bold">${ingredient.ingredient}</span>
        <br />
        <span class="fs-6 text-black-50">${ingredient.quantity} ${ingredient.unit}</span>`;
      ingredientsElements.push(ingredientCard);
    });
    return ingredientsElements;
  }

  buildfilters(recipes) {
    // récupérer la liste des Recipes
    const recipeFactory = new RecipeFactory();
    const appliances = recipeFactory.getAppliances(recipes);
    console.log(appliances);
    
    // const ustensils = recipeFactory.getUstensils(recipes);
    // const ingredients = recipeFactory.getIngredients(recipes);
  }
}

const app = new App();
app.init();
