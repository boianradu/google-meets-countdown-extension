let refreshDisplayTimeout;
let bgpage = chrome.extension.getBackgroundPage();
let previousValues = [3, 5, 10, 30];
let editing = false;

document.addEventListener('DOMContentLoaded', function () {
    load();
    document.querySelector('#start').addEventListener('click', setTimer);
    document.querySelector('#cancel').addEventListener('click', reset);
    document.querySelector('#wrench').addEventListener('click', swap);
    document.querySelector('#pause').addEventListener('click', pauseTimer);
    document.querySelector('#resume').addEventListener('click', resumeTimer);
    document.querySelector('#restart').addEventListener('click', restartTimer);
});

function show(section) {
    document.getElementById(section).style.display = "block";
}

function showInline(section) {
    document.getElementById(section).style.display = "inline";
}

function hide(section) {
    document.getElementById(section).style.display = "none";
}

function load() {
    hide("settings");
    hide("modify");
    hide("resume");
    editing = false;

    // if timer is paused, show resume button and hide pause button
    if (bgpage.pauseDate) {
        showInline("resume");
        hide("pause");
    }

    // loads custom times if they exist
    for (let i = 0; i < document.choices.radio.length; i++)
        if (localStorage[i] != null)
            document.getElementById("s" + i).textContent = localStorage[i];

    // if timer is off, show settings
    if (!bgpage.alarmDate) {
        show("settings");
        hide("display");
    }

    // else, show countdown
    else {
        show("display");
        refreshDisplay();
        show("modify");
    }
}

function getChoice() {
    // find selected RADIO, RETURN selected value
    let num;
    for (let i = 0; i < document.choices.radio.length; i++) {
        if (document.choices.radio[i].checked == true)
            num = parseInt(document.getElementById("s" + i).textContent);
    }
    return num;
}

function swap() {
    editing = true;

    // swap text with fields
    for (let i = 0; i < document.choices.radio.length; i++) {
        let span = document.getElementById("s" + i);
        let num = parseInt(span.textContent);

        previousValues[i] = num;

        let html = "<input class='input-mini' type='text' name='custom' id='c" + i;
        html += "' value='" + num;
        html += "'>";
        // used to select on click and auto save on change

        span.innerHTML = html;
    }

    // swap edit button with done button
    let butt = document.getElementById("swapper");
    butt.innerHTML = "<a href='#' id='done' class='btn'><i class='icon-ok'></i></a>";
    document.querySelector('#done').addEventListener('click', swapBack);
}

function swapBack() {
    // swap fields with text
    for (let i = 0; i < document.choices.radio.length; i++) {
        let span = document.getElementById("s" + i);
        let num = parseInt(document.getElementById("c" + i).value);

        if (isValid(num)) {
            localStorage[i] = num;
            span.textContent = num;
        } else
            span.textContent = previousValues[i];
    }

    // swap done button with edit button
    let butt = document.getElementById("swapper");
    butt.innerHTML = "<a href='#' id='wrench' class='btn'><i class='icon-wrench'></i></a>";
    document.querySelector('#wrench').addEventListener('click', swap);

    editing = false;
}

function setTimer() {
    // make sure we're dealing with text not fields
    if (editing)
        swapBack();

    // SET background timer for selected number
    // HIDE settings, DISPLAY countdown

    let num = getChoice();

    // set timer, hide settings, display reset button
    if (isValid(num)) {
        bgpage.setAlarm(num * 60000);
        hide("settings");
        show("modify");
        show("display");
        refreshDisplay();
    } else
        bgpage.error();
}

// Returns true if 0 <= amt <= 240
function isValid(amt) {
    if (isNaN(amt) || (amt == null))
        return false;
    else if ((amt < 0) || (amt > 240))
        return false;
    else
        return true;
}

function refreshDisplay() {
    percent = bgpage.getTimeLeftPercent();

    if (percent < 15)
        document.getElementById("bar").style.color = "grey";
    document.getElementById("bar").textContent = bgpage.getTimeLeftString();
    document.getElementById("bar").style.width = percent + "%";

    refreshDisplayTimeout = setTimeout(refreshDisplay, 100);
}

function pauseTimer() {
    hide("pause");
    showInline("resume");
    bgpage.pause();
    clearTimeout(refreshDisplayTimeout);
}

function resumeTimer() {
    hide("resume");
    showInline("pause");
    refreshDisplay();
    bgpage.resume();
}

function restartTimer() {
    hide("resume");
    showInline("pause");
    refreshDisplay();
    bgpage.restart();
}

function reset() {
    clearTimeout(refreshDisplayTimeout);
    bgpage.turnOff();
    hide("display");
    show("settings");
    hide("modify");
}