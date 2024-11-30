// Get Firebase instances from window globals
const { auth, db } = window;

// DOM Elements
const userMenuButton = document.querySelector('.user-menu-button');
const dropdownMenu = document.querySelector('.dropdown-menu');
const signOutButton = document.querySelector('.sign-out');
const memberNameElements = document.querySelectorAll('.member-name');
const usernameElement = document.querySelector('.username');

// Toggle user menu dropdown
userMenuButton.addEventListener('click', () => {
    dropdownMenu.classList.toggle('active');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!userMenuButton.contains(e.target)) {
        dropdownMenu.classList.remove('active');
    }
});

// Handle sign out
signOutButton.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
        await auth.signOut();
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error signing out:', error);
    }
});

// Check authentication state
auth.onAuthStateChanged(async (user) => {
    if (user) {
        // User is signed in
        try {
            // Get user data from Firestore
            const userDoc = await db.collection('users').doc(user.uid).get();
            const userData = userDoc.data() || {};

            // Update UI with user data
            const displayName = userData.displayName || user.displayName || user.email.split('@')[0];
            memberNameElements.forEach(el => el.textContent = displayName);
            usernameElement.textContent = displayName;

            // Load user's progress
            await loadUserProgress(user.uid);

            // Load user's rewards
            await loadUserRewards(user.uid);

            // Load user's membership details
            await loadMembershipDetails(user.uid);

            // Load upcoming events
            await loadUpcomingEvents();

        } catch (error) {
            console.error('Error loading user data:', error);
        }
    } else {
        // User is not signed in, redirect to login
        window.location.href = 'login.html';
    }
});

// Load user's progress data
async function loadUserProgress(userId) {
    try {
        const progressDoc = await db.collection('progress').doc(userId).get();
        const progressData = progressDoc.data() || {
            challengesCompleted: 0,
            currentStreak: 0,
            totalPracticeTime: 0
        };

        // Update progress stats
        document.querySelector('.progress-stats .stat:nth-child(1) .stat-value')
            .textContent = progressData.challengesCompleted;
        document.querySelector('.progress-stats .stat:nth-child(2) .stat-value')
            .textContent = `${progressData.currentStreak} days`;
        document.querySelector('.progress-stats .stat:nth-child(3) .stat-value')
            .textContent = `${progressData.totalPracticeTime} hours`;

    } catch (error) {
        console.error('Error loading progress:', error);
    }
}

// Load user's rewards data
async function loadUserRewards(userId) {
    try {
        const rewardsDoc = await db.collection('rewards').doc(userId).get();
        const rewardsData = rewardsDoc.data() || {
            points: 0,
            nextRewardAt: 1000
        };

        const points = rewardsData.points;
        const nextRewardAt = rewardsData.nextRewardAt;
        const progress = (points / nextRewardAt) * 100;
        const pointsToNext = nextRewardAt - points;

        // Update rewards UI
        document.querySelector('.points').textContent = points;
        document.querySelector('.rewards-progress p')
            .textContent = `${pointsToNext} points until next reward`;
        document.querySelector('.progress-bar .progress')
            .style.width = `${progress}%`;

    } catch (error) {
        console.error('Error loading rewards:', error);
    }
}

// Load membership details
async function loadMembershipDetails(userId) {
    try {
        const membershipDoc = await db.collection('memberships').doc(userId).get();
        const membershipData = membershipDoc.data() || {
            plan: 'Basic',
            memberSince: new Date().toISOString(),
            nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        };

        // Update membership UI
        document.querySelector('.membership-details .detail-item:nth-child(1) .value')
            .textContent = membershipData.plan;
        document.querySelector('.membership-details .detail-item:nth-child(2) .value')
            .textContent = new Date(membershipData.memberSince).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
        document.querySelector('.membership-details .detail-item:nth-child(3) .value')
            .textContent = new Date(membershipData.nextBilling).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });

        // Update membership status in header
        document.querySelector('.membership-status')
            .textContent = `${membershipData.plan} Member`;

    } catch (error) {
        console.error('Error loading membership details:', error);
    }
}

// Load upcoming events
async function loadUpcomingEvents() {
    try {
        const now = new Date();
        const eventsSnapshot = await db.collection('events')
            .where('date', '>=', now)
            .orderBy('date')
            .limit(2)
            .get();

        const eventsList = document.querySelector('.events-list');
        eventsList.innerHTML = ''; // Clear existing events

        eventsSnapshot.forEach(doc => {
            const event = doc.data();
            const eventDate = event.date.toDate();
            
            const eventHTML = `
                <div class="event-item">
                    <div class="event-date">
                        <span class="day">${eventDate.getDate()}</span>
                        <span class="month">${eventDate.toLocaleString('en-US', { month: 'short' })}</span>
                    </div>
                    <div class="event-details">
                        <h3>${event.title}</h3>
                        <p>${event.startTime} - ${event.endTime}</p>
                    </div>
                    <a href="#" class="cta-secondary" onclick="joinEvent('${doc.id}')">Join</a>
                </div>
            `;
            
            eventsList.insertAdjacentHTML('beforeend', eventHTML);
        });

    } catch (error) {
        console.error('Error loading events:', error);
    }
}

// Join event handler
async function joinEvent(eventId) {
    try {
        const userId = auth.currentUser.uid;
        await db.collection('eventParticipants').add({
            userId: userId,
            eventId: eventId,
            joinedAt: new Date()
        });
        alert('Successfully joined the event!');
    } catch (error) {
        console.error('Error joining event:', error);
        alert('Failed to join event. Please try again.');
    }
}
