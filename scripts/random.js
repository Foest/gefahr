const category = document.querySelector('#category');
const clueText = document.querySelector('#clue-text');
const answerText = document.querySelector('#answer-text');
const value = document.querySelector('#value');
const round = document.querySelector('#round');
const submitBtn = document.querySelector('#btn-submit');
const nextBtn = document.querySelector('#btn-next');
const response = document.querySelector('#response');
const scoreDisplay = document.querySelector('#score');
const outer = document.querySelector('.outer');
const easyModeBox = document.querySelector('#easy-mode');
let difficulty = "";
let clue;
let score = 0;
let strikes = 0;

function getData() {
    let data = {mode: difficulty,}
    fetch('http://127.0.0.1:3000/random_question', {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, same-origin, *omit
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
        })
        .then((res) => res.json())
        .then((data) => {
            clue = {
                clue: data.clue,
                answer: data.answer,
                category: data.category,
                value: data.value,
                round: data.round
            }

            category.textContent = clue.category;
            clueText.textContent = clue.clue;
            answerText.textContent = clue.answer;
            value.textContent = clue.value;
            round.textContent = `Round ${clue.round}`;
        })
        .catch((e) => {
            console.log(e.message);
        });
}


function updateDisplay(){
    if(strikes > 3){
        score = 0;
        scoreDisplay.textContent = `${score}`;
        response.value = '';
    } else {
        scoreDisplay.textContent = `${score}`;
        response.value = '';
    }
}

function checkAnswer() {
    const val = parseInt(value.textContent);
    if(checkResponse(response.value, answerText.textContent)){
        answerText.classList.add('correct');
        outer.style.opacity = '1';
        score += val;
        //scoreDisplay.textContent = `${score}`;
        //response.value = '';
        updateDisplay();
        setTimeout(() => {
            answerText.classList.remove('correct');
            outer.style.opacity = '0';
            getData();
        }, 1500);
    } else {
        answerText.classList.add('incorrect');
        outer.style.opacity = '1';
        score -= val;
        strikes += 1;
        //scoreDisplay.textContent = `${score}`;
        //response.value = '';
        updateDisplay();
        setTimeout(() => {
            answerText.classList.remove('incorrect');
            outer.style.opacity = '0';
            getData();
        }, 1500);
    }
}

window.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

submitBtn.addEventListener('click', checkAnswer);
nextBtn.addEventListener('click', getData);
easyModeBox.addEventListener("change", () => {
    difficulty === "easy" ? difficulty = "" : difficulty = "easy";
});
getData();