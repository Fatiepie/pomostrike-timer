document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');
    const contentWrapper = document.querySelector('.content-wrapper');

    // No need for setTimeout here, as we're using CSS animations

    splashScreen.addEventListener('animationend', (e) => {
        if (e.animationName === 'jumpUp') {
            splashScreen.style.display = 'none';
            contentWrapper.style.opacity = '1';
        }
    });
});

let workTime = 25 * 60; // 25 minutes in seconds
let breakTime = 5 * 60; // 5 minutes in seconds
let fadeDuration = 3; // Fade duration in seconds
let isRunning = false;
let isWorkSession = true;
let timeLeft = workTime;
let timerInterval;
let fadeIntervalId; // Variable to hold fade interval ID

const timerLabel = document.getElementById('timer');
const sessionTitle = document.getElementById('sessionTitle'); // Reference to session title
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const workMusic = new Audio('work_jingle.mp3'); // Create Audio objects
const breakMusic = new Audio('break_jingle.mp3'); // Create Audio objects

// Fade parameters
const fadeInterval = 50; // Interval for fading in milliseconds (adjust as needed for smoother fade)
const fadeStep = 0.02; // Step size for fading (adjust as needed)

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        runTimer();
        startButton.textContent = 'Pause';
    } else {
        isRunning = false;
        clearInterval(timerInterval);
        clearInterval(fadeIntervalId); // Clear fade interval if timer is paused
        startButton.textContent = 'Resume';
    }
}

function runTimer() {
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            timerLabel.textContent = formatTime(timeLeft);
            // Fade in music 3 seconds before timer ends
            if (timeLeft === fadeDuration) {
                fadeIn(isWorkSession ? workMusic : breakMusic); // Start fading in music
            }
        } else {
            clearInterval(timerInterval);
            if (isWorkSession) {
                sessionTitle.textContent = 'Break Session';
                sessionTitle.classList.remove('work-session');
                sessionTitle.classList.add('break-session');
                timeLeft = breakTime;
                isWorkSession = false;
                startTimer(); // Start break timer automatically
            } else {
                sessionTitle.textContent = 'Work Session';
                sessionTitle.classList.remove('break-session');
                sessionTitle.classList.add('work-session');
                timeLeft = workTime;
                isWorkSession = true;
            }
            timerLabel.textContent = formatTime(timeLeft);
            if (!isWorkSession) {
                startTimer(); // Start break timer automatically
            }
        }
        updateButtonColors(); // Update button colors dynamically
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    clearInterval(fadeIntervalId); // Clear any active fade intervals
    isRunning = false;
    isWorkSession = true;
    sessionTitle.textContent = 'Work Session'; // Reset session title
    sessionTitle.classList.remove('break-session'); // Reset session color
    sessionTitle.classList.add('work-session');
    timeLeft = workTime;
    timerLabel.textContent = formatTime(timeLeft);
    startButton.textContent = 'Start'; // Reset button text to "Start"
    stopMusic(); // Stop music when timer resets
    updateButtonColors(); // Update button colors dynamically
}

function fadeIn(audioElement) {
    audioElement.volume = 0;
    audioElement.play();
    let currentVolume = 0;
    fadeIntervalId = setInterval(() => {
        if (currentVolume >= 1) {
            clearInterval(fadeIntervalId);
            audioElement.volume = 1;
        } else {
            currentVolume += fadeStep;
            audioElement.volume = currentVolume;
        }
    }, fadeInterval);
}

function stopMusic() {
    fadeOut(workMusic);
    fadeOut(breakMusic);
}

function updateButtonColors() {
    if (isWorkSession) {
        startButton.className = '';
        resetButton.className = '';
        startButton.classList.add('work-session');
        resetButton.classList.add('work-session');
    } else {
        startButton.className = '';
        resetButton.className = '';
        startButton.classList.add('break-session');
        resetButton.classList.add('break-session');
    }
}

startButton.addEventListener('click', () => {
    startTimer();
});

resetButton.addEventListener('click', () => {
    resetTimer();
    stopMusic(); // Stop music when timer resets
});

// Initial setup
timerLabel.textContent = formatTime(timeLeft);
updateButtonColors(); // Update button colors dynamically initially
