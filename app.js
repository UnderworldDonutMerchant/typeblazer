//GLOBAL VARIABLES
let correctArray = document.querySelectorAll(".typetext"); //array for answer and player answer
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

function buttonListener() { //set event listeners to the two buttons
  let form = document.getElementsByClassName("customText"); //event listener to get text and input for use
  form[1].addEventListener("click", logSubmit);
  let ranform = document.getElementsByClassName("randomText");
  ranform[0].addEventListener("click", logSubmit);
}

buttonListener();

function logSubmit(e) { //replace with new text, then reformat into usable data
    checkButtonType(e.target.className);
    separateWords();
    refillArray();
    toggleDisabled();
}

toggleDisabled();//declare once to ensure one of text is disabled initially

//HELPER FUNCTION 
function checkButtonType(input) {//assign text value according to corresponding button press
    let display = document.getElementsByClassName("display")[0];
    if (input == "customText") {
        let form = document.getElementsByClassName("customText");
        display.innerHTML = form[0].value;
        form[0].value = "";
    } else if (input == "randomText") {
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
  input.value = "";
  playerArray.push(trial.trim());
};

function checkWord() { //check if the player input is correct, then add corresponding collect, and add to array
    if (correctArray[x].innerText.trim() == playerArray[x]) {
        correctArray[x].classList.add("correct");
        totalWordsArray.push(playerArray[x]);
    } else {
        correctArray[x].classList.add("wrong");
        wrongWordsArray.push(playerArray[x]);
    }
    x++;
}

function toggleDisabled() { //make sure only one text is editable at a time
    let text = document.getElementsByClassName("disable");
    if (text[1].hasAttribute("disabled") != true) {
        text[0].removeAttribute("disabled", "");
        text[1].setAttribute("disabled", "");
    } else {
        text[0].setAttribute("disabled", "");
        text[1].removeAttribute("disabled", "");
    }
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
    return {totalWord: totalWord * equation,
        correctWord: correctWord * equation,
        totalChar: totalChar * equation,
        correctChar: correctChar * equation
    };
}

function calculateInterval() { //set the interval for the start and end of typing test
    if (x == 1) {
        startTime = new Date();
    } else if (x == correctArray.length) {
        endTime = new Date();
    }
}

function calculateCharacters(array) { //calculate the number of characters in an array
    let total = 0;
    for (let x = 0; x < array.length; x++) {
        total += array[x].length;
    }
    return total;
}


