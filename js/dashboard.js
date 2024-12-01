// Get Firebase instances from window globals
const { auth, db } = window;

// DOM Elements
const userMenuButton = document.querySelector('.user-menu-button');
const dropdownMenu = document.querySelector('.dropdown-menu');
const signOutButton = document.querySelector('.sign-out');
const memberNameElements = document.querySelectorAll('.member-name');
const usernameElement = document.querySelector('.username');
const treeCanvas = document.getElementById('treeCanvas');
const ctx = treeCanvas.getContext('2d');

// Growth Tree Configuration
const treeConfig = {
    baseColor: '#2E7D32',
    leafColors: ['#81C784', '#66BB6A', '#4CAF50', '#43A047'],
    branchWidth: 8,
    maxDepth: 8,
    angle: Math.PI / 4,
    lengthFactor: 0.8,
    skills: [
        'Communication',
        'Emotional Intelligence',
        'Social Awareness',
        'Self Expression',
        'Active Listening',
        'Body Language',
        'Empathy',
        'Conflict Resolution'
    ]
};

// Daily Lessons
const dailyLessons = [
    {
        id: 'lesson1',
        title: 'Body Language Basics',
        duration: '5 mins',
        icon: 'fas fa-user',
        points: 100
    },
    {
        id: 'lesson2',
        title: 'Active Listening Skills',
        duration: '5 mins',
        icon: 'fas fa-ear-listen',
        points: 100
    },
    {
        id: 'lesson3',
        title: 'Emotional Intelligence',
        duration: '5 mins',
        icon: 'fas fa-heart-pulse',
        points: 100
    }
];

// Initialize canvas size
function initCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = treeCanvas.getBoundingClientRect();
    
    treeCanvas.width = rect.width * dpr;
    treeCanvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);
    treeCanvas.style.width = `${rect.width}px`;
    treeCanvas.style.height = `${rect.height}px`;
}

// Draw tree branch
function drawBranch(startX, startY, length, angle, depth) {
    if (depth === 0) {
        drawLeaf(startX, startY);
        return;
    }

    const endX = startX + length * Math.cos(angle);
    const endY = startY - length * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = treeConfig.baseColor;
    ctx.lineWidth = treeConfig.branchWidth * (depth / treeConfig.maxDepth);
    ctx.stroke();

    const newLength = length * treeConfig.lengthFactor;
    
    drawBranch(endX, endY, newLength, angle + treeConfig.angle, depth - 1);
    drawBranch(endX, endY, newLength, angle - treeConfig.angle, depth - 1);
}

// Draw leaf
function drawLeaf(x, y) {
    const leafColor = treeConfig.leafColors[Math.floor(Math.random() * treeConfig.leafColors.length)];
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = leafColor;
    ctx.fill();
}

// Draw growth tree
function drawTree(progress) {
    ctx.clearRect(0, 0, treeCanvas.width, treeCanvas.height);
    const startX = treeCanvas.width / (2 * window.devicePixelRatio);
    const startY = treeCanvas.height / (1.2 * window.devicePixelRatio);
    const initialLength = treeCanvas.height / (3 * window.devicePixelRatio);
    
    drawBranch(startX, startY, initialLength, Math.PI / 2, Math.floor(progress * treeConfig.maxDepth));
}

// Update progress ring
function updateProgressRing(completed, total) {
    const circle = document.querySelector('.progress-ring-circle');
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (completed / total) * circumference;
    
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = offset;
    
    document.querySelector('.progress-text').textContent = `${completed}/${total}`;
}

// Load daily lessons
function loadDailyLessons() {
    const lessonsList = document.querySelector('.lessons-list');
    lessonsList.innerHTML = '';

    dailyLessons.forEach(lesson => {
        const lessonElement = document.createElement('div');
        lessonElement.className = 'lesson-item';
        lessonElement.innerHTML = `
            <div class="lesson-icon">
                <i class="${lesson.icon}"></i>
            </div>
            <div class="lesson-content">
                <div class="lesson-title">${lesson.title}</div>
                <div class="lesson-duration">${lesson.duration}</div>
            </div>
            <span class="lesson-status status-incomplete">Start</span>
        `;
        
        lessonElement.addEventListener('click', () => startLesson(lesson.id));
        lessonsList.appendChild(lessonElement);
    });
}

// Start lesson
async function startLesson(lessonId) {
    try {
        const userId = auth.currentUser.uid;
        const lessonRef = db.collection('userLessons').doc(`${userId}_${lessonId}`);
        
        await lessonRef.set({
            userId,
            lessonId,
            completed: true,
            completedAt: new Date()
        });

        // Update UI
        const lessonElement = document.querySelector(`[data-lesson-id="${lessonId}"]`);
        if (lessonElement) {
            const statusElement = lessonElement.querySelector('.lesson-status');
            statusElement.className = 'lesson-status status-complete';
            statusElement.textContent = 'Complete';
        }

        // Update points
        await updatePoints(100); // Award points for lesson completion
    } catch (error) {
        console.error('Error completing lesson:', error);
    }
}

// Update points
async function updatePoints(pointsToAdd) {
    try {
        const userId = auth.currentUser.uid;
        const userRef = db.collection('users').doc(userId);
        
        await db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            const currentPoints = userDoc.data()?.points || 0;
            
            transaction.update(userRef, {
                points: currentPoints + pointsToAdd
            });
        });

        // Update points display
        loadUserRewards(userId);
    } catch (error) {
        console.error('Error updating points:', error);
    }
}

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

            // Initialize dashboard components
            initCanvas();
            loadDailyLessons();
            
            // Load user data
            await Promise.all([
                loadUserProgress(user.uid),
                loadUserRewards(user.uid),
                loadUpcomingEvents()
            ]);

            // Initial tree drawing
            drawTree(userData.progress || 0);

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
            totalPracticeTime: 0,
            completedLessons: 0
        };

        // Update progress stats
        document.querySelector('.progress-stats .stat:nth-child(1) .stat-value')
            .textContent = progressData.challengesCompleted;
        document.querySelector('.progress-stats .stat:nth-child(2) .stat-value')
            .textContent = `${progressData.currentStreak} days`;
        document.querySelector('.progress-stats .stat:nth-child(3) .stat-value')
            .textContent = `${progressData.totalPracticeTime} hours`;

        // Update lesson progress
        updateProgressRing(progressData.completedLessons || 0, dailyLessons.length);

        // Update tree stats
        document.querySelector('.skills-count').textContent = progressData.masteredSkills || 0;
        document.querySelector('.growing-count').textContent = progressData.growingSkills || 0;

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
            nextRewardAt: 1000,
            dailyPoints: {
                checkIn: 0,
                lessons: 0,
                challenges: 0
            }
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

        // Update daily points breakdown
        const dailyPoints = rewardsData.dailyPoints;
        document.querySelector('.points-list li:nth-child(1) .points-value')
            .textContent = `+${dailyPoints.checkIn}/50`;
        document.querySelector('.points-list li:nth-child(2) .points-value')
            .textContent = `+${dailyPoints.lessons}/300`;
        document.querySelector('.points-list li:nth-child(3) .points-value')
            .textContent = `+${dailyPoints.challenges}/150`;

    } catch (error) {
        console.error('Error loading rewards:', error);
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

// Handle window resize
window.addEventListener('resize', () => {
    initCanvas();
    const user = auth.currentUser;
    if (user) {
        db.collection('users').doc(user.uid).get()
            .then(doc => {
                const userData = doc.data() || {};
                drawTree(userData.progress || 0);
            })
            .catch(error => console.error('Error redrawing tree:', error));
    }
});
