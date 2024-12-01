// Initialize Firebase Auth State
let currentUser = null;
let authInitialized = false;

// Wait for Firebase Auth to initialize and return a promise
function waitForAuth() {
    return new Promise((resolve) => {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            unsubscribe();
            resolve(user);
        });
    });
}

// Initialize Progress Page
async function initializeProgress() {
    try {
        // Set persistence to LOCAL
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        
        // Wait for auth state
        const user = await waitForAuth();
        
        if (user) {
            currentUser = user;
            await loadUserProgress();
            initializeTree();
            setupProgressTracking();
        } else {
            // Store the current URL before redirecting
            sessionStorage.setItem('redirectUrl', window.location.href);
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Error initializing progress:', error);
        window.location.href = 'login.html';
    }
}

// Load User Progress Data
async function loadUserProgress() {
    try {
        const userDoc = await firebase.firestore()
            .collection('users')
            .doc(currentUser.uid)
            .get();

        if (userDoc.exists) {
            const userData = userDoc.data();
            updatePointsDisplay(userData.points || 0);
            updateStreakDisplay(userData.streak || 0);
            updateNextMilestone(userData.points || 0);
            return userData;
        } else {
            // Initialize new user data
            const initialData = {
                points: 0,
                streak: 0,
                lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                achievements: [],
                skillLevels: {
                    social: 0,
                    emotional: 0,
                    communication: 0
                }
            };
            
            await firebase.firestore()
                .collection('users')
                .doc(currentUser.uid)
                .set(initialData);
            
            updatePointsDisplay(0);
            updateStreakDisplay(0);
            updateNextMilestone(0);
            return initialData;
        }
    } catch (error) {
        console.error('Error loading user progress:', error);
        throw error;
    }
}

// Tree Visualization
function initializeTree() {
    try {
        const canvas = document.getElementById('treeCanvas');
        if (!canvas) {
            console.error('Canvas element not found');
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Could not get canvas context');
            return;
        }
        
        // Set canvas size with proper scaling
        function resizeCanvas() {
            const container = canvas.parentElement;
            if (!container) return;

            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            
            // Maintain aspect ratio
            const scale = window.devicePixelRatio || 1;
            canvas.style.width = canvas.width + 'px';
            canvas.style.height = canvas.height + 'px';
            canvas.width *= scale;
            canvas.height *= scale;
            ctx.scale(scale, scale);
            
            drawTree(ctx, canvas);
        }

        // Initial resize
        resizeCanvas();
        
        // Handle window resize
        window.addEventListener('resize', resizeCanvas);
    } catch (error) {
        console.error('Error initializing tree:', error);
    }
}

// Draw the growth tree
function drawTree(ctx, canvas) {
    try {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw trunk
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height);
        ctx.lineTo(canvas.width / 2, canvas.height * 0.7);
        ctx.strokeStyle = '#795548';
        ctx.lineWidth = 20;
        ctx.stroke();
        
        // Draw basic branches (placeholder)
        drawBranch(ctx, canvas.width / 2, canvas.height * 0.7, -Math.PI / 4, canvas.width * 0.15);
        drawBranch(ctx, canvas.width / 2, canvas.height * 0.7, Math.PI / 4, canvas.width * 0.15);
    } catch (error) {
        console.error('Error drawing tree:', error);
    }
}

function drawBranch(ctx, startX, startY, angle, length) {
    try {
        const endX = startX + Math.cos(angle) * length;
        const endY = startY - Math.sin(angle) * length;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = '#795548';
        ctx.lineWidth = 10;
        ctx.stroke();
        
        // Draw some basic leaves
        if (length < 50) {
            drawLeaf(ctx, endX, endY);
        } else {
            // Recursively draw smaller branches
            drawBranch(ctx, endX, endY, angle - Math.PI / 4, length * 0.7);
            drawBranch(ctx, endX, endY, angle + Math.PI / 4, length * 0.7);
        }
    } catch (error) {
        console.error('Error drawing branch:', error);
    }
}

function drawLeaf(ctx, x, y) {
    try {
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#4CAF50';
        ctx.fill();
    } catch (error) {
        console.error('Error drawing leaf:', error);
    }
}

// Points Display Updates
function updatePointsDisplay(points) {
    try {
        const pointsElement = document.querySelector('.points-value');
        if (pointsElement) {
            pointsElement.textContent = points;
        }
    } catch (error) {
        console.error('Error updating points display:', error);
    }
}

function updateStreakDisplay(streak) {
    try {
        const streakElement = document.querySelector('.streak-days');
        if (streakElement) {
            streakElement.textContent = `${streak} days`;
        }
    } catch (error) {
        console.error('Error updating streak display:', error);
    }
}

function updateNextMilestone(currentPoints) {
    try {
        const milestones = [100, 250, 500, 1000, 2500, 5000, 10000];
        const nextMilestone = milestones.find(m => m > currentPoints) || 'Max Level';
        const milestoneElement = document.querySelector('.milestone-points');
        if (milestoneElement) {
            milestoneElement.textContent = `${nextMilestone} points`;
        }
    } catch (error) {
        console.error('Error updating milestone display:', error);
    }
}

// Progress Tracking Setup
function setupProgressTracking() {
    try {
        if (!currentUser) {
            console.error('No user found for progress tracking');
            return;
        }

        // Listen for real-time updates
        const unsubscribe = firebase.firestore()
            .collection('users')
            .doc(currentUser.uid)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    updatePointsDisplay(data.points || 0);
                    updateStreakDisplay(data.streak || 0);
                    updateNextMilestone(data.points || 0);
                }
            }, (error) => {
                console.error('Error setting up progress tracking:', error);
            });

        // Clean up listener on page unload
        window.addEventListener('unload', () => {
            unsubscribe();
        });
    } catch (error) {
        console.error('Error in progress tracking setup:', error);
    }
}

// Initialize the page when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        initializeProgress();
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});
