
document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("search-events");
    const zipcodeInput = document.getElementById("zipcode-input");
    const resultsContainer = document.getElementById("results");
  
    // Initialize EmailJS with your User ID
    emailjs.init("WSY85gTwYoy1_HAKc");  // Replace with your EmailJS User ID
  
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
  
              // Left side: Event details
              const eventDetails = document.createElement("div");
              eventDetails.className = "event-details";
  
              const eventName = document.createElement("h2");
              eventName.textContent = event.name || "Unnamed Event";
              eventDetails.appendChild(eventName);
  
              const eventVicinity = document.createElement("p");
              eventVicinity.textContent = `Location: ${event.vicinity || "Unknown"}`;
              eventDetails.appendChild(eventVicinity);
  
              if (event.rating) {
                const eventRating = document.createElement("p");
                eventRating.textContent = `Rating: ${event.rating} (${event.user_ratings_total || 0} reviews)`;
                eventDetails.appendChild(eventRating);
              }
  
              // Right side: RSVP, Toggle Map, and Email input
              const rsvpContainer = document.createElement("div");
              rsvpContainer.className = "rsvp-container";
  
              const toggleMapButton = document.createElement("button");
              toggleMapButton.className = "map-button";
              toggleMapButton.textContent = "Toggle Map";
              let mapVisible = false;  // Track the map visibility state
  
              toggleMapButton.addEventListener("click", () => {
                const mapContainer = document.querySelector(`#map-container-${event.place_id}`);
                if (mapContainer) {
                  mapVisible = !mapVisible;
                  mapContainer.style.display = mapVisible ? "block" : "none";
                }
              });
  
              const rsvpButton = document.createElement("button");
              rsvpButton.className = "rsvp-button";
              rsvpButton.textContent = "RSVP";
              rsvpButton.addEventListener("click", () => {
                // Check if the input box already exists, if not create it
                const existingInputBox = document.querySelector(`#input-box-${event.place_id}`);
                if (!existingInputBox) {
                  const inputBox = document.createElement("input");
                  inputBox.type = "email";
                  inputBox.placeholder = "Enter your email";
                  inputBox.className = "rsvp-input";
                  inputBox.id = `input-box-${event.place_id}`; // Unique ID for each event
  
                  const submitButton = document.createElement("button");
                  submitButton.textContent = "Submit";
                  submitButton.className = "submit-button";
                  submitButton.addEventListener("click", () => {
                    const email = inputBox.value;
                    if (email) {
                      // Send the RSVP data to EmailJS
                      const templateParams = {
                        email: email,
                        eventName: eventName.textContent,  // Event name
                      };
  
                      // Use your service ID, template ID, and template parameters here
                      emailjs.send("service_i3pqlpe", "template_hjzz6ej", templateParams)
                        .then((response) => {
                          alert(`RSVP Successful! A confirmation email has been sent to ${email}.`);
                        }, (error) => {
                          alert("There was an error with the RSVP submission.");
                          console.error(error);
                        });
                    } else {
                      alert("Please enter a valid email.");
                    }
                  });
  
                  rsvpContainer.appendChild(inputBox);
                  rsvpContainer.appendChild(submitButton);
                }
              });
  
              rsvpContainer.appendChild(toggleMapButton);
              rsvpContainer.appendChild(rsvpButton);
  
              // Add map container for each event
              const mapContainer = document.createElement("div");
              mapContainer.id = `map-container-${event.place_id}`;
              mapContainer.className = "map-container";
              mapContainer.innerHTML = `
                <iframe 
                  src="https://www.google.com/maps?q=${event.geometry.location.lat},${event.geometry.location.lng}&hl=es;z=14&output=embed" 
                  width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
              `;
              mapContainer.style.display = "none"; // Hide the map initially
  
              card.appendChild(eventDetails);
              card.appendChild(rsvpContainer);
              card.appendChild(mapContainer);
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
  