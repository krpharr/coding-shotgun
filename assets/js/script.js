var startBtn = document.querySelector("#startBtnID");
var timerSpan = document.querySelector("#timerSpanID");
var promtSpan = document.querySelector("#promtSpanID");
var choicesUL = document.querySelector("#choicesULID");
var resultSpan = document.querySelector("#resultSpanID");

// console.log(questions[0].title);

var quiz = false;
var highscores = JSON.parse(localStorage.getItem("highscores"));
if (highscores === null) {
    highscores = [];
}

var totalSeconds = 75;
var secondsLeft = 0;
var interval;
var score;
var quizArray;
var currentPromt;
var saveQuestionsArray = [];

function startTimer() {

    secondsLeft = totalSeconds;

    interval = setInterval(function() {
        secondsLeft--;

        timerSpan.textContent = secondsLeft;


        if (secondsLeft <= 0) {
            clearInterval(interval);
            // quiz over
            alert("Time's up!");
            quiz = false;
        }

    }, 1000);
}

function startQuiz() {
    quiz = true;
    quizArray = questions.slice();
    quizArray.sort(function(a, b) { return 0.5 - Math.random() });
    startTimer();
    displayPromt();
}

function endQuiz() {
    quiz = false;
    clearInterval(interval);
}

function displayPromt() {
    //display question
    var i = Math.floor(Math.random() * quizArray.length);
    currentPromt = quizArray[i];
    console.log(currentPromt.title);

    promtSpan.textContent = currentPromt.title;
    //display mulitple choices
    clearChoices();

    currentPromt.choices.forEach(element => {
        //create list element and append to choicesUL
        var li = document.createElement("li");
        li.textContent = element;
        choicesUL.appendChild(li);
    });

    //calc and display result

    //remove question from quiz array
}

function clearChoices() {
    while (choicesUL.hasChildNodes()) {
        choicesUL.removeChild(choicesUL.firstChild);
    }
}

function checkAnswer(event) {
    // console.log(event.target);
    let msg = "";
    event.target.textContent === currentPromt.answer ? msg = "Correct!" : msg = "Incorrect";
    resultSpan.textContent = msg;
    setTimeout(function() {
        resultSpan.textContent = "";
    }, 2000);

    if (msg === "Correct!") {


    } else {
        // push currentPromt to save array so user can review
        saveQuestionsArray.push(currentPromt);
        secondsLeft -= 15;
    }

    console.log(msg);

    // remove currentPromt from quizArray
    var len = quizArray.length;
    if (len === 1) {
        // quiz over
        endQuiz();
    } else {
        // remove currentPromt from Quiz Array
        var i = quizArray.findIndex(checkTitle);
        quizArray.splice(i, 1);
    }

    function checkTitle(promt) {
        console.log(promt.title);
        return promt.title === currentPromt.title;
    }

    displayPromt();
}

startBtn.addEventListener("click", startQuiz);
choicesUL.addEventListener("click", checkAnswer);