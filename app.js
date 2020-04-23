//VIEW - renders what is on screen and intercepts user input
function handleEvent() { //get value inside the text box and empty it
  var input = document.getElementById("typeHere");
  let trial = input.value;
  input.value = "";
  playerArray.push(trial.trim());
};

function checkWord() { //check if the player input is correct, then color display and input array
    if (correctArray[x].innerText.trim() == playerArray[x]) {
        correctArray[x].classList.add("correct");
        totalWordsArray.push(playerArray[x]);
    } else {
        correctArray[x].classList.add("wrong");
        wrongWordsArray.push(playerArray[x]);
    }
    x++;
}

function displayWPM() { //display wpm to the html
    let wpmDisplay = document.getElementsByClassName("wpm");
    let wpmObject = perMinute(totalWordsArray, wrongWordsArray);
    wpmDisplay[0].innerText = wpmObject.totalWord;
    wpmDisplay[1].innerText = wpmObject.correctWord;
    wpmDisplay[2].innerText = wpmObject.totalChar;
    wpmDisplay[3].innerText = wpmObject.correctChar;
}

let form = document.getElementsByClassName("customtext");
form[1].addEventListener('click', logSubmit);

function logSubmit(e) {
    let display = document.getElementsByClassName("display")[0];
    display.innerHTML = form[0].value;
    form[0].value = "";
    
}





//MODEL - consists of data and maintains the state of application
function separateWords() { //separate words with <span> element
  let display = document.getElementsByClassName("display")[0]; //get sentence node
  let html = display.innerHTML; //get html
  let htmlArray = html.split(" "); //split and put into array
  let newString = "";
  for (let x = 0; x < htmlArray.length; x++) {
    let setup = "<span class = 'typetext'> " + htmlArray[x] + "</span>";
    newString += setup;
  }
  display.innerHTML = newString; //replace p with <span>p</span>
}

function calculateInterval() { //set the interval for the start and end of typing test
    if (x == 1) {
        startTime = new Date();
    } else if (x == correctArray.length) {
        endTime = new Date();
    }
}

separateWords();

let correctArray = document.querySelectorAll(".typetext");
let playerArray = [];

let x = 0;

let totalWordsArray = [];
let wrongWordsArray = [];

let wpm = 0;

let startTime = "";
let endTime = "";


//CONTROLLER - Manages the logic and processing
document.addEventListener("keypress", function(e) { //check for spacebar and activate handleEvent
    if (e.key == " ") {        
        handleEvent();
        checkWord();
        calculateInterval();
        if (x == correctArray.length) displayWPM();
    }
})

function calculateCharacters(array) { //calculate the number of characters in an array
    let total = 0;
    for (let x = 0; x < array.length; x++) {
        total += array[x].length;
    }
    return total;
}

function perMinute(total, wrong) { //return object containing wpm
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

