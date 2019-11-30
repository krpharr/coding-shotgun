var scoresUl = document.querySelector("#scoresUlID");

var highscores = getHighScores();

highscores.sort((a, b) => (a.score > b.score) ? -1 : 1);

highscores.forEach(element => {
    var li = document.createElement("li");
    var str = element.initials + "\t" + element.score;
    li.textContent = str;
    scoresUl.appendChild(li);
});

function getHighScores() {
    // if highscores in local storage -> returns array -> if not returns empty array
    var hs = JSON.parse(localStorage.getItem("highscores"));
    if (hs === null) {
        hs = [];
    }
    return hs;
}