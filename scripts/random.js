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
let clue;
let score = 0;
let strikes = 0;

function getData() {
    fetch('http://127.0.0.1:3000/random_question')
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
getData();