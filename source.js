let timer;
let isRunning = false;
let seconds = 0;
let timerType = "chronometer";
let userSetTime = 0;

const display = document.getElementById("display");
const startStopButton = document.getElementById("startStop");
const resetButton = document.getElementById("reset");
const modeToggle = document.getElementById("modeToggle");
const timerTypeSelect = document.getElementById("timerType");
const customInput = document.getElementById("customInput");
const setCustomTimeButton = document.getElementById("setCustomTime");
const hoursInput = document.getElementById("hours");
const minutesInput = document.getElementById("minutes");
const secondsInput = document.getElementById("seconds");
const timerSound = document.getElementById("timerSound");
const errorMessage = document.getElementById("errorMessage");

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((v) => (v < 10 ? "0" + v : v)).join(":");
}

function updateDisplay() {
  display.textContent = formatTime(seconds);
  if ((timerType === "countdown" || timerType === "repeat") && seconds === 0) {
    playTimerSound();
    if (timerType === "repeat") {
      seconds = userSetTime; // Reset to the user-set time for repeating timer
    } else {
      clearInterval(timer);
      isRunning = false;
      startStopButton.textContent = "Start";
    }
  }
}

function playTimerSound() {
  timerSound.currentTime = 0; // Reset the audio to the beginning
  timerSound
    .play()
    .catch((error) => console.log("Error playing sound:", error));
}

function startStop() {
  if (isRunning) {
    clearInterval(timer);
    startStopButton.textContent = "Start";
  } else {
    timer = setInterval(() => {
      if (timerType === "chronometer") {
        seconds++;
      } else {
        if (seconds > 0) {
          seconds--;
        } else if (timerType === "repeat") {
          seconds = userSetTime; // Reset to the user-set time for repeating timer
        }
      }
      updateDisplay();
    }, 1000);
    startStopButton.textContent = "Stop";
  }
  isRunning = !isRunning;
}

function reset() {
  clearInterval(timer);
  if (timerType === "chronometer") {
    seconds = 0;
  } else {
    seconds = userSetTime;
  }
  updateDisplay();
  startStopButton.textContent = "Start";
  isRunning = false;
}

function changeTimerType() {
  timerType = timerTypeSelect.value;
  clearInterval(timer);
  isRunning = false;
  startStopButton.textContent = "Start";
  errorMessage.textContent = ""; // Clear any previous error messages

  if (timerType === "chronometer") {
    seconds = 0;
    customInput.style.display = "none";
  } else {
    seconds = userSetTime;
    customInput.style.display = "block";
  }
  updateDisplay();
}

function setCustomTime() {
  const hours = parseInt(hoursInput.value) || 0;
  const minutes = parseInt(minutesInput.value) || 0;
  const secs = parseInt(secondsInput.value) || 0;

  if (hours < 0 || minutes < 0 || secs < 0) {
    errorMessage.textContent =
      "Please enter non-negative values for all fields.";
    return;
  }

  if (hours === 0 && minutes === 0 && secs === 0) {
    errorMessage.textContent = "Please enter a time greater than 0 seconds.";
    return;
  }

  errorMessage.textContent = ""; // Clear any previous error messages
  userSetTime = hours * 3600 + minutes * 60 + secs;
  seconds = userSetTime;
  updateDisplay();
}

function toggleMode() {
  document.body.classList.toggle("light-mode");
  document.body.classList.toggle("dark-mode");
}

startStopButton.addEventListener("click", startStop);
resetButton.addEventListener("click", reset);
modeToggle.addEventListener("change", toggleMode);
timerTypeSelect.addEventListener("change", changeTimerType);
setCustomTimeButton.addEventListener("click", setCustomTime);

updateDisplay();
