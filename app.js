//GLOBAL VARIABLES
let correctArray = []; //array for answer and player answer
let playerArray = [];
let x = 0; //counter

//CONTROLLER - Manages the logic and processing
document.addEventListener("keypress", function(e) { //check for spacebar and activate functions
    let checkAttribute = document.getElementsByClassName("disable")[1].hasAttribute("disabled");
    if (e.key == " " && checkAttribute != true) {        
        handleEvent();
        checkWord();
        calculateInterval();
        if (x == correctArray.length) displayWPM();
    }
})

function buttonListener() { //set event listeners to all four buttons
  let form = document.getElementsByClassName("customText"); //event listener to get text and input for use
  form[0].addEventListener("click", logSubmit);
  let ranform = document.getElementsByClassName("randomText");
  ranform[0].addEventListener("click", logSubmit);
  let startform = document.getElementsByClassName("startText");
  startform[0].addEventListener("click", logSubmit);
  let refreshForm = document.getElementsByClassName("refreshText");
  refreshForm[0].addEventListener("click", refresh);
}

buttonListener();

initDisabled();

// Note: if you change the css class of buttons you have to apply changes to logSubmit and checkButtonType

function logSubmit(e) { //replace with new text, then reformat into usable data
    let display = document.getElementsByClassName("display")[0];
    if (e.target.className == "startText btn btn-dark btn-lg btn-block") {
        if (display.innerText.split(" ").length < 15) {
            let warning = document.getElementById("warning");
            warning.innerText = "Your sentence is too short.";
        } else {
            startDisabled(); 
            redirectStart();
            if (checkSoundToggle()) {playStartSound()};
        }
    } else {
        checkButtonType(e.target.className, display);
        separateWords();
        refillArray();
    }
    //toggleDisabled();
}


//HELPER FUNCTION 
function checkButtonType(input, display) {//assign text value according to corresponding button press
    if (input == "customText btn btn-dark btn-lg btn-block") {
        let form = document.getElementsByClassName("customInput");
        display.innerHTML = form[0].value;
        form[0].value = "";
    } else if (input == "randomText btn btn-dark btn-lg btn-block") {
        display.innerHTML = randomQuote(quoteArray);
    }
}

function randomQuote(array) {//return a random quote
    let randomNum = Math.floor(Math.random() * array.length);
    return array[randomNum]; 
}

function separateWords() { //separate words in text with <span> element
  let html = document.getElementsByClassName("display")[0].innerHTML;
  let htmlArray = html.split(" ");
  let newString = "";
  for (let x = 0; x < htmlArray.length; x++) {
    let setup = "<span class = 'typetext'> " + htmlArray[x] + "</span>";
    newString += setup;
  }
  document.getElementsByClassName("display")[0].innerHTML = newString; //replace p with <span>p</span>
  //html = newString;
}

function refillArray() { //refill correctArray with changed text
    correctArray = document.querySelectorAll(".typetext");
}

function handleEvent() { //get value inside the typing box and add it to array, then empty value
  var input = document.getElementById("typeHere");
  let trial = input.value;
  setTimeout(function() {input.value = "";}, 1); //clears out the spacebar include by eventlistener by inputting a delay
  playerArray.push(trial.trim());
};

function checkWord() { //check if the player input is correct, then add corresponding collect, and add to array
    if (correctArray[x].innerText.trim() == playerArray[x]) {
        correctArray[x].classList.add("correct");
        totalWordsArray.push(playerArray[x]);
        progress("correct");
    } else {
        correctArray[x].classList.add("wrong");
        wrongWordsArray.push(playerArray[x]);
        progressBar(correctArray, playerArray);
        progress("wrong");
        if (checkSoundToggle()) {playSound()};
    }
    x++;
}

//disable buttons
function startDisabled() { //enable bottom text and disable top text
    let text = document.getElementsByClassName("disable");
    let custom = document.getElementsByClassName("customText");
    let random = document.getElementsByClassName("randomText");
    if (text[1].hasAttribute("disabled") == true) {
        text[0].setAttribute("disabled", "");
        custom[0].setAttribute("disabled", "");
        random[0].setAttribute("disabled", "");
        text[1].removeAttribute("disabled", "");
    }
}

function initDisabled() {//set bottom text to be disabled
    let text = document.getElementsByClassName("disable");
    text[0].removeAttribute("disabled", "");
    text[1].setAttribute("disabled", "");
}


//REFINEMENTS
function progressBar(correctArray, playerArray) { //calculate percentage of current word of whole
    let corChar = correctArray.length;
    let percent = (1/corChar) * 100;
    return percent;
}

function progress(input) {//create a progress bar div with css, and appendnode
    let trial = document.createElement("div");
    if (input == "correct") {
        trial.setAttribute("class", "progress-bar bg-success"); 
    } else {
        trial.setAttribute("class", "progress-bar bg-danger");
    }
    trial.setAttribute("role", "progressbar");
    trial.setAttribute("aria-valuenow", "25");
    trial.setAttribute("aria-valuemin", "0");
    trial.setAttribute("aria-valuemax", "100");
    let percent = progressBar(correctArray, playerArray);
    let phrase = "width: " + percent + "%";
    trial.setAttribute("style", phrase);
    let tryingThis = document.getElementsByClassName("progress");
    tryingThis[0].appendChild(trial);
}


//WORD PER MINUTE CALCULATIONS

let totalWordsArray = []; //array to calculate right and wrong words
let wrongWordsArray = [];

let startTime = ""; //calculate the start and end time of typing
let endTime = "";

function displayWPM() { //display wpm into the html
    let wpmDisplay = document.getElementsByClassName("wpm");
    let wpmObject = perMinute(totalWordsArray, wrongWordsArray);
    wpmDisplay[0].innerText = wpmObject.totalWord;
    wpmDisplay[1].innerText = wpmObject.correctWord;
    wpmDisplay[2].innerText = wpmObject.totalChar;
    wpmDisplay[3].innerText = wpmObject.correctChar;
}

function perMinute(total, wrong) { //return object containing wpm calculations
    let equation = 60/((endTime - startTime)/1000);
    let totalWord = total.length;
    let correctWord = total.length - wrong.length;
    let totalChar = calculateCharacters(total);
    let correctChar = totalChar - calculateCharacters(wrong);
    return {totalWord: Math.round(totalWord * equation),
        correctWord: Math.round(correctWord * equation),
        totalChar: Math.round(totalChar * equation),
        correctChar: Math.round(correctChar * equation)
    };
}

let timer = "";

function calculateInterval() { //set the interval for the start and end of typing test
    if (x == 1) {
        startTime = new Date();
        timer = setInterval(syncWPM, 2000);
    } else if (x == correctArray.length) {
        endTime = new Date();
        clearInterval(timer);
        redirectEnd();
        if (checkSoundToggle()) {playWinSound()};
    }
}

function calculateCharacters(array) { //calculate the number of characters in an array
    let total = 0;
    for (let x = 0; x < array.length; x++) {
        total += array[x].length;
    }
    return total;
}

let interval = 0;

function syncWPM() {
    let array = totalWordsArray;
    let charLength = calculateCharacters(array);
    interval += 2;
    let wpm = Math.round((charLength/4.7) * (60/interval));
    let display = document.getElementsByClassName("concurrent")[0];
    display.innerHTML = wpm;
}

//sound effect
function playSound() {//play a hitsound randomly out of five choices
    let number = Math.round(Math.random() * 4) + 1;
    let fileName = "sounds/hit" + number + ".wav";
    let sound = new Audio(fileName);
    sound.play();
}

function playWinSound() {//play win sound
    let sound = new Audio("sounds/win.wav");
    sound.play();
}

function playStartSound() {//play start sound
    let sound = new Audio("sounds/start.wav");
    sound.play();
}

function checkSoundToggle() {//return true if "sound on" is toggled else false
    let soundButtons = document.getElementsByClassName("soundButton");
    if (soundButtons[0].classList.contains("active")) {
        return true;
    } else {
        return false;
    }
}

//redirection
function redirectStart() {//direct page to type here and focus
    let redirect = document.getElementById("startDirect");
    let focus = document.getElementById("typeHere");
    focus.focus();
    redirect.scrollIntoView(false);
}

function redirectEnd() {//direct page to results
    let redirect = document.getElementById("startDirect");
    redirect.scrollIntoView();
}

function redirectRefresh() {//redirect to middle of page to try test again
    let redirect = document.getElementsByClassName("lead")[0];
    redirect.scrollIntoView();
}

// refresh clean slate
function refresh() { //carry out all refresh functions
    freeButton();
    clearDisplay();
    clearProgress();
    clearWPM();
    clearResults(); 
    clearGlobal();
    redirectRefresh();
}

function clearDisplay() {//clear the text inside the display
    document.getElementsByClassName("display")[0].innerHTML = "";
}

function clearProgress() {//clear the progress bar
    let progress = document.getElementsByClassName("progress")[0];
    while (progress.lastElementChild) {
        progress.removeChild(progress.lastElementChild);
    }
}

function clearWPM() {//clear the wpm meter
    interval = 0;
    let display = document.getElementsByClassName("concurrent")[0];
    display.innerHTML = "";
}

function clearResults() {//clear the wpm global variables and result displays
    let wpmDisplay = document.getElementsByClassName("wpm");
    for (let x = 0; x < 4; x++) {
        wpmDisplay[x].innerText = "";
    }
    totalWordsArray = [];
    wrongWordsArray = [];
    startTime = "";
    endTime = "";
}

function freeButton() {//reset the diabled state of buttons to initial
    let custom = document.getElementsByClassName("customText");
    let random = document.getElementsByClassName("randomText");
    custom[0].removeAttribute("disabled", "");
    random[0].removeAttribute("disabled", "");
    initDisabled();
}

function clearGlobal() {//empty global variables
    correctArray = [];
    playerArray = [];
    x = 0;
}