// Calendar and Event Management System with rich interactions

class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.currentMonth = this.currentDate.getMonth();
        this.currentYear = this.currentDate.getFullYear();
        this.monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        this.dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        
        // Cache for performance
        this._eventDates = new Set([5, 10, 15, 20, 25]); // Mock event dates
        
        this.initialize();
    }

    initialize() {
        this.setupCalendar();
    }

    setupCalendar() {
        const prevMonthBtn = document.getElementById('prevMonth');
        const nextMonthBtn = document.getElementById('nextMonth');
        
        if (prevMonthBtn && nextMonthBtn) {
            // Add hover effects
            [prevMonthBtn, nextMonthBtn].forEach(btn => {
                btn.addEventListener('mouseenter', () => {
                    btn.style.transform = 'scale(1.1)';
                });
                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = 'scale(1)';
                });
            });

            prevMonthBtn.addEventListener('click', () => this.navigateMonth(-1));
            nextMonthBtn.addEventListener('click', () => this.navigateMonth(1));
        }
        
        this.updateCalendarHeader();
        this.renderCalendar();
    }

    updateCalendarHeader() {
        const monthHeader = document.getElementById('currentMonth');
        if (monthHeader) {
            monthHeader.textContent = `${this.monthNames[this.currentMonth]} ${this.currentYear}`;
            
            // Add subtle animation
            monthHeader.style.animation = 'fadeInDown 0.5s ease-out';
            monthHeader.addEventListener('animationend', () => {
                monthHeader.style.animation = '';
            });
        }
    }

    navigateMonth(direction) {
        this.currentMonth += direction;
        
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        } else if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        
        this.updateCalendarHeader();
        this.renderCalendar();
    }

    renderCalendar() {
        const calendarGrid = document.querySelector('.calendar-grid');
        if (!calendarGrid) return;

        // Create fragment for performance
        const fragment = document.createDocumentFragment();

        // Add day headers with style
        this.dayNames.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            dayHeader.textContent = day;
            fragment.appendChild(dayHeader);
        });

        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const startingDay = firstDay.getDay();
        const totalDays = lastDay.getDate();

        // Add empty cells with fade effect
        for (let i = 0; i < startingDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            fragment.appendChild(emptyDay);
        }

        // Add days with interactive effects
        for (let day = 1; day <= totalDays; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';
            dayCell.textContent = day;

            // Add hover effect
            dayCell.addEventListener('mouseenter', () => {
                dayCell.style.transform = 'scale(1.1)';
                dayCell.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            });
            dayCell.addEventListener('mouseleave', () => {
                dayCell.style.transform = 'scale(1)';
                dayCell.style.boxShadow = 'none';
            });

            // Add event indicator with animation
            if (this._eventDates.has(day)) {
                const eventLogo = document.createElement('div');
                eventLogo.className = 'event-indicator';
                eventLogo.innerHTML = '<i class="fa-solid fa-star"></i>';
                dayCell.appendChild(eventLogo);

                // Add tooltip
                dayCell.setAttribute('title', 'Event scheduled on this day');
                dayCell.addEventListener('click', () => {
                    alert('Event details coming soon!');
                });
            }

            fragment.appendChild(dayCell);
        }

        // Smooth transition for calendar updates
        calendarGrid.style.opacity = '0';
        calendarGrid.innerHTML = '';
        calendarGrid.appendChild(fragment);
        
        requestAnimationFrame(() => {
            calendarGrid.style.opacity = '1';
        });
    }
}

class EventManager {
    constructor() {
        console.log('EventManager initialized');
        this.events = this.getMockEvents();
        this.initialize();
    }

    initialize() {
        console.log('EventManager initializing...');
        this.setupEventManager();
    }

    setupEventManager() {
        console.log('Setting up event manager');
        this.setupEventListeners();
        this.renderEvents();
        this.renderFeaturedEvents();
    }

    setupEventListeners() {
        const searchInput = document.getElementById('eventSearch');
        const filters = document.querySelectorAll('select[id$="Filter"]');

        // Add search animation
        if (searchInput) {
            searchInput.addEventListener('focus', () => {
                searchInput.style.transform = 'scale(1.02)';
                searchInput.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            });
            searchInput.addEventListener('blur', () => {
                searchInput.style.transform = 'scale(1)';
                searchInput.style.boxShadow = 'none';
            });
            
            // Debounce search for performance
            let timeout;
            searchInput.addEventListener('input', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => this.filterEvents(), 300);
            });
        }

        // Add filter animations
        filters.forEach(filter => {
            filter.addEventListener('change', () => {
                filter.style.animation = 'pulse 0.3s ease-out';
                filter.addEventListener('animationend', () => {
                    filter.style.animation = '';
                });
                this.filterEvents();
            });
        });
    }

    getMockEvents() {
        console.log('Getting mock events');
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        
        return [
            {
                id: 1,
                title: "Mindfulness Workshop",
                category: "workshop",
                date: `${year}-${month.toString().padStart(2, '0')}-15`,
                time: "10:00 AM",
                location: "Virtual",
                description: "Join us for a guided mindfulness session focused on stress reduction and mental clarity.",
                featured: true
            },
            {
                id: 2,
                title: "Networking Mixer",
                category: "networking",
                date: `${year}-${month.toString().padStart(2, '0')}-20`,
                time: "6:00 PM",
                location: "Downtown Hub",
                description: "Connect with fellow members in a relaxed atmosphere.",
                featured: true
            },
            {
                id: 3,
                title: "Personal Growth Seminar",
                category: "seminar",
                date: `${year}-${month.toString().padStart(2, '0')}-25`,
                time: "2:00 PM",
                location: "Community Center",
                description: "Learn effective strategies for personal development and goal achievement.",
                featured: false
            }
        ];
    }

    filterEvents() {
        const searchInput = document.getElementById('eventSearch');
        const categoryFilter = document.getElementById('categoryFilter');
        const dateFilter = document.getElementById('dateFilter');
        const locationFilter = document.getElementById('locationFilter');

        const filters = {
            search: searchInput?.value.toLowerCase() ?? '',
            category: categoryFilter?.value ?? '',
            date: dateFilter?.value ?? '',
            location: locationFilter?.value ?? ''
        };

        const filteredEvents = this.events.filter(event => {
            return this.matchesFilters(event, filters);
        });

        this.renderEvents(filteredEvents, true); // true for animation
    }

    matchesFilters(event, filters) {
        const { search, category, date, location } = filters;

        return (!search || event.title.toLowerCase().includes(search) || 
                event.description.toLowerCase().includes(search)) &&
               (!category || event.category === category) &&
               (!location || this.matchesLocation(event, location)) &&
               (!date || this.matchesDate(event.date, date));
    }

    matchesLocation(event, locationFilter) {
        return locationFilter === 'virtual' ? event.location === 'Virtual' :
               locationFilter === 'in-person' ? event.location !== 'Virtual' : true;
    }

    matchesDate(eventDate, dateFilter) {
        if (!dateFilter) return true;

        const today = new Date();
        const eventDateTime = new Date(eventDate);
        
        switch(dateFilter) {
            case 'today':
                return eventDateTime.toDateString() === today.toDateString();
            case 'week':
                return eventDateTime >= today && 
                       eventDateTime <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            case 'month':
                return eventDateTime.getMonth() === today.getMonth() &&
                       eventDateTime.getFullYear() === today.getFullYear();
            default:
                return true;
        }
    }

    renderFeaturedEvents() {
        console.log('Rendering featured events');
        const eventsGrid = document.querySelector('.events-grid');
        if (!eventsGrid) {
            console.log('Events grid not found');
            return;
        }

        const featuredEvents = this.events.filter(event => event.featured);
        console.log('Featured events:', featuredEvents);
        
        eventsGrid.innerHTML = featuredEvents.map((event, index) => `
            <div class="event-card">
                <div class="event-card-content">
                    <div class="event-header">
                        <img src="images/logo.svg" alt="Event Logo" class="event-logo">
                        <h3>${event.title}</h3>
                    </div>
                    <div class="event-meta">
                        <span><i class="fa-solid fa-calendar"></i> ${new Date(event.date).toLocaleDateString()}</span>
                        <span><i class="fa-solid fa-clock"></i> ${event.time}</span>
                        <span><i class="fa-solid fa-location-dot"></i> ${event.location}</span>
                    </div>
                    <p class="event-description">${event.description}</p>
                    <button class="btn-register" onclick="registerForEvent(${event.id})">Register Now</button>
                </div>
            </div>
        `).join('');
    }

    renderEvents(eventsToRender = this.events, animate = false) {
        console.log('Rendering events:', eventsToRender);
        const eventsList = document.querySelector('.events-list');
        if (!eventsList) {
            console.log('Events list not found');
            return;
        }

        const html = eventsToRender.map((event, index) => {
            const eventDate = new Date(event.date);
            return `
                <div class="event-item">
                    <div class="event-date">
                        <div class="day">${eventDate.getDate()}</div>
                        <div class="month">${this.monthNames[eventDate.getMonth()].slice(0, 3)}</div>
                    </div>
                    <div class="event-info">
                        <h3>${event.title}</h3>
                        <div class="event-meta">
                            <span><i class="fa-solid fa-clock"></i> ${event.time}</span>
                            <span><i class="fa-solid fa-location-dot"></i> ${event.location}</span>
                        </div>
                        <p>${event.description}</p>
                    </div>
                    <div class="event-action">
                        <button class="btn-register" onclick="registerForEvent(${event.id})">Register</button>
                        <button class="btn-details" onclick="showEventDetails(${event.id})">Details</button>
                    </div>
                </div>
            `;
        }).join('');

        eventsList.innerHTML = html;
    }

    get monthNames() {
        return ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
    }
}

// Enhanced event handlers
window.registerForEvent = (eventId) => {
    const button = event.target;
    const originalText = button.textContent;
    
    button.disabled = true;
    button.textContent = 'Registering...';
    button.style.animation = 'pulse 1s infinite';
    
    setTimeout(() => {
        button.textContent = 'Registered!';
        button.style.animation = '';
        button.classList.add('registered');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            button.classList.remove('registered');
        }, 2000);
    }, 1000);
};

window.showEventDetails = (eventId) => {
    const button = event.target;
    button.classList.add('active');
    
    setTimeout(() => {
        alert('Event details feature coming soon!');
        button.classList.remove('active');
    }, 200);
};

// Initialize systems
window.addEventListener('load', () => {
    console.log('Window loaded, initializing systems');
    new Calendar();
    new EventManager();
});
