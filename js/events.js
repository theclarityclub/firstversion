// Calendar functionality
class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.currentMonth = this.currentDate.getMonth();
        this.currentYear = this.currentDate.getFullYear();
        this.monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        this.dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        
        // Initialize calendar when constructed
        this.initialize();
    }

    initialize() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupCalendar());
        } else {
            this.setupCalendar();
        }
    }

    setupCalendar() {
        const prevMonthBtn = document.getElementById('prevMonth');
        const nextMonthBtn = document.getElementById('nextMonth');
        
        if (prevMonthBtn && nextMonthBtn) {
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

        calendarGrid.innerHTML = '';

        // Add day headers
        this.dayNames.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });

        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const startingDay = firstDay.getDay();
        const totalDays = lastDay.getDate();

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyDay);
        }

        // Add days of the month
        for (let day = 1; day <= totalDays; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';
            dayCell.textContent = day;

            // Add event logo if there's an event on this day
            if (this.hasEvent(day)) {
                const eventLogo = document.createElement('img');
                eventLogo.src = 'images/logo.svg';
                eventLogo.className = 'event-logo';
                eventLogo.alt = 'Event';
                dayCell.appendChild(eventLogo);
            }

            calendarGrid.appendChild(dayCell);
        }
    }

    hasEvent(day) {
        // Mock function to simulate events
        return [5, 10, 15, 20, 25].includes(day);
    }
}

// Event filtering and search functionality
class EventManager {
    constructor() {
        this.events = this.getMockEvents();
        // Initialize event manager when constructed
        this.initialize();
    }

    initialize() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventManager());
        } else {
            this.setupEventManager();
        }
    }

    setupEventManager() {
        this.setupEventListeners();
        this.renderEvents();
        this.renderFeaturedEvents();
    }

    setupEventListeners() {
        const searchInput = document.getElementById('eventSearch');
        const categoryFilter = document.getElementById('categoryFilter');
        const dateFilter = document.getElementById('dateFilter');
        const locationFilter = document.getElementById('locationFilter');

        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterEvents());
        }
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.filterEvents());
        }
        if (dateFilter) {
            dateFilter.addEventListener('change', () => this.filterEvents());
        }
        if (locationFilter) {
            locationFilter.addEventListener('change', () => this.filterEvents());
        }
    }

    getMockEvents() {
        return [
            {
                id: 1,
                title: "Mindfulness Workshop",
                category: "workshop",
                date: "2024-02-15",
                time: "10:00 AM",
                location: "Virtual",
                description: "Join us for a guided mindfulness session focused on stress reduction and mental clarity.",
                featured: true
            },
            {
                id: 2,
                title: "Networking Mixer",
                category: "networking",
                date: "2024-02-20",
                time: "6:00 PM",
                location: "Downtown Hub",
                description: "Connect with fellow members in a relaxed atmosphere.",
                featured: true
            },
            {
                id: 3,
                title: "Personal Growth Seminar",
                category: "seminar",
                date: "2024-02-25",
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

        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const category = categoryFilter ? categoryFilter.value : '';
        const dateFilterValue = dateFilter ? dateFilter.value : '';
        const location = locationFilter ? locationFilter.value : '';

        const filteredEvents = this.events.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchTerm) ||
                                event.description.toLowerCase().includes(searchTerm);
            const matchesCategory = !category || event.category === category;
            const matchesLocation = !location || 
                                  (location === 'virtual' && event.location === 'Virtual') ||
                                  (location === 'in-person' && event.location !== 'Virtual');
            const matchesDate = this.checkDateFilter(event.date, dateFilterValue);

            return matchesSearch && matchesCategory && matchesLocation && matchesDate;
        });

        this.renderEvents(filteredEvents);
    }

    checkDateFilter(eventDate, filter) {
        if (!filter) return true;

        const today = new Date();
        const eventDateTime = new Date(eventDate);
        
        switch(filter) {
            case 'today':
                return eventDateTime.toDateString() === today.toDateString();
            case 'week':
                const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                return eventDateTime >= today && eventDateTime <= weekFromNow;
            case 'month':
                return eventDateTime.getMonth() === today.getMonth() &&
                       eventDateTime.getFullYear() === today.getFullYear();
            default:
                return true;
        }
    }

    renderFeaturedEvents() {
        const featuredEventsGrid = document.querySelector('.events-grid');
        if (!featuredEventsGrid) return;

        const featuredEvents = this.events.filter(event => event.featured);
        
        featuredEventsGrid.innerHTML = featuredEvents.map(event => `
            <div class="event-card">
                <div class="event-card-content">
                    <img src="images/logo.svg" alt="Event Logo" class="event-logo">
                    <h3>${event.title}</h3>
                    <div class="event-meta">
                        <span><i class="far fa-calendar"></i> ${new Date(event.date).toLocaleDateString()}</span>
                        <span><i class="far fa-clock"></i> ${event.time}</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
                    </div>
                    <p>${event.description}</p>
                    <button class="btn-register" onclick="registerForEvent(${event.id})">Register Now</button>
                </div>
            </div>
        `).join('');
    }

    renderEvents(eventsToRender = this.events) {
        const eventsList = document.querySelector('.events-list');
        if (!eventsList) return;

        eventsList.innerHTML = eventsToRender.map(event => {
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
                            <span><i class="far fa-clock"></i> ${event.time}</span>
                            <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
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
    }

    get monthNames() {
        return ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
    }
}

// Event registration handler
function registerForEvent(eventId) {
    console.log(`Registering for event ${eventId}`);
    alert('Registration feature coming soon!');
}

// Event details handler
function showEventDetails(eventId) {
    console.log(`Showing details for event ${eventId}`);
    alert('Event details feature coming soon!');
}

// Initialize calendar and event manager
new Calendar();
new EventManager();
