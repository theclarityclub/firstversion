document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.menu-btn');
    const menuContent = document.querySelector('.menu-content');
    
    // Toggle menu when clicking the button
    menuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        menuContent.classList.toggle('show');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!menuContent.contains(e.target) && !menuBtn.contains(e.target)) {
            menuContent.classList.remove('show');
        }
    });

    // Prevent menu from closing when clicking inside it
    menuContent.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Add active class to current page link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const links = menuContent.querySelectorAll('a');
    links.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});
