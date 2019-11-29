var startBtn = document.querySelector("#startBtnID");
var timerSpan = document.querySelector("#timerSpanID");
var promtSpan = document.querySelector("#promtSpanID");
var choicesUL = document.querySelector("#choicesULID");
var resultSpan = document.querySelector("#resultSpanID");
var scoreSpan = document.querySelector("#scoreSpanID");


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
    showElement(".start-container", false);
    showElement(".quiz-container", true);
    startTimer();
    displayPromt();
}

function endQuiz() {
    quiz = false;
    clearInterval(interval);
    clearChoices();
    showElement(".quiz-container", false);
    displayResults();
}

function displayPromt() {
    var i = Math.floor(Math.random() * quizArray.length);
    currentPromt = quizArray[i];
    console.log(currentPromt.title);
    promtSpan.textContent = currentPromt.title;
    clearChoices();
    currentPromt.choices.forEach(element => {
        var li = document.createElement("li");
        li.textContent = element;
        choicesUL.appendChild(li);
    });
}

function clearChoices() {
    while (choicesUL.hasChildNodes()) {
        choicesUL.removeChild(choicesUL.firstChild);
    }
}

function checkAnswer(event) {
    console.log(event.target.textContent);
    let msg = "";
    event.target.textContent === currentPromt.answer ? msg = "Correct!" : msg = "Incorrect";
    resultSpan.textContent = msg;
    setTimeout(function() {
        resultSpan.textContent = "";
    }, 2000);

    if (msg === "Correct!") {


    } else {
        saveQuestionsArray.push(currentPromt);
        secondsLeft -= 15;
    }

    console.log(msg);

    var len = quizArray.length;
    if (len === 1) {
        // quiz over
        console.log("promt index: " + 0)
        endQuiz();
        return;
    } else {
        var i = quizArray.findIndex(checkTitle);
        console.log("promt index: " + i)
        quizArray.splice(i, 1);
    }

    function checkTitle(promt) {
        return promt.title === currentPromt.title;
    }

    displayPromt();
}

function displayResults() {
    showElement(".results-container", true);
    scoreSpan.textContent = secondsLeft;

}

function showElement(selector, show) {
    let el = document.querySelector(selector);
    show ? el.style.display = "block" : el.style.display = "none";
}



startBtn.addEventListener("click", startQuiz);
choicesUL.addEventListener("click", checkAnswer);