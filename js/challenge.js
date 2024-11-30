document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const startButton = document.getElementById('startChallenge');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.querySelector('.progress-text');
    const dayGrid = document.getElementById('dayGrid');
    const taskTitle = document.getElementById('taskTitle');
    const taskDescription = document.getElementById('taskDescription');
    const completeButton = document.getElementById('completeTask');

    // Challenge state
    let challengeStarted = false;
    let currentDay = 0;
    const totalDays = 30;
    let completedDays = [];

    // Challenge tasks
    const tasks = [
        { title: 'Morning Meditation', description: 'Start your day with a 10-minute meditation session.' },
        { title: 'Gratitude Journal', description: 'Write down three things you\'re grateful for today.' },
        { title: 'Mindful Walking', description: 'Take a 15-minute mindful walk, focusing on each step.' },
        { title: 'Digital Detox', description: 'Spend 2 hours away from all digital devices.' },
        { title: 'Deep Breathing', description: 'Practice deep breathing exercises for 5 minutes.' },
        { title: 'Mindful Eating', description: 'Eat one meal today with complete mindfulness.' },
        { title: 'Body Scan', description: 'Perform a 10-minute body scan meditation.' },
        { title: 'Journaling', description: 'Write about your thoughts and feelings for 15 minutes.' },
        { title: 'Nature Connection', description: 'Spend 20 minutes in nature, observing mindfully.' },
        { title: 'Loving-Kindness', description: 'Practice loving-kindness meditation for 10 minutes.' },
        { title: 'Mindful Listening', description: 'Listen to music mindfully for 15 minutes.' },
        { title: 'Stress Check', description: 'Identify and write down your stress triggers.' },
        { title: 'Mindful Movement', description: 'Practice gentle yoga or stretching for 15 minutes.' },
        { title: 'Thought Observation', description: 'Observe your thoughts without judgment for 10 minutes.' },
        { title: 'Creative Expression', description: 'Engage in any form of creative activity mindfully.' },
        { title: 'Silent Time', description: 'Spend 30 minutes in complete silence.' },
        { title: 'Emotional Awareness', description: 'Track and label your emotions throughout the day.' },
        { title: 'Mindful Communication', description: 'Practice mindful listening in conversations today.' },
        { title: 'Sensory Awareness', description: 'Focus on each of your five senses for 3 minutes each.' },
        { title: 'Gratitude Letter', description: 'Write a letter of gratitude to someone important.' },
        { title: 'Mind-Body Connection', description: 'Practice progressive muscle relaxation.' },
        { title: 'Mindful Planning', description: 'Plan your next day with full awareness.' },
        { title: 'Self-Compassion', description: 'Practice self-compassion meditation for 15 minutes.' },
        { title: 'Mindful Home', description: 'Declutter one space mindfully.' },
        { title: 'Energy Awareness', description: 'Monitor your energy levels throughout the day.' },
        { title: 'Boundary Setting', description: 'Practice setting mindful boundaries today.' },
        { title: 'Value Reflection', description: 'Reflect on and write about your core values.' },
        { title: 'Mindful Review', description: 'Review your day mindfully before sleep.' },
        { title: 'Future Vision', description: 'Visualize your ideal mindful future for 15 minutes.' },
        { title: 'Integration', description: 'Reflect on your 30-day journey and set future intentions.' }
    ];

    // Initialize challenge grid
    function initializeGrid() {
        dayGrid.innerHTML = '';
        for (let i = 1; i <= totalDays; i++) {
            const dayItem = document.createElement('div');
            dayItem.className = 'day-item';
            dayItem.textContent = i;
            dayGrid.appendChild(dayItem);
        }
        updateGrid();
    }

    // Update progress
    function updateProgress() {
        const progress = (completedDays.length / totalDays) * 100;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${Math.round(progress)}%`;
    }

    // Update grid display
    function updateGrid() {
        const dayItems = dayGrid.getElementsByClassName('day-item');
        Array.from(dayItems).forEach((item, index) => {
            item.classList.remove('completed', 'active');
            if (completedDays.includes(index + 1)) {
                item.classList.add('completed');
            }
            if (index + 1 === currentDay) {
                item.classList.add('active');
            }
        });
    }

    // Update task display
    function updateTask() {
        if (!challengeStarted) {
            taskTitle.textContent = 'Welcome to Day 1';
            taskDescription.textContent = 'Your journey to clarity begins today. Click \'Start Challenge\' to begin.';
            completeButton.disabled = true;
        } else {
            const task = tasks[currentDay - 1];
            taskTitle.textContent = `Day ${currentDay}: ${task.title}`;
            taskDescription.textContent = task.description;
            completeButton.disabled = completedDays.includes(currentDay);
        }
    }

    // Start challenge
    startButton.addEventListener('click', () => {
        if (!challengeStarted) {
            challengeStarted = true;
            currentDay = 1;
            startButton.textContent = 'Challenge In Progress';
            startButton.disabled = true;
            completeButton.disabled = false;
            updateTask();
            updateGrid();
        }
    });

    // Complete task
    completeButton.addEventListener('click', () => {
        if (challengeStarted && !completedDays.includes(currentDay)) {
            completedDays.push(currentDay);
            updateProgress();
            updateGrid();
            completeButton.disabled = true;

            if (currentDay < totalDays) {
                currentDay++;
                updateTask();
            } else {
                taskTitle.textContent = 'Congratulations!';
                taskDescription.textContent = 'You\'ve completed the 30-Day Clarity Challenge!';
                completeButton.style.display = 'none';
            }
        }
    });

    // Initialize challenge
    initializeGrid();
    updateProgress();
    updateTask();
});
