// Resource Library JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize resource filtering and search functionality
    initializeResourceFilters();
});

function initializeResourceFilters() {
    // Add event listeners for resource filtering
    const resourceCards = document.querySelectorAll('.resource-card');
    
    resourceCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('resource-link')) {
                const link = this.querySelector('.resource-link');
                if (link) {
                    link.click();
                }
            }
        });
    });
}

// Function to handle resource access (to be implemented with authentication)
function accessResource(resourceId) {
    // TODO: Implement resource access logic
    console.log(`Accessing resource: ${resourceId}`);
}
