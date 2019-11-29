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

function startTimer() {

    secondsLeft = totalSeconds;

    interval = setInterval(function() {
        secondsLeft--;

        timerSpan.textContent = secondsLeft;

        if (quiz) {
            //display question
            var i = Math.floor(Math.random() * quizArray.length);
            var current = quizArray[current];
            console.log(current);

            promtSpan.textContent = current.title;
            //display mulitple choices
            current.choices.forEach(element => {
                //create list element and append to choicesUL
                var li = document.createElement("li");
                li.textContent = element;
                choicesUL.appendChild(li);
            });

            //calc and display result

            //remove question from quiz array
        }

        if (secondsLeft === 0) {
            clearInterval(interval);
            // quiz over
            alert("Time's up!");
            quiz = false;
        }

    }, 100);
}

function startQuiz() {
    quiz = true;
    quizArray = questions.slice();
    quizArray.sort(function(a, b) { return 0.5 - Math.random() });
    startTimer();
}

startBtn.addEventListener("click", startQuiz);