document.addEventListener('DOMContentLoaded', () => {
    const recipeForm = document.getElementById('recipe-form');
    const recipeList = document.getElementById('recipes');
    const searchBar = document.getElementById('search-bar');
    const toggleFormBtn = document.getElementById('toggle-form-btn');
    const recipeFormContainer = document.getElementById('recipe-form-container');
    const closeBtn = document.querySelector('.close-btn');
    const lightbox = document.getElementById('recipe-lightbox');


    let recipes = JSON.parse(localStorage.getItem('recipes')) || [];

    closeBtn.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });


    toggleFormBtn.addEventListener('click', () => {
        // Toggle the display style between 'none' and 'block'
        if (recipeFormContainer.style.display === 'none' || recipeFormContainer.style.display === '') {
            recipeFormContainer.style.display = 'block';
            toggleFormBtn.textContent = 'Close Form';
        } else {
            recipeFormContainer.style.display = 'none';
            toggleFormBtn.textContent = 'Add Recipe';
        }
    });

    const displayRecipes = (filteredRecipes) => {
        recipeList.innerHTML = '';
        filteredRecipes.forEach((recipe, index) => {
            // Truncate ingredients to show only the first 4-5 words
            const truncatedIngredients = recipe.ingredients.join(', ').split(' ').slice(0, 5).join(' ') + '...';
            
            // Truncate instructions to show only the first 10 words
            const truncatedInstructions = recipe.instructions.split(' ').slice(0, 5).join(' ') + '...';

            const recipeCard = document.createElement('div');
            recipeCard.classList.add('recipe-card');
            recipeCard.innerHTML = `
                <h3>${recipe.name}</h3>
                <img src="${recipe.image || 'default.jpg'}" alt="${recipe.name}">
                <p><strong>Ingredients:</strong> ${truncatedIngredients}</p>
                <p><strong>Instructions:</strong> ${truncatedInstructions}</p>
                ${recipe.video ? `<p><strong>Watch Video:</strong> <a href="${recipe.video}" target="_blank">Click here to watch</a></p>` : ''}
                <button class="delete-btn" data-index="${index}">Delete</button>
            `;

            // Add click event listener to the recipe card to open the lightbox
            recipeCard.addEventListener('click', () => openLightbox(recipe));

            // Stop event propagation on delete button click
            const deleteBtn = recipeCard.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Stop the click event from reaching the recipe card
                deleteRecipe(e); // Call the deleteRecipe function
            });

            recipeList.appendChild(recipeCard);
        });
    };

    const addRecipe = (e) => {
        e.preventDefault();
        const newRecipe = {
            name: document.getElementById('recipe-name').value,
            ingredients: document.getElementById('recipe-ingredients').value.split(','),
            instructions: document.getElementById('recipe-instructions').value,
            image: document.getElementById('recipe-image').value,
            video: document.getElementById('recipe-video').value
        };
        recipes.push(newRecipe);
        localStorage.setItem('recipes', JSON.stringify(recipes));
        displayRecipes(recipes);
        recipeForm.reset();
    };

    const deleteRecipe = (e) => {
        const index = e.target.getAttribute('data-index');
        recipes.splice(index, 1);
        localStorage.setItem('recipes', JSON.stringify(recipes));
        displayRecipes(recipes);
    };

    const searchRecipes = () => {
        const query = searchBar.value.toLowerCase();
        const filteredRecipes = recipes.filter(recipe =>
            recipe.name.toLowerCase().includes(query) ||
            recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(query))
        );
        displayRecipes(filteredRecipes);
    };


    const openLightbox = (recipe) => {
        // alert("Lightbox should open now!");
        document.getElementById('lightbox-recipe-title').textContent = recipe.name;
        document.getElementById('lightbox-recipe-image').src = recipe.image || 'default.jpg';
        document.getElementById('lightbox-recipe-ingredients').textContent = recipe.ingredients.join(', ');
        document.getElementById('lightbox-recipe-instructions').textContent = recipe.instructions;
        if (recipe.video) {
            document.getElementById('lightbox-recipe-video-container').innerHTML = `<p><strong>Watch Video:</strong> <a href="${recipe.video}" target="_blank">Click here to watch</a></p>`;
        } else {
            document.getElementById('lightbox-recipe-video-container').innerHTML = '';
        }
        document.getElementById('recipe-lightbox').style.display = 'flex';
    };

    const closeLightbox = () => {
        document.getElementById('recipe-lightbox').style.display = 'none';
    };

    // Event listener to close the lightbox
    document.querySelector('.close-btn').addEventListener('click', closeLightbox);


    recipeForm.addEventListener('submit', addRecipe);
    searchBar.addEventListener('input', searchRecipes);
    

    // Initial display of recipes
    displayRecipes(recipes);

});
