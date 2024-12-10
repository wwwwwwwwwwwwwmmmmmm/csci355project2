document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("search-events");
    const zipcodeInput = document.getElementById("zipcode-input");
    const resultsContainer = document.getElementById("results");

    if (searchButton) {
        searchButton.addEventListener("click", () => {
            const zipcode = zipcodeInput.value.trim();

            if (!zipcode || !/^\d{5}$/.test(zipcode)) {
                alert("Please enter a valid 5-digit ZIP code.");
                return;
            }

            resultsContainer.innerHTML = `<p>Loading events for ZIP code: ${zipcode}...</p>`;

            fetch(`http://localhost:5001/api/events?zipcode=${zipcode}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch events. Please try again later.");
                    }
                    return response.json();
                })
                .then((data) => {
                    resultsContainer.innerHTML = ""; // Clear the loading message

                    if (!data.results || data.results.length === 0) {
                        resultsContainer.innerHTML = `<p>No events found near ZIP code: ${zipcode}.</p>`;
                        return;
                    }

                    const grid = document.createElement("div");
                    grid.className = "event-grid";

                    data.results.forEach((event) => {
                        const card = document.createElement("div");
                        card.className = "event-card";

                        const eventName = document.createElement("h2");
                        eventName.textContent = event.name || "Unnamed Event";
                        card.appendChild(eventName);

                        const eventVicinity = document.createElement("p");
                        eventVicinity.textContent = `Location: ${event.vicinity || "Unknown"}`;
                        card.appendChild(eventVicinity);

                        if (event.rating) {
                            const eventRating = document.createElement("p");
                            eventRating.textContent = `Rating: ${event.rating} (${event.user_ratings_total || 0} reviews)`;
                            card.appendChild(eventRating);
                        }

                        grid.appendChild(card);
                    });

                    resultsContainer.appendChild(grid);
                })
                .catch((error) => {
                    console.error("Error fetching events:", error);
                    resultsContainer.innerHTML = `<p>${error.message}</p>`;
                });
        });
    }
});
