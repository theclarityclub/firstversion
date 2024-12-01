document.addEventListener('DOMContentLoaded', function() {
    // Create the hamburger menu HTML
    const hamburgerMenu = document.createElement('div');
    hamburgerMenu.className = 'hamburger-menu';
    hamburgerMenu.innerHTML = `
        <button class="hamburger-btn">
            <span class="hamburger-icon">☰</span>
            Menu
        </button>
        <div class="hamburger-dropdown">
            <a href="index.html">Home</a>
            <a href="about.html">About</a>
            <a href="membership.html">Membership</a>
            <a href="blog.html">Blog</a>
            <a href="events.html">Events</a>
            <a href="resources.html">Resources</a>
            <a href="challenge.html">Challenge</a>
            <a href="progress.html">Progress</a>
            <a href="dashboard.html">Dashboard</a>
            <a href="contact.html">Contact</a>
            <a href="login.html">Login</a>
        </div>
    `;

    // Add the menu to the page
    document.body.appendChild(hamburgerMenu);

    // Get elements
    const hamburgerBtn = hamburgerMenu.querySelector('.hamburger-btn');
    const dropdown = hamburgerMenu.querySelector('.hamburger-dropdown');

    // Toggle dropdown on button click
    hamburgerBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburgerMenu.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });

    // Set active link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const links = dropdown.querySelectorAll('a');
    links.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});
