document.addEventListener("DOMContentLoaded", () => {
    let timer; // store the interval reference

    let timerValues = {
        hour: 0,
        min: 0,
        sec: 0
    }
    let isTimerOn = false;
    let isPaused = false;

    const display = document.getElementById("display");
    const inputs = document.getElementById("inputs");
    const resetBtn = document.getElementById("reset");
    const pause_resumeBtn = document.getElementById("pause-resume");

    const hourDisplay = document.getElementById("hour");
    const minDisplay = document.getElementById("min");
    const secDisplay = document.getElementById("sec");

    const hourInp = document.getElementById("hour-inp");
    const minInp = document.getElementById("min-inp");
    const secInp = 0;

    console.log("Chck")
    if (hourInp != 0 || minInp != 0 || secInp != 0) {
        isTimerOn = true
        displayTimerValues()
    }
    const startTimerBtn = document.querySelector("#inputs>button");


    resetBtn.addEventListener('click', () => {
        if (!isTimerOn) return;
        setInputsInTimer();
        displayTimerValues();
    })


    pause_resumeBtn.addEventListener('click', () => {
        if (!isTimerOn) return;
        if (isPaused) {
            startTimer();
            isPaused = false;
            pause_resumeBtn.textContent = "Pause";
        } else {
            isPaused = true;
            clearInterval(timer);
            pause_resumeBtn.textContent = "Resume";
        }
    })


    startTimerBtn.addEventListener("click", () => {
        setInputsInTimer()

        let el = document.getElementById('sec');
        let content;

        if (hour == 0 && min == 0) {
            console.log(el)
            el.style.display = 'inline';
        }

        el.insertAdjacentHTML('afterbegin', content);
        if (timerValues.hour < 0 ||
            timerValues.min < 0 ||
            timerValues.sec < 0) return;
        isTimerOn = true; // starting the timer
        startTimer();
        toggleDisplay();
    })



    function setInputsInTimer() {
        timerValues.sec = +secInp;
        timerValues.min = +minInp.value;
        timerValues.hour = +hourInp.value;
    }

    function displayTimerValues() {
        hourDisplay.textContent = timerValues.hour;
        minDisplay.textContent = timerValues.min;
        secDisplay.textContent = timerValues.sec;
    }


    function startTimer() {
        displayTimerValues();
        timer = setInterval(() => {
            console.log(timerValues.sec)
            timerValues.sec--;
            if (timerValues.sec < 0) {
                timerValues.sec = 59;
                timerValues.min--;
            }
            if (timerValues.min < 0) {
                timerValues.min = 59;
                timerValues.hour--;
            }

            displayTimerValues()

            // Clear the timer after comeback to 00:00:00
            if (timerValues.hour < 0 ||
                timerValues.min < 0 ||
                timerValues.sec < 0) {
                clearInterval(timer);
                isTimerOn = false;
                toggleDisplay();
            }
        }, 1000)
    }

    function toggleDisplay() {
        if (isTimerOn) {
            inputs.style.display = "none";
            display.style.display = "block";
        } else {
            inputs.style.display = "grid";
            display.style.display = "none";
        }
    }


})