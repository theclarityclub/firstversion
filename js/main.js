// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Show all content immediately
    document.querySelectorAll('.content-stack, .feature-card, .event-card').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
    });

    // Initialize features
    initializeNavScroll();
    initializeDisclosureTriggers();
    displayUpcomingEvents();
    initializeEventCards();
    initializeScrollEffects();
});

// Navigation Scroll Handler
function initializeNavScroll() {
    const navSecondary = document.querySelector('.nav-secondary');
    let lastScrollY = window.scrollY;
    
    function updateNavVisibility() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > lastScrollY) {
            // Scrolling down
            navSecondary?.setAttribute('data-visible', 'false');
        } else {
            // Scrolling up
            if (currentScrollY > 100) {
                navSecondary?.setAttribute('data-visible', 'true');
            } else {
                navSecondary?.setAttribute('data-visible', 'false');
            }
        }
        
        lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateNavVisibility);
    });
}

// Progressive Disclosure
function initializeDisclosureTriggers() {
    document.querySelectorAll('.disclosure-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const content = trigger.nextElementSibling;
            if (content?.classList.contains('disclosure-content')) {
                const isVisible = content.getAttribute('data-visible') === 'true';
                
                // Toggle visibility with smooth animation
                if (!isVisible) {
                    content.style.display = 'block';
                    content.setAttribute('data-visible', 'true');
                    
                    requestAnimationFrame(() => {
                        content.style.height = content.scrollHeight + 'px';
                        content.style.opacity = '1';
                    });
                } else {
                    content.style.height = content.scrollHeight + 'px';
                    
                    requestAnimationFrame(() => {
                        content.style.height = '0';
                        content.style.opacity = '0';
                        
                        content.addEventListener('transitionend', () => {
                            content.style.display = 'none';
                            content.setAttribute('data-visible', 'false');
                        }, { once: true });
                    });
                }
            }
        });
    });
}

// Scroll Effects
function initializeScrollEffects() {
    const sections = document.querySelectorAll('.content-stack');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'none';
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });

    sections.forEach(section => {
        observer.observe(section);
    });
}

// Event Cards
function displayUpcomingEvents() {
    const upcomingEvents = [
        {
            id: 1,
            title: 'Mindfulness Workshop',
            date: '2024-02-15',
            time: '10:00 AM',
            location: 'Virtual',
            description: 'Join us for a guided mindfulness session focused on stress reduction and mental clarity.'
        },
        {
            id: 2,
            title: 'Networking Mixer',
            date: '2024-02-20',
            time: '6:00 PM',
            location: 'Downtown Hub',
            description: 'Connect with fellow members in a relaxed atmosphere.'
        },
        {
            id: 3,
            title: 'Personal Growth Seminar',
            date: '2024-02-25',
            time: '2:00 PM',
            location: 'Community Center',
            description: 'Learn effective strategies for personal development and goal achievement.'
        }
    ];

    const eventsGrid = document.querySelector('.events-grid');
    if (!eventsGrid) return;

    eventsGrid.innerHTML = upcomingEvents.map(event => `
        <article class="event-card">
            <div class="event-primary">
                <time>${formatDate(event.date)}</time>
                <h3>${event.title}</h3>
            </div>
            <div class="event-details" data-visible="false">
                <p class="event-location">
                    <i class="fas fa-map-marker-alt"></i> 
                    ${event.location}
                </p>
                <p class="event-description">${event.description}</p>
                <button class="cta-primary" onclick="registerForEvent(${event.id})">
                    Register Now
                </button>
            </div>
        </article>
    `).join('');

    initializeEventCards();
}

function initializeEventCards() {
    document.querySelectorAll('.event-card').forEach(card => {
        const primary = card.querySelector('.event-primary');
        const details = card.querySelector('.event-details');
        
        primary?.addEventListener('click', () => {
            const isVisible = details?.getAttribute('data-visible') === 'true';
            
            if (!isVisible) {
                details.style.display = 'block';
                details.setAttribute('data-visible', 'true');
                
                requestAnimationFrame(() => {
                    details.style.height = details.scrollHeight + 'px';
                    details.style.opacity = '1';
                });
            } else {
                details.style.height = details.scrollHeight + 'px';
                
                requestAnimationFrame(() => {
                    details.style.height = '0';
                    details.style.opacity = '0';
                    
                    details.addEventListener('transitionend', () => {
                        details.style.display = 'none';
                        details.setAttribute('data-visible', 'false');
                    }, { once: true });
                });
            }
        });
    });
}

// Event Registration Handler
function registerForEvent(eventId) {
    console.log(`Registering for event ${eventId}`);
}

// Utility Functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});
