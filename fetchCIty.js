function debounce(func, wait) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

async function fetchCitySuggestions(query) {
    const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=3`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}
document.addEventListener("DOMContentLoaded", function () {
const cityInput = document.getElementById("cityInput");
const autocompleteDropdown = document.getElementById("autocompleteDropdown");

async function handleInput() {
    const query = cityInput.value.trim();
    autocompleteDropdown.innerHTML = '';

    if (query.length === 0) {
        autocompleteDropdown.style.display = 'none';
        return;
    }

    const citySuggestions = await fetchCitySuggestions(query);

    if (citySuggestions.length > 0) {
        autocompleteDropdown.style.display = 'block';
        citySuggestions.forEach(city => {
            const suggestion = document.createElement('div');
            suggestion.textContent = city.display_name;
            suggestion.onclick = () => {
                cityInput.value = city.display_name;
                autocompleteDropdown.style.display = 'none';
            };
            autocompleteDropdown.appendChild(suggestion);
        });
    } else {
        autocompleteDropdown.style.display = 'none';
    }
}

cityInput.addEventListener('input', debounce(handleInput, 300));
});
