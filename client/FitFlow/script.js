// ---------------------- Sounds ----------------------
const beepSound = new Audio("assets\\beep-beep-beep-beep-80262.mp3")




// ---------------------- Timer ----------------------
function secToTime(totalSeconds) {
  if (totalSeconds < 0) {
    return false;
  }
  let min = Math.floor(totalSeconds / 60);
  let sec = totalSeconds - min * 60;
  if (min < 10) {
    min = "0" + min;
  }
  if (sec < 10) {
    sec = "0" + sec;
  }
  return min + ":" + sec;
}
// ---------------------- DOM Elements ----------------------
const addIntervalBtn = document.getElementById("addIntervalBtn");
const intervalsBox = document.getElementById("intervalsBox");
const timerStartBtn = document.getElementById("timerStartBtn");
const timerBox = document.getElementById("timerBox");
const timerTime = document.getElementById("timerTime");
const intervalNo = document.getElementById("intervalNo");
const circuitNo = document.getElementById("circuitNo");
const addIntervalBox = document.getElementById("addIntervalBox");
const timermins = document.getElementById("timermins");
const timersecs = document.getElementById("timersecs");
const intervalContainer = document.getElementById("intervalContainer");
const restIncreaseBtn = document.getElementById("restIncreaseBtn");
const circuitsLabel = document.getElementById("circuitsLabel");
let seekBar = document.querySelector(".seekBar")
let intervalTime;
let StartTime;
let intervalBackgroundColor;
let totalCircuits = 5;
let currentCircuit = 0;
let currentInterval = 0;
let restTime = 30;


// ---------------------- Increase and Decrease Functions ----------------------
document.getElementById("restTimeLabel").innerHTML = secToTime(restTime);
restIncreaseBtn.addEventListener("click", () => {
  restTime += 1;
  document.getElementById("restTimeLabel").innerHTML = secToTime(restTime);
});
let restIncreaseInterval;
let isRestBtnPressed = false;
restIncreaseBtn.addEventListener("mousedown", () => {
  isRestBtnPressed = true;
  setTimeout(() => {
    if (isRestBtnPressed) {
      restIncreaseInterval = setInterval(() => {
        restTime += 1;
        document.getElementById("restTimeLabel").innerHTML =
          secToTime(restTime);
      }, 100);
    }
  }, 300);
});
restIncreaseBtn.addEventListener("mouseup", () => {
  isRestBtnPressed = false;
  clearInterval(restIncreaseInterval);
});
function decreaseCircuits() {
  if (totalCircuits > 1) {
    totalCircuits--;
    circuitsLabel.innerHTML = totalCircuits;
  }
}
function increaseCircuits() {
  totalCircuits++;
  circuitsLabel.innerHTML = totalCircuits;
}

// ---------------------- Fecting Local Storage ----------------------
let intervals = [];
if (localStorage.getItem("interval")) {
  intervals = JSON.parse(localStorage.getItem("interval"));
  for (let i = 0; i < intervals.length; i++) {
    let interval = `<div class="interval">
    <p>${"Interval " + (i + 1)}</p> <div><span>${secToTime(
      intervals[i][[Object.keys(intervals[i])][0]]
    )}</span><button class="intervalBtn" onclick="deleteInterval(${i})"><img src="media/trash-solid.svg" alt=""></button></div>`;
    intervalContainer.innerHTML += interval;
  }
}
if(localStorage.getItem("totalCircuits")){
  totalCircuits = Number(localStorage.getItem("totalCircuits"))
  circuitsLabel.innerHTML = totalCircuits;
}
// ---------------------- Adding Interval ----------------------
let isAddIntervalBtnOn = false;
addIntervalBtn.addEventListener("click", () => {
  if (isAddIntervalBtnOn == false) {
    isAddIntervalBtnOn = true;
    addIntervalBox.style.display = "flex";
  }
});
function addingInterval() {
  isAddIntervalBtnOn = false;
  addIntervalBox.style.display = "none";
  min = Number(timermins.value) || 0;
  sec = Number(timersecs.value) || 0;
  intervals.push({
    ["interval" + String(intervals.length + 1)]: min * 60 + sec,
  });
  console.log(intervals);
  let interval = `<div class="interval">
    <p>${"Interval " + intervals.length}</p> <div><span>${secToTime(
    min * 60 + sec
  )}</span><button class="intervalBtn" onclick="deleteInterval(${
    intervals.length - 1
  })"><img src="media/trash-solid.svg" alt=""></button></div>`;
  intervalContainer.innerHTML += interval;
}
// ---------------------- Delete Interval Feature ----------------------
function deleteInterval(x) {
  intervals.splice(x, 1);
  console.log(x);
  intervalContainer.innerHTML = "";
  for (let i = 0; i < intervals.length; i++) {
    let interval = `<div class="interval">
    <p>${"Interval " + (i + 1)}</p> <div><span>${secToTime(
      intervals[i][[Object.keys(intervals[i])][0]]
    )}</span><button class="intervalBtn" onclick="deleteInterval(${i})"><img src="media/trash-solid.svg" alt=""></button></div>`;
    intervalContainer.innerHTML += interval;
  }
}


// ---------------------- Starting Timer ----------------------
timerStartBtn.addEventListener("click", () => {
  //openPlayer()                                                                                    --------------------->updates needed
  localStorage.setItem("interval", JSON.stringify(intervals));
  localStorage.setItem("totalCircuits",String(totalCircuits))
  if (intervals.length > 0) {
    intervals.push({ rest: restTime });
    timerBox.style.display = "flex";
    StartTime = new Date().getTime();
    intervalTime =
      intervals[currentInterval][Object.keys(intervals[currentInterval])[0]];
    timerTime.innerHTML = secToTime(intervalTime);
    if (Object.keys(intervals[currentInterval])[0] == "rest") {
      intervalBackgroundColor = "#85f85f";
    } else {
      intervalBackgroundColor = "#FF6F61";
    }
    timerBox.style.backgroundColor = intervalBackgroundColor;
    starttimer();
  }
});

let timerLoop;
let runSeekBar;
function starttimer() {
  timerLoop = setInterval(()=> {
    runSec();
  }, 800);
  runSeekBar = setInterval(()=>{
    let currentTime = new Date().getTime();
    let percentageDone = (((currentTime-StartTime)/(intervalTime*1000))*100)
  seekBar.style.backgroundImage = `linear-gradient(to right,rgb(255, 255, 255) ${percentageDone}%,rgba(255, 255, 255, 0) ${percentageDone}%)`
  console.log(percentageDone)
  },10)
}
function runSec() {
  let currentTime = new Date().getTime();
  let secondsLeft = intervalTime - Math.round((currentTime - StartTime) / 1000);
  let temp = secToTime(secondsLeft);
  if (temp == false) {
    currentInterval++;
    if (currentInterval < intervals.length) {
      beepSound.play()
      if (Object.keys(intervals[currentInterval])[0] == "rest") {
        intervalNo.innerHTML = "Rest";
      } else {
        intervalNo.innerHTML = "Interval " + (currentInterval + 1);
      }
      StartTime = new Date().getTime();
      intervalTime =
        intervals[currentInterval][Object.keys(intervals[currentInterval])[0]];
      timerTime.innerHTML = secToTime(intervalTime);
      if (Object.keys(intervals[currentInterval])[0] == "rest") {
        intervalBackgroundColor = "#85f85f";
      } else {
        intervalBackgroundColor = "#FF6F61";
      }
      timerBox.style.backgroundColor = intervalBackgroundColor;
    } else {
      currentCircuit++;
      circuitNo.innerHTML = currentCircuit + 1;
      if (currentCircuit < totalCircuits) {
        currentInterval = 0;
        intervalNo.innerHTML = "Interval " + (currentInterval + 1);
        StartTime = new Date().getTime();
        intervalTime =
          intervals[currentInterval][
            Object.keys(intervals[currentInterval])[0]
          ];
        timerTime.innerHTML = secToTime(intervalTime);
        if (Object.keys(intervals[currentInterval])[0] == "rest") {
          intervalBackgroundColor = "#85f85f";
        } else {
          intervalBackgroundColor = "#FF6F61";
        }
        timerBox.style.backgroundColor = intervalBackgroundColor;
      } else {
        clearInterval(timerLoop);
        clearInterval(runSeekBar)
        seekBar.style.backgroundImage = `linear-gradient(to right,rgb(255, 255, 255) ${0}%,rgba(255, 255, 255, 0) ${0}%)`
        intervals.pop();
        timerBox.style.display = "none";
        playerWindow.close();
        currentCircuit = 0;
        currentInterval = 0;
      }
    }
  } else {
    timerTime.innerHTML = temp;
  }
}

// let videoId = "mNEUkkoUoIA"
// function openPlayer(videoId) {
//   const playerWindow = window.open(
//     `https://www.youtube.com/watch?v=mNEUkkoUoIA`,
//     'ytPlayer',
//     'width=1,height=1,left=20000,top=20000'
//   );
// }
// playerWindow.onload = function() {
//   playerWindow.document.title = "🎵";
// };