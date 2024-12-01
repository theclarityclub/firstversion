// Calendar and Event Management System with rich interactions

class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.currentMonth = this.currentDate.getMonth();
        this.currentYear = this.currentDate.getFullYear();
        this.monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        this.dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        
        // Enhanced event data structure
        this.events = {
            "2024-02-15": {
                title: "Mindfulness Workshop",
                date: "2024-02-15",
                time: "10:00 AM",
                location: "Virtual",
                category: "workshop",
                description: "Join us for a guided mindfulness session focused on stress reduction and mental clarity. Learn practical techniques for maintaining focus and reducing anxiety in your daily life."
            },
            "2024-02-20": {
                title: "Networking Mixer",
                date: "2024-02-20",
                time: "6:00 PM",
                location: "Downtown Hub",
                category: "networking",
                description: "Connect with fellow members in a relaxed atmosphere. Share experiences, build relationships, and explore potential collaborations in our vibrant community."
            },
            "2024-02-25": {
                title: "Personal Growth Seminar",
                date: "2024-02-25",
                time: "2:00 PM",
                location: "Community Center",
                category: "seminar",
                description: "Learn effective strategies for personal development and goal achievement. Our expert speakers will share insights on motivation, habit formation, and success principles."
            }
        };
        
        this.initialize();
    }

    initialize() {
        this.setupCalendar();
        this.setupPopup();
    }

    setupCalendar() {
        const prevMonthBtn = document.getElementById('prevMonth');
        const nextMonthBtn = document.getElementById('nextMonth');
        
        if (prevMonthBtn && nextMonthBtn) {
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

    setupPopup() {
        const popup = document.querySelector('.event-popup-overlay');
        const closeBtn = document.querySelector('.event-popup-close');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideEventPopup());
        }

        if (popup) {
            popup.addEventListener('click', (e) => {
                if (e.target === popup) {
                    this.hideEventPopup();
                }
            });
        }

        // Setup register button
        const registerBtn = document.querySelector('.event-popup-register');
        if (registerBtn) {
            registerBtn.addEventListener('click', () => {
                registerBtn.textContent = 'Registered!';
                registerBtn.disabled = true;
                setTimeout(() => {
                    this.hideEventPopup();
                    registerBtn.textContent = 'Register Now';
                    registerBtn.disabled = false;
                }, 1500);
            });
        }

        // Setup share button
        const shareBtn = document.querySelector('.event-popup-share');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                alert('Sharing functionality coming soon!');
            });
        }
    }

    updateCalendarHeader() {
        const monthHeader = document.getElementById('currentMonth');
        if (monthHeader) {
            monthHeader.textContent = `${this.monthNames[this.currentMonth]} ${this.currentYear}`;
            
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

    getEventForDate(year, month, day) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return this.events[dateStr];
    }

    showEventPopup(event) {
        const overlay = document.querySelector('.event-popup-overlay');
        const popup = document.querySelector('.event-popup');
        if (!overlay || !popup) return;

        // Populate event details
        document.querySelector('.event-popup-title').textContent = event.title;
        document.querySelector('.event-popup-date').textContent = new Date(event.date).toLocaleDateString();
        document.querySelector('.event-popup-time').textContent = event.time;
        document.querySelector('.event-popup-location').textContent = event.location;
        document.querySelector('.event-popup-category').textContent = event.category.charAt(0).toUpperCase() + event.category.slice(1);
        document.querySelector('.event-popup-description').textContent = event.description;

        // Show popup with animation
        overlay.classList.add('active');
        setTimeout(() => popup.classList.add('active'), 10);

        // Disable page scroll
        document.body.style.overflow = 'hidden';
    }

    hideEventPopup() {
        const overlay = document.querySelector('.event-popup-overlay');
        const popup = document.querySelector('.event-popup');
        if (!overlay || !popup) return;

        popup.classList.remove('active');
        setTimeout(() => {
            overlay.classList.remove('active');
            // Re-enable page scroll
            document.body.style.overflow = '';
        }, 300);
    }

    renderCalendar() {
        const calendarGrid = document.querySelector('.calendar-grid');
        if (!calendarGrid) return;

        const fragment = document.createDocumentFragment();

        // Add day headers
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

        // Add empty cells
        for (let i = 0; i < startingDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            fragment.appendChild(emptyDay);
        }

        // Add days with event indicators
        for (let day = 1; day <= totalDays; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';
            dayCell.textContent = day;

            const event = this.getEventForDate(this.currentYear, this.currentMonth, day);
            if (event) {
                const eventIndicator = document.createElement('div');
                eventIndicator.className = 'event-indicator';
                eventIndicator.innerHTML = '<i class="fa-solid fa-star"></i>';
                dayCell.appendChild(eventIndicator);

                dayCell.style.cursor = 'pointer';
                dayCell.addEventListener('click', () => this.showEventPopup(event));
            }

            // Add hover effects
            dayCell.addEventListener('mouseenter', () => {
                if (event) {
                    dayCell.style.transform = 'scale(1.1)';
                    dayCell.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                }
            });
            dayCell.addEventListener('mouseleave', () => {
                if (event) {
                    dayCell.style.transform = 'scale(1)';
                    dayCell.style.boxShadow = 'none';
                }
            });

            fragment.appendChild(dayCell);
        }

        // Smooth transition
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

        if (searchInput) {
            searchInput.addEventListener('focus', () => {
                searchInput.style.transform = 'scale(1.02)';
                searchInput.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            });
            searchInput.addEventListener('blur', () => {
                searchInput.style.transform = 'scale(1)';
                searchInput.style.boxShadow = 'none';
            });
            
            let timeout;
            searchInput.addEventListener('input', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => this.filterEvents(), 300);
            });
        }

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

        this.renderEvents(filteredEvents, true);
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
    const calendar = new Calendar();
    const event = calendar.events[Object.keys(calendar.events).find(key => 
        calendar.events[key].id === eventId
    )];
    
    if (event) {
        calendar.showEventPopup(event);
    }
};

// Initialize systems
window.addEventListener('load', () => {
    console.log('Window loaded, initializing systems');
    new Calendar();
    new EventManager();
});
