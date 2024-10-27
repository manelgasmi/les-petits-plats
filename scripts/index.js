import { recipesData } from "./recipes.js";
import { Recipe } from "./classes/reciepe.js";
import { Ingredient } from "./classes/ingredient.js";
import { RecipeFactory } from "./factories/reciepe-factory.js";
import { Filter } from "./classes/filter.js";

class App {
  filterChoices = null;
  recipes = [];
  filterNames = ["ingredients", "appliances", "ustensils"];

  constructor() {
    // récuperer la liste des Recipes
    const recipeFactory = new RecipeFactory();
    this.recipes = recipeFactory.getRecipes(recipesData);
    this.filterChoices = new Filter();
  }

  init() {

    // récupérer les valeurs des filtres
    const recipeFactory = new RecipeFactory();
    const filtersData = recipeFactory.getFilters(this.recipes);

    // afficher les recettes
    this.buildRecipes(this.recipes);

    // construire les filtres
    this.buildfilters(this.recipes);

    // ajouter le listner sur le click des boutons pour ouvrir les menus
    this.initFilterButtonAction();

    // ajouter le listner sur le input de la recherche generale
    this.initGeneralSearchAction();

    //ajouter le listner sur les champs de recherche des menus du filtre
    this.initFilterSearchAction(filtersData, this.recipes);

    // ajouter le listner sur le click sur les éléments des menus des filtres (choix des ingredients, ...)
    this.initFilterChoiceAction();

   
  }

  // ajouter les recipes dans le DOM
  buildRecipes(recipes) {
    const recipesContainer = document.querySelector(".recipes .row");
    recipesContainer.innerHTML = "";
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

  // construire les éléments html pour les ingredients dans la recette
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
    // récupérer les valeurs des filtres
    const recipeFactory = new RecipeFactory();
    const filtersData = recipeFactory.getFilters(recipes);

    this.filterNames.forEach((filterName) => {
      this.buildFilter(filtersData[filterName], filterName);
    });
  }

  buildFilter(values, menuName) {
    const menuElement = document.querySelector(
      `.${menuName}-menu .dropdown-menu-items`
    );
    menuElement.innerHTML = "";
    const uniqueValues = [...new Set(values)]; // supprimer les doublons des items

    uniqueValues.forEach((value) => {
      const menuItem = document.createElement("a");
      menuItem.classList.add("dropdown-item");
      menuItem.setAttribute("href", "#filters");
      menuItem.dataset.filterName = menuName;
      menuItem.textContent = value;
      menuElement.appendChild(menuItem);
    });
  }

  initFilterChoiceAction() {
    const selectItems = document.querySelectorAll(".dropdown-item");
    selectItems.forEach((selectItem) => {
      selectItem.addEventListener("click", (event) => {
        const clickedValue = event.target.textContent.toLowerCase();
        const filterName = event.target.dataset.filterName;

        // ajouter le choix dans l'array de filterChoices
        if (!this.filterChoices[filterName].includes(clickedValue)) {
          this.filterChoices[filterName].push(clickedValue);
        }

        //cacher le menu
        const dropdownMenu = event.target.closest(".dropdown-menu");
        dropdownMenu.style.display = "none";

        this.whenFilterChanged();
        
      });
      
    });
    
  }
 

  // afficher / cacher les menus des filtres
  initFilterButtonAction() {
    const filtersButtons = document.querySelectorAll(".filter-button");
    filtersButtons.forEach((filtersButton) => {
      filtersButton.addEventListener("click", (event) => {
        this.closeAllDropdowns();

        const dopdownMenu = event.target
          .closest(".dropdown")
          .querySelector(".dropdown-menu");
        if (
          dopdownMenu.style.display === "none" ||
          dopdownMenu.style.display === ""
        ) {
          dopdownMenu.style.display = "block";
        } else {
          dopdownMenu.style.display = "none";
        }
      });
    });

    // fermer le menu si on clique dehors
    window.addEventListener("click", function (event) {
      let menus = document.querySelectorAll(".dropdown-menu");
      menus.forEach((menu) => {
        if (!event.target.closest(".dropdown")) {
          menu.style.display = "none";
        }
      });
    });
  }

  // initialiser le addEventListener pour la recherche principale
  initGeneralSearchAction() {
    const generalSearchInput = document.querySelector('form.search-form input');
    generalSearchInput.addEventListener("input", (event) => {
        const searchText = event.target.value.toLowerCase();

        //ne rien faire si le texte est inférieur à 3 caractères
        if(searchText.length < 3) {
            return;
        }
        
        this.filterChoices.general = searchText;

        this.whenFilterChanged()

    });
  }


  initFilterSearchAction(filtersData, recipes) {
    let filteredData = [];
    const filterInputs = document.querySelectorAll(
      ".filters input.form-control"
    );
    filterInputs.forEach((filterInput) => {
      filterInput.addEventListener("input", (event) => {
        const searchText = event.target.value.toLowerCase();

        if (event.target.classList.contains("ingredients-input")) {
          filteredData = filtersData.ingredients.filter((data) =>
            data.includes(searchText)
          );
          this.buildFilter(filteredData, "ingredients");
        }

        if (event.target.classList.contains("appliances-input")) {
          filteredData = filtersData.appliances.filter((data) =>
            data.includes(searchText)
          );
          this.buildFilter(filteredData, "appliances");
        }

        if (event.target.classList.contains("ustensils-input")) {
          filteredData = filtersData.ustensils.filter((data) =>
            data.includes(searchText)
          );
          this.buildFilter(filteredData, "ustensils");
        }

        this.initFilterChoiceAction();
         // filtrer les recettes selon le texte de recherche
        this.filterRecipes(searchText, recipes);
      });
    });
  }

  // afficher les recettes filtrées

  filterRecipes(searchText, recipes) {
    if (!searchText) return;
    searchText = searchText.toLowerCase();
    const filteredRecipes = recipes.filter((recipe) => {
      const recipeNameMatch = recipe.name?.toLowerCase().includes(searchText);
      const ingredientsMatch = recipe.ingredients && recipe.ingredients.some((ingredient) =>
        ingredient.ingredient?.toLowerCase().includes(searchText)
      );
      const ustensilsMatch = recipe.ustensils && recipe.ustensils.some((ustensil) =>
        ustensil?.toLowerCase().includes(searchText)
      );
      const appliancesMatch = recipe.appliances && recipe.appliance.some((appliance) =>
        appliance?.toLowerCase().includes(searchText)
      );
      if (recipeNameMatch || ingredientsMatch || ustensilsMatch || appliancesMatch) {
        return recipe;
      }
      
    });
    const recipesContainer = document.querySelector(".recipes .row");
    recipesContainer.innerHTML = "";
    this.buildRecipes(filteredRecipes);
    
  }

  // afficher les recettes filtrées
  executeFilter(recipes) {
    this.buildRecipes(recipes);
  }

  buildFilterResults(filterName) {
    const filterResultElement = document.querySelector(
      `.filter-results-${filterName}`
    );
    filterResultElement.innerHTML = "";
    this.filterChoices[filterName].forEach((value) => {
      const resultElement = document.createElement("button");
      resultElement.classList =
        "btn w-100 d-flex justify-content-between align-items-center mb-3";
      resultElement.innerHTML = `                  
            <span>${value}</span>
            <i class="fa-solid fa-xmark"></i>
            <i class="fa-solid fa-circle-xmark"></i>`;
      filterResultElement.appendChild(resultElement);
    });
  }

  //fermer les éléments choisis
  deleteFilterChoicesAction() {
    const filterChoices = document.querySelectorAll('.filter-results button');
    filterChoices.forEach((choice) => {
        choice.addEventListener('click', () => {

        const filterName = choice.dataset.filterName;
        const choiceValue = choice.textContent.toLowerCase();

        if (this.filterChoices [filterName]) {
            this.filterChoices[filterName] =this.filterChoices[filterName].filter(item => item !== choiceValue);
        }
        choice.remove();
        console.log(filterName);
        

        this.filterRecipes(document.querySelectorAll('.form-control').value, this.recipes)
            });
        });
    }
        

  //fermer tous les dropdowns si on ouvre un seul
  closeAllDropdowns() {
    const allDropdownsMenu = document.querySelectorAll(".dropdown-menu");
    allDropdownsMenu.forEach((dropdown) => {
      dropdown.style.display = "none";
    });
  }

  whenFilterChanged() {

    // filtrer les recettes
    const recipeFactory = new RecipeFactory();
    const filteredRecipes = recipeFactory.filterRecipes(this.recipes, this.filterChoices);
    console.log(filteredRecipes)

    // afficher les recettes filtrées
    this.buildRecipes(filteredRecipes);

    //reconstuire les filtres suivant les recettes filtées
    this.buildfilters(filteredRecipes);


    //afficher le nombre de résultat
    
    
    // this.buildFilterResults(filterName);
    // this.filterRecipes();
    // this.deleteFilterChoicesAction();
  }
}

const app = new App();
app.init();
