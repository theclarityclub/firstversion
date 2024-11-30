// Enhanced Challenge System with engaging interactions
document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements for performance
    const elements = {
        emailOverlay: document.getElementById('emailOverlay'),
        emailInput: document.getElementById('emailInput'),
        submitEmail: document.getElementById('submitEmail'),
        emailError: document.getElementById('emailError'),
        emailSuccess: document.getElementById('emailSuccess'),
        challengeContent: document.getElementById('challengeContent'),
        startButton: document.getElementById('startChallenge'),
        progressBar: document.getElementById('progressBar'),
        progressText: document.querySelector('.progress-text'),
        dayGrid: document.getElementById('dayGrid'),
        taskTitle: document.getElementById('taskTitle'),
        taskDescription: document.getElementById('taskDescription'),
        completeButton: document.getElementById('completeTask')
    };

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Handle email submission
    elements.submitEmail?.addEventListener('click', async () => {
        const email = elements.emailInput?.value.trim();
        elements.emailError.textContent = '';
        elements.emailSuccess.textContent = '';
        
        if (!email) {
            elements.emailError.textContent = 'Please enter your email address';
            return;
        }
        
        if (!isValidEmail(email)) {
            elements.emailError.textContent = 'Please enter a valid email address';
            return;
        }

        try {
            // Save email to Firebase
            await db.collection('emails').add({
                email: email,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            elements.emailSuccess.textContent = 'Thank you for joining the challenge!';
            localStorage.setItem('challengeEmail', email); // Keep local copy for UI state
            
            // Hide overlay and show content with animation
            elements.emailOverlay.style.opacity = '0';
            setTimeout(() => {
                elements.emailOverlay.style.display = 'none';
                elements.challengeContent.style.display = 'block';
                requestAnimationFrame(() => {
                    elements.challengeContent.style.opacity = '1';
                });
            }, 300);
        } catch (error) {
            elements.emailError.textContent = 'There was an error saving your email. Please try again.';
            console.error('Error saving email:', error);
        }
    });

    // Check if email is already provided
    const storedEmail = localStorage.getItem('challengeEmail');
    if (storedEmail) {
        elements.emailOverlay.style.display = 'none';
        elements.challengeContent.style.display = 'block';
        elements.challengeContent.style.opacity = '1';
    }

    // Challenge state with optimized data structure
    const state = {
        challengeStarted: false,
        currentDay: 0,
        totalDays: 30,
        completedDays: new Set(), // Using Set for O(1) lookups
        tasks: new Map([ // Using Map for O(1) access
            [1, { title: 'Smile and Wave', description: 'Practice smiling and waving at 3 people today. Notice how it makes you feel.' }],
            [2, { title: 'Small Talk Practice', description: 'Make a simple comment about the weather to someone (cashier, barista, etc.).' }],
            [3, { title: 'Eye Contact Exercise', description: 'Practice maintaining comfortable eye contact during one conversation today.' }],
            [4, { title: 'Compliment Someone', description: 'Give a genuine compliment to someone about something specific.' }],
            [5, { title: 'Ask Questions', description: 'Ask someone how their day is going and practice active listening.' }],
            [6, { title: 'Join a Conversation', description: 'Contribute one comment to an existing conversation with friends or colleagues.' }],
            [7, { title: 'Share an Opinion', description: 'Express your opinion on a safe topic (like food or movies) in a group setting.' }],
            [8, { title: 'Body Language Focus', description: 'Practice open body language in public spaces for 30 minutes.' }],
            [9, { title: 'Initiative Taking', description: 'Initiate a conversation with someone you see regularly but haven\'t talked to.' }],
            [10, { title: 'Social Media Engagement', description: 'Leave three thoughtful comments on social media posts.' }],
            [11, { title: 'Phone Challenge', description: 'Make a phone call instead of sending a text or email.' }],
            [12, { title: 'Group Participation', description: 'Actively participate in a group discussion or meeting.' }],
            [13, { title: 'Story Sharing', description: 'Share a brief personal story or experience with someone.' }],
            [14, { title: 'Active Listening', description: 'Practice repeating back what someone says to show you\'re listening.' }],
            [15, { title: 'Social Planning', description: 'Invite someone to join you for coffee or lunch.' }],
            [16, { title: 'Networking Practice', description: 'Introduce yourself to someone new in a professional or social setting.' }],
            [17, { title: 'Public Speaking', description: 'Speak up in a group setting or meeting, even briefly.' }],
            [18, { title: 'Boundary Setting', description: 'Practice saying "no" politely to a small request.' }],
            [19, { title: 'Conflict Resolution', description: 'Address a minor disagreement or misunderstanding constructively.' }],
            [20, { title: 'Social Event', description: 'Attend a social gathering and talk to at least two new people.' }],
            [21, { title: 'Deep Conversation', description: 'Have a meaningful conversation beyond small talk with someone.' }],
            [22, { title: 'Group Leadership', description: 'Take the lead in organizing a small group activity or decision.' }],
            [23, { title: 'Vulnerability Practice', description: 'Share something personal (but appropriate) with someone you trust.' }],
            [24, { title: 'Networking Follow-up', description: 'Reach out to someone you met recently to maintain the connection.' }],
            [25, { title: 'Public Participation', description: 'Participate in a public event or community activity.' }],
            [26, { title: 'Assertiveness Practice', description: 'Express your needs or preferences clearly in a social situation.' }],
            [27, { title: 'Social Support', description: 'Offer help or support to someone who might need it.' }],
            [28, { title: 'Conversation Leading', description: 'Lead a group conversation on a topic you\'re knowledgeable about.' }],
            [29, { title: 'Social Challenge', description: 'Step out of your comfort zone in a social situation today.' }],
            [30, { title: 'Reflection & Celebration', description: 'Celebrate your progress by sharing your journey with someone close to you.' }]
        ])
    };

    // Initialize challenge grid with animations
    function initializeGrid() {
        if (!elements.dayGrid) return;

        const fragment = document.createDocumentFragment();
        
        for (let i = 1; i <= state.totalDays; i++) {
            const dayItem = document.createElement('div');
            dayItem.className = 'day-item';
            dayItem.textContent = i;
            
            // Add hover effects
            dayItem.addEventListener('mouseenter', () => {
                if (!state.completedDays.has(i)) {
                    dayItem.style.transform = 'scale(1.1)';
                    dayItem.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                }
            });
            
            dayItem.addEventListener('mouseleave', () => {
                if (!state.completedDays.has(i)) {
                    dayItem.style.transform = 'scale(1)';
                    dayItem.style.boxShadow = 'none';
                }
            });

            // Add click feedback
            dayItem.addEventListener('click', () => {
                if (state.completedDays.has(i)) {
                    const task = state.tasks.get(i);
                    alert(`Day ${i}: ${task.title}\n\nCompleted! 🎉`);
                }
            });

            fragment.appendChild(dayItem);
        }
        
        elements.dayGrid.innerHTML = '';
        elements.dayGrid.appendChild(fragment);
        updateGrid();
    }

    // Update progress with animation
    function updateProgress() {
        const progress = (state.completedDays.size / state.totalDays) * 100;
        
        // Animate progress bar
        if (elements.progressBar) {
            elements.progressBar.style.transition = 'width 0.5s ease-out';
            elements.progressBar.style.width = `${progress}%`;
        }
        
        // Animate progress text
        if (elements.progressText) {
            const currentProgress = parseInt(elements.progressText.textContent);
            animateNumber(currentProgress, Math.round(progress), value => {
                elements.progressText.textContent = `${value}%`;
            });
        }
    }

    // Animate number changes
    function animateNumber(start, end, callback) {
        const duration = 500;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const value = Math.round(start + (end - start) * progress);
            callback(value);
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }

    // Update grid with animations
    function updateGrid() {
        const dayItems = elements.dayGrid?.getElementsByClassName('day-item');
        if (!dayItems) return;

        Array.from(dayItems).forEach((item, index) => {
            const day = index + 1;
            item.classList.remove('completed', 'active');
            
            if (state.completedDays.has(day)) {
                // Add completion animation
                item.classList.add('completed');
                item.style.animation = 'completedPulse 0.5s ease-out';
                item.addEventListener('animationend', () => {
                    item.style.animation = '';
                }, { once: true });
            }
            
            if (day === state.currentDay) {
                // Add active day animation
                item.classList.add('active');
                item.style.animation = 'activePulse 2s infinite';
            }
        });
    }

    // Update task display with animations
    function updateTask() {
        if (!elements.taskTitle || !elements.taskDescription) return;

        // Fade out current content
        elements.taskTitle.style.opacity = '0';
        elements.taskDescription.style.opacity = '0';

        setTimeout(() => {
            if (!state.challengeStarted) {
                elements.taskTitle.textContent = 'Welcome to Day 1';
                elements.taskDescription.textContent = 'Your journey to social confidence begins today. Click \'Start Challenge\' to begin.';
                if (elements.completeButton) {
                    elements.completeButton.disabled = true;
                }
            } else {
                const task = state.tasks.get(state.currentDay);
                if (task) {
                    elements.taskTitle.textContent = `Day ${state.currentDay}: ${task.title}`;
                    elements.taskDescription.textContent = task.description;
                    if (elements.completeButton) {
                        elements.completeButton.disabled = state.completedDays.has(state.currentDay);
                    }
                }
            }

            // Fade in new content
            requestAnimationFrame(() => {
                elements.taskTitle.style.opacity = '1';
                elements.taskDescription.style.opacity = '1';
            });
        }, 300);
    }

    // Start challenge with animations
    elements.startButton?.addEventListener('click', () => {
        if (!state.challengeStarted) {
            // Add button animation
            elements.startButton.classList.add('clicked');
            
            setTimeout(() => {
                state.challengeStarted = true;
                state.currentDay = 1;
                
                elements.startButton.textContent = 'Challenge In Progress';
                elements.startButton.disabled = true;
                elements.startButton.classList.remove('clicked');
                
                if (elements.completeButton) {
                    elements.completeButton.disabled = false;
                }
                
                updateTask();
                updateGrid();
            }, 300);
        }
    });

    // Complete task with animations
    elements.completeButton?.addEventListener('click', () => {
        if (state.challengeStarted && !state.completedDays.has(state.currentDay)) {
            // Add button animation
            elements.completeButton.classList.add('clicked');
            
            setTimeout(() => {
                state.completedDays.add(state.currentDay);
                updateProgress();
                updateGrid();
                elements.completeButton.disabled = true;
                elements.completeButton.classList.remove('clicked');

                if (state.currentDay < state.totalDays) {
                    state.currentDay++;
                    updateTask();
                } else {
                    // Show completion celebration
                    elements.taskTitle.style.animation = 'celebrate 1s ease-out';
                    elements.taskTitle.textContent = 'Congratulations! 🎉';
                    elements.taskDescription.textContent = 'You\'ve completed the 30-Day Social Confidence Challenge!';
                    elements.completeButton.style.display = 'none';
                }
            }, 300);
        }
    });

    // Add hover effects to buttons
    [elements.startButton, elements.completeButton].forEach(button => {
        if (button) {
            button.addEventListener('mouseenter', () => {
                if (!button.disabled) {
                    button.style.transform = 'scale(1.05)';
                }
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'scale(1)';
            });
        }
    });

    // Initialize challenge
    initializeGrid();
    updateProgress();
    updateTask();
});
