var startBtn = document.querySelector("#startBtnID");
var timerSpan = document.querySelector("#timerSpanID");
var promtSpan = document.querySelector("#promtSpanID");
var choicesUL = document.querySelector("#choicesULID");
var resultSpan = document.querySelector("#resultSpanID");
var scoreSpan = document.querySelector("#scoreSpanID");
var initialsInput = document.querySelector("#initialsInputID");
var cancelBtn = document.querySelector("#cancelBtnID");
var enterBtn = document.querySelector("#enterBtnID");
var languagesUL = document.querySelector("#languagesUlID");
var totalTimeSpan = document.querySelector("#totalTimeSpanID");
var scoresUl = document.querySelector("#scoresUlID");
var userQuizOl = document.querySelector("#userQuizOlID");

var startContainer = document.querySelector(".start-container");
var quizContainer = document.querySelector(".quiz-container");
var resultsContainer = document.querySelector(".results-container");
var highscoresContainer = document.querySelector(".highscores-container");

var containerArray = [startContainer, quizContainer, resultsContainer, highscoresContainer];

var userQuizObjectArray = []; //for storing user answers and diplaying results

var totalSeconds = 75;
var secondsLeft = 0;
var interval;
var score;
var quizArray = [];
var currentPromt;

initStartPage();

function initStartPage() {
    clearChoices(languagesUL);
    languagesArray.forEach(element => {
        var li = document.createElement("li");
        li.setAttribute("value", element);
        // li.setAttribute("class", "col-xs-12");
        // li.style.display = "inline";
        li.style.margin = "0 8px";
        // li.style.padding = "8px 4px";
        // li.style.borderBottom = "1px solid black";
        var cb = document.createElement("input");
        cb.setAttribute("type", "checkbox");
        cb.setAttribute("value", element);
        // cb.style.margin = "0 4px";
        var span = document.createElement("span");
        span.textContent = element.charAt(0).toUpperCase() + element.slice(1);
        var sel = document.createElement("select");
        // sel.style.margin = "0 4px";
        var n;
        switch (element) {
            case "javascript":
                n = javascriptQUIZ.length;
                break;
            case "git":
                n = gitQUIZ.length;
                break;
            case "css":
                n = cssQUIZ.length;
                break;
        }
        for (var i = 0; i < n; i++) {
            var opt = document.createElement("option");
            opt.setAttribute("value", i + 1);
            if (i === n - 1) {
                opt.setAttribute("selected", "selected");
            }
            opt.textContent = i + 1;
            sel.appendChild(opt);
        }
        var row = document.createElement("div");
        row.setAttribute("class", "row language-row");
        var col = [];
        for (var i = 0; i < 3; i++) {
            col[i] = document.createElement("div");
            col[i].setAttribute("class", "col-2 p-0");
        }
        col[1].setAttribute("class", "col-8 p-0");
        col[0].appendChild(cb);
        col[1].appendChild(span);
        col[2].appendChild(sel);
        col.forEach(c => {
            li.appendChild(c);
        });
        row.appendChild(li);
        li.style.display = "flex";
        li.style.width = "160px";
        languagesUL.appendChild(row);
    });
    setLanguages(getLangSettingsFromStorage());
    localStorage.setItem("code-shotgun-settings", JSON.stringify(getLangSettingsArray()));
}

function getLangSettingsFromStorage() {
    var lsArray = JSON.parse(localStorage.getItem("code-shotgun-settings"));
    if (lsArray === null || lsArray.length < 1) {
        lsArray = [{ lang: "javascript", num: 5 }];
    }
    return lsArray;
}

function setLanguages(langSettingsArray) {
    quizArray = [];
    var qArray = [];
    console.log(langSettingsArray);
    langSettingsArray.forEach(langSetting => {
        var liArray = languagesUL.querySelectorAll("li");
        console.log(liArray);
        liArray.forEach(li => {
            if (li.getAttribute("value") === langSetting.lang) {
                console.log(li.querySelector("input"));
                li.querySelector("input").checked = true;
                li.querySelector("select").value = langSetting.num;
                li.querySelector("select").style.display = "block";
            }
        });
        switch (langSetting.lang) {
            case "javascript":
                qArray = javascriptQUIZ.slice();
                break;
            case "git":
                qArray = gitQUIZ.slice();
                break;
            case "css":
                qArray = cssQUIZ.slice();
                break;
        }
        qArray.forEach(q => {
            q.type = langSetting.lang;
        });
        qArray.sort(function(a, b) { return 0.5 - Math.random() });
        console.log(qArray);
        var i = qArray.length - parseInt(langSetting.num);
        console.log(langSetting.num, qArray.length, i);
        console.log(typeof qArray.length);
        console.log(typeof langSetting.num);
        qArray.splice(0, i);
        qArray.forEach(e => {
            quizArray.push(e);
        });
    });
    totalSeconds = quizArray.length * 15;
    totalTimeSpan.textContent = totalSeconds + " secs";
}

function startTimer() {
    secondsLeft = totalSeconds;
    interval = setInterval(function() {
        secondsLeft--;
        timerSpan.textContent = secondsLeft;
        if (secondsLeft <= 0) {
            clearInterval(interval);
            // quiz over
            // alert("Time's up!");
            endQuiz();
        }
    }, 1000);
}

function getLangSettingsArray() {
    var a = [];
    var liArray = languagesUL.querySelectorAll("li");
    liArray.forEach(li => {
        if (li.querySelector("input").checked) {
            li.querySelector("select").style.display = "block";
            var l = li.getAttribute("value");
            var n = li.querySelector("select").value;
            a.push({ lang: l, num: n })
        } else {
            li.querySelector("select").style.display = "none";
        }
    });
    return a;
}

function languagesULEventHandler(event) {
    console.log("*************");
    console.log(event.target.type);
    console.log(event.target.closest("li"));
    console.log(event.target.closest("li").querySelector("select"));
    if (event.target.type === "checkbox") {
        var sel = event.target.closest("li").querySelector("select");
        event.target.checked ? sel.style.display = "block" : sel.style.display = "none";
    }
    resetLangSettings();
}

function resetLangSettings() {
    var langSettingsArray = getLangSettingsArray();
    if (langSettingsArray.length < 1) {
        console.log("EMPTY ARRAY")
        setLanguages(getLangSettingsFromStorage());
        return;
    }
    setLanguages(langSettingsArray);
    localStorage.setItem("code-shotgun-settings", JSON.stringify(langSettingsArray));
}

function startQuiz() {
    resetLangSettings();
    quizArray.sort(function(a, b) { return 0.5 - Math.random() });
    userQuizObjectArray = [];
    // showElement(".start-container", false);
    // showElement(".quiz-container", true);
    setFocus(quizContainer);
    startTimer();
    displayPromt();
}

function endQuiz() {
    clearInterval(interval);
    clearChoices(choicesUL);
    // showElement(".quiz-container", false);
    displayResults();
}

function displayPromt() {
    var i = Math.floor(Math.random() * quizArray.length);
    currentPromt = quizArray[i];
    console.log(currentPromt.title);
    promtSpan.textContent = currentPromt.title;
    clearChoices(choicesUL);
    var i = 0;
    colorArray = ["#63B9EA", "#AF7C65", "#C16DEB", "#C2C42F"];
    colorArray.sort(function(a, b) { return 0.5 - Math.random() });
    currentPromt.choices.forEach(element => {
        var li = document.createElement("li");
        li.style.color = colorArray[i];
        i++;
        li.textContent = element;
        choicesUL.appendChild(li);

    });
}

function clearChoices(ul) {
    while (ul.hasChildNodes()) {
        ul.removeChild(ul.firstChild);
    }
}

function checkAnswer(event) {
    console.log(event.target.textContent);
    let msg = "";
    event.target.textContent === currentPromt.answer ? msg = "Correct" : msg = "Incorrect";
    resultSpan.textContent = msg;
    setTimeout(function() {
        resultSpan.textContent = "";
    }, 2000);
    if (msg === "Correct") {

    } else {
        // saveQuestionsArray.push(currentPromt);
        secondsLeft -= 15;
    }
    var userQuizObj = {
        prompt: currentPromt,
        user: event.target.textContent,
        result: msg,
        time: secondsLeft
    };

    userQuizObjectArray.push(userQuizObj);

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
    // showElement(".results-container", true);
    clearChoices(userQuizOl);
    setFocus(resultsContainer);
    scoreSpan.textContent = secondsLeft;
    userQuizObjectArray.forEach(qObj => {
        var li = document.createElement("li");
        var ul = document.createElement("ul");
        ul.style.listStyle = "none";
        for (var i = 0; i < 5; i++) {
            ul.appendChild(document.createElement("li"));
        }
        ul.childNodes[0].textContent = qObj.prompt.type;
        ul.childNodes[1].textContent = qObj.prompt.title;
        ul.childNodes[2].textContent = "User:\t" + qObj.user;
        ul.childNodes[3].textContent = qObj.result;
        ul.childNodes[4].textContent = "Time:\t" + qObj.time + " seconds";
        li.appendChild(ul);
        userQuizOl.appendChild(li);
    });
}

function reset() {
    // showElement(".highscores-container", false);
    // showElement(".quiz-container", false);
    // showElement(".results-container", false);
    // showElement(".start-container", true);
    setFocus(startContainer);
}

function setFocus(container) {
    containerArray.forEach(c => {
        c === container ? c.style.display = "block" : c.style.display = "none";
    });
}

function saveInitialsToStorage() {
    // validate input
    var initials = initialsInput.value;
    if (initials.trim() === "") {
        return;
    }
    var score = {
        initials: initials,
        score: secondsLeft
    };
    var highscores = getHighScores();
    highscores.push(score);
    localStorage.setItem("highscores", JSON.stringify(highscores));
    setFocus(startContainer);
}

function getHighScores() {
    // if highscores in local storage -> returns array -> if not returns empty array
    var hs = JSON.parse(localStorage.getItem("highscores"));
    if (hs === null) {
        hs = [];
    }
    return hs;
}

function viewHighScores() {
    // showElement(".results-container", false);
    // showElement(".start-container", false);
    // showElement(".highscores-container", true);
    clearChoices(scoresUl);
    setFocus(highscoresContainer);
    var highscores = getHighScores();

    highscores.sort((a, b) => (a.score > b.score) ? -1 : 1);

    highscores.forEach(element => {
        var li = document.createElement("li");
        var str = element.initials + "\t" + element.score;
        li.textContent = str;
        scoresUl.appendChild(li);
    });
}

function showElement(selector, show) {
    let el = document.querySelector(selector);
    show ? el.style.display = "block" : el.style.display = "none";
}

startBtn.addEventListener("click", startQuiz);
choicesUL.addEventListener("click", checkAnswer);
cancelBtn.addEventListener("click", reset);
enterBtn.addEventListener("click", saveInitialsToStorage);
languagesUL.addEventListener("change", languagesULEventHandler);