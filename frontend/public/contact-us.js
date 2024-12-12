document.addEventListener('DOMContentLoaded', function () {
    // Existing functionality (preserve this part if you have other code here)
    const panels = document.querySelectorAll('.panel');
    const locationInfo = document.getElementById('location-info');
    const cartCountEl = document.getElementById('cart-count'); // Assuming cart count functionality exists

    // Update cart count function (keep this if it’s part of your existing script)
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountEl.textContent = cartCount;
    }

    // Initial update of cart count on page load
    updateCartCount();

    // Listen for changes in local storage and update cart count if cart changes
    window.addEventListener('storage', (event) => {
        if (event.key === 'cart') {
            updateCartCount();
        }
    });

    // Handle form submission
    const form = document.getElementById('contact-form');
    
    // Function to handle the form submission
    function handleFormSubmit(event) {
        event.preventDefault(); // Prevent the default form submission

        // Gather form data
        const formData = new FormData(form);
        const data = new URLSearchParams();
        formData.forEach((value, key) => {
            data.append(key, value);
        });

        // Send the data to the backend using fetch API
        fetch('send_email.php', {
            method: 'POST',
            body: data
        })
        .then(response => response.text())
        .then(data => {
            // Handle response from the server
            if (data === 'Message sent successfully!') {
                alert('Thank you for reaching out! We will get back to you shortly.');
                form.reset(); // Reset form after successful submission
            } else {
                alert('There was an issue sending your message. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error sending your message. Please try again.');
        });
    }

    // Attach the form submission handler
    form.addEventListener('submit', handleFormSubmit);

    // New Location Panel Functionality
    panels.forEach(panel => {
        panel.addEventListener('click', () => {
            // Remove "active" class from all panels
            panels.forEach(p => p.classList.remove('active'));
            // Add "active" class to the clicked panel
            panel.classList.add('active');
            // Display the address in the location-info container
            locationInfo.textContent = panel.dataset.address;
            locationInfo.classList.add('show');
        });
    });

    // Hide the location-info text when mouse leaves the locations container
    document.querySelector('.locations-container').addEventListener('mouseleave', () => {
        locationInfo.classList.remove('show');
    });
});
