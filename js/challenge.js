// Enhanced Challenge System with Firebase integration
document.addEventListener('DOMContentLoaded', () => {
    console.log('Challenge script loaded');

    // Cache DOM elements for performance
    const elements = {
        emailInput: document.getElementById('emailInput'),
        submitEmail: document.getElementById('submitEmail'),
        emailError: document.getElementById('emailError'),
        emailSuccess: document.getElementById('emailSuccess'),
        progressBar: document.getElementById('progressBar'),
        progressText: document.querySelector('.progress-text'),
        dayGrid: document.getElementById('dayGrid'),
        taskTitle: document.getElementById('taskTitle'),
        taskDescription: document.getElementById('taskDescription'),
        completeButton: document.getElementById('completeTask')
    };

    console.log('Elements found:', {
        emailInput: !!elements.emailInput,
        submitEmail: !!elements.submitEmail,
        emailError: !!elements.emailError,
        emailSuccess: !!elements.emailSuccess
    });

    // Email validation function
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // Handle email submission
    if (elements.submitEmail && elements.emailInput) {
        console.log('Setting up email submission handler');
        
        elements.submitEmail.addEventListener('click', async (e) => {
            console.log('Submit button clicked');
            e.preventDefault();
            
            // Clear previous messages
            if (elements.emailError) elements.emailError.textContent = '';
            if (elements.emailSuccess) elements.emailSuccess.textContent = '';

            const email = elements.emailInput.value.trim();
            console.log('Email entered:', email);

            // Validate email
            if (!email) {
                console.log('No email provided');
                if (elements.emailError) elements.emailError.textContent = 'Please enter your email address.';
                return;
            }

            if (!isValidEmail(email)) {
                console.log('Invalid email format');
                if (elements.emailError) elements.emailError.textContent = 'Please enter a valid email address.';
                return;
            }

            try {
                console.log('Attempting to register email in Firebase');
                // Disable button and show loading state
                elements.submitEmail.disabled = true;
                elements.submitEmail.textContent = 'Processing...';

                // Initialize user in Firebase
                const docRef = db.collection('challenge_participants').doc(email);
                const doc = await docRef.get();

                if (!doc.exists) {
                    console.log('Creating new user document');
                    await docRef.set({
                        email: email,
                        currentDay: 1,
                        completedDays: [],
                        lastCompletionTime: null,
                        badges: {},
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }

                // Store email in localStorage
                localStorage.setItem('challengeEmail', email);
                console.log('Email stored in localStorage');

                // Show success message
                if (elements.emailSuccess) {
                    elements.emailSuccess.textContent = 'Successfully registered! Redirecting...';
                }

                // Redirect to dashboard after a short delay
                console.log('Preparing to redirect to dashboard');
                setTimeout(() => {
                    window.location.href = 'challenge-dashboard.html';
                }, 1500);

            } catch (error) {
                console.error('Error registering email:', error);
                if (elements.emailError) {
                    elements.emailError.textContent = 'An error occurred. Please try again.';
                }
                // Reset button state
                elements.submitEmail.disabled = false;
                elements.submitEmail.textContent = 'Start Challenge';
            }
        });
    } else {
        console.log('Email submission elements not found on this page');
    }

    // Check if we're on the challenge page or dashboard
    const isDashboard = window.location.pathname.includes('challenge-dashboard.html');
    console.log('Is dashboard page:', isDashboard);

    // Rest of the dashboard functionality
    if (isDashboard) {
        // Task definitions with times
        const tasks = [
            { 
                title: "Start a Conversation", 
                description: "Initiate a conversation with someone new today.",
                time: "10:00 AM"
            },
            { 
                title: "Active Listening", 
                description: "Practice active listening in your next conversation.",
                time: "2:00 PM"
            },
            { 
                title: "Body Language", 
                description: "Focus on maintaining open body language today.",
                time: "11:30 AM"
            },
            { 
                title: "Group Interaction", 
                description: "Participate in a group discussion or activity.",
                time: "3:30 PM"
            },
            { 
                title: "Public Speaking", 
                description: "Share your thoughts in front of others today.",
                time: "1:30 PM"
            }
        ];

        // Show completion popup and redirect
        function showCompletionPopup() {
            const popup = document.createElement('div');
            popup.className = 'completion-popup';
            popup.innerHTML = `
                <div class="completion-content">
                    <i class="fas fa-trophy completion-icon"></i>
                    <h2>Congratulations!</h2>
                    <p>You've completed the 30-day social confidence challenge!</p>
                    <p>Ready to take your social confidence to the next level?</p>
                    <button class="continue-button">Continue Your Journey</button>
                </div>
            `;
            document.body.appendChild(popup);

            // Add animation class after a brief delay
            setTimeout(() => popup.classList.add('show'), 100);

            // Handle continue button
            const continueButton = popup.querySelector('.continue-button');
            continueButton.addEventListener('click', () => {
                window.location.href = 'membership.html';
            });

            // Auto-redirect after 5 seconds
            setTimeout(() => {
                window.location.href = 'membership.html';
            }, 5000);
        }

        // Update progress bar and text
        function updateProgress(completedDays) {
            console.log('Updating progress:', completedDays);
            const progress = (completedDays.length / 30) * 100;
            if (elements.progressBar) {
                elements.progressBar.style.width = `${progress}%`;
                elements.progressText.textContent = `${Math.round(progress)}%`;
                
                elements.progressBar.classList.add('progress-update');
                setTimeout(() => {
                    elements.progressBar.classList.remove('progress-update');
                }, 1000);
            }

            // Check if challenge is complete
            if (completedDays.length >= 30) {
                showCompletionPopup();
            }
        }

        // Update day grid with completed days
        function updateDayGrid(currentDay, completedDays) {
            console.log('Updating day grid:', { currentDay, completedDays });
            if (elements.dayGrid) {
                elements.dayGrid.innerHTML = '';
                for (let i = 1; i <= 30; i++) {
                    const dayElement = document.createElement('div');
                    dayElement.className = 'day-item';
                    if (completedDays.includes(i)) {
                        dayElement.classList.add('completed');
                    }
                    if (i === currentDay && currentDay <= 30) {
                        dayElement.classList.add('current');
                    }
                    dayElement.textContent = i;
                    elements.dayGrid.appendChild(dayElement);
                }
            }
        }

        // Update task display
        function updateTask(day) {
            console.log('Updating task for day:', day);
            // If challenge is complete, hide the task section
            if (day > 30) {
                const taskSection = document.getElementById('dailyTask');
                if (taskSection) {
                    taskSection.style.display = 'none';
                }
                return;
            }

            const taskIndex = (day - 1) % tasks.length;
            const task = tasks[taskIndex];
            
            if (elements.taskTitle) {
                elements.taskTitle.textContent = `Day ${day}: ${task.title}`;
                // Create or update time element
                let timeElement = document.querySelector('.task-time');
                if (!timeElement) {
                    timeElement = document.createElement('div');
                    timeElement.className = 'task-time';
                    elements.taskTitle.parentNode.insertBefore(timeElement, elements.taskDescription);
                }
                timeElement.textContent = `Today's task time: ${task.time}`;
            }
            if (elements.taskDescription) {
                elements.taskDescription.textContent = task.description;
            }
        }

        // Initialize user data if needed
        async function initializeUserData(userEmail) {
            console.log('Initializing user data for:', userEmail);
            try {
                const docRef = db.collection('challenge_participants').doc(userEmail);
                const doc = await docRef.get();
                
                if (!doc.exists) {
                    console.log('Creating new user data');
                    await docRef.set({
                        email: userEmail,
                        currentDay: 1,
                        completedDays: [],
                        lastCompletionTime: null,
                        badges: {},
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }
                return true;
            } catch (error) {
                console.error('Error initializing user data:', error);
                return false;
            }
        }

        // Initialize dashboard
        console.log('Initializing dashboard');
        const userEmail = localStorage.getItem('challengeEmail');
        if (userEmail) {
            initializeUserData(userEmail).then(() => {
                db.collection('challenge_participants').doc(userEmail).get().then(doc => {
                    if (doc.exists) {
                        const data = doc.data();
                        console.log('Loading user data:', data);
                        updateProgress(data.completedDays || []);
                        updateDayGrid(data.currentDay || 1, data.completedDays || []);
                        updateTask(data.currentDay || 1);
                    }
                }).catch(error => {
                    console.error('Error loading dashboard:', error);
                });
            });
        } else {
            console.log('No user email found, redirecting to challenge page');
            window.location.href = 'challenge.html';
        }

        // Handle task completion
        if (elements.completeButton) {
            elements.completeButton.addEventListener('click', async () => {
                console.log('Complete button clicked');
                try {
                    const docRef = db.collection('challenge_participants').doc(userEmail);
                    const doc = await docRef.get();
                    
                    if (!doc.exists) {
                        const initialized = await initializeUserData(userEmail);
                        if (!initialized) return;
                    }
                    
                    const data = doc.data() || { currentDay: 1, completedDays: [] };
                    const currentDay = data.currentDay || 1;
                    const completedDays = data.completedDays || [];
                    
                    // Don't allow completion beyond 30 days
                    if (currentDay > 30) {
                        showCompletionPopup();
                        return;
                    }
                    
                    console.log('Current state:', { currentDay, completedDays });
                    
                    if (!completedDays.includes(currentDay)) {
                        completedDays.push(currentDay);
                        const now = firebase.firestore.Timestamp.now();
                        
                        // Immediately update UI
                        updateProgress(completedDays);
                        updateDayGrid(currentDay + 1, completedDays);
                        updateTask(currentDay + 1);
                        
                        // Add completion animation
                        elements.completeButton.classList.add('clicked');
                        elements.completeButton.disabled = true;
                        
                        // Update Firebase
                        await docRef.update({
                            email: userEmail,
                            completedDays: completedDays,
                            currentDay: currentDay + 1,
                            lastCompletionTime: now,
                            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                        });
                        
                        console.log('Progress updated successfully');
                        
                        setTimeout(() => {
                            elements.completeButton.disabled = false;
                            elements.completeButton.classList.remove('clicked');
                        }, 1500);
                    }
                } catch (error) {
                    console.error('Error updating progress:', error);
                }
            });
        }
    }
});
