let resultsContainer = document.getElementsByClassName("container")[0];

// Debounce function
const debounce = (callback, delay = 500) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            callback(...args);
        }, delay);
    };
};

// Generate debounced version of generateResults function with 500ms debounce delay
const debouncedGenerateResults = debounce((searchValue, inputField) => {
    // Encode the search value to handle special characters in the URL
    const encodedSearchValue = encodeURIComponent(searchValue);
    fetch(
        "https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=" +
        encodedSearchValue
    )
        .then((response) => response.json())
        .then((data) => {
            let results = data.query.search;
            let numberOfResults = data.query.search.length;
            resultsContainer.innerHTML = "";
            for (let i = 0; i < numberOfResults; i++) {
                let result = document.createElement("div");
                result.classList.add("results");
                result.innerHTML = `
            <div>
                <h3>${results[i].title}</h3>
                <p>${results[i].snippet}</p>
            </div>
            <a href="https://en.wikipedia.org/?curid=${results[i].pageid}" target="_blank">Read More</a>
            `;
                resultsContainer.appendChild(result);
            }
            if (inputField.value === "") {
                resultsContainer.innerHTML =
                    "<p>Type something in the above search input</p>";
            }
        });
});

const validateInput = (el) => {
    if (el.value === "") {
        resultsContainer.innerHTML =
            "<p>Type something in the above search input</p>";
    } else {
        debouncedGenerateResults(el.value, el);
    }
};

// Add event listener for "keyup" event on the search input
let searchInput = document.querySelector(".search input");
searchInput.addEventListener("keyup", () => {
    validateInput(searchInput);
});
