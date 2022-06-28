import {questions} from './questionsArray.js'
import {answ1, answ2, answ3, answ4, answerElements} from './answers.js'
import {question, numberOfAllQuestion, numberOfAllQuestion1, numberOfQuestion, numberOfQuestion1} from './questions.js'
import {btnHint1, btnHint50, btnHintGoogle, btnNext, btnNoAnswerClose, btnTryAgain, btnTryAgain1} from './buttons.js'
import {soundCorrect, soundHint, soundNoAnswer, soundWrong} from './sound.js'

let indexOfQuestion = 0,        //индекс текущего вопроса
    indexOfPage = 0;        //индекс страницы

let score = 0;                                                                       //счёт игры (несгораемая сумма)

const resultMoney = document.getElementById('result-money');                         //Результат заработанных денег

const numberOfQuestionList = document.querySelectorAll('.result_list');             //список номеров вопросов и стоимости вопросов

const userName = document.querySelector('.textarea1'),
      buttonGo = document.querySelector('.button_next1_start');

let timer,                                                                 //timer
    timerStart = 100;

const timerMove = () => {
    document.getElementById('timer').innerHTML = timerStart;
    timerStart--; 
  if (timerStart < 0){
    clearTimeout(timer); 
    soundWrong.play();
    gameOver();
  }
  else {
    timer = setTimeout(timerMove, 1000);
  }
};

buttonGo.onclick = () => {                                                 //действие кнопки старт игры
    timerMove();
    document.querySelector('.fcont1_uname').innerHTML = userName.value;
    document.querySelector('.modal_start').classList.add('noactive');
   };

btnNoAnswerClose.onclick = () => {
    document.querySelector('.modal_noanswer').classList.remove('active');
};

const gameOver = () => {                                                //вызов модального окна (поражение)
    document.querySelector('.modal_over').classList.add('active');
},

      gameWin = () => {                                                //вызов модального окна (победа)
    document.querySelector('.modal_win').classList.add('active');
};

numberOfAllQuestion.innerHTML = questions.length; //количество всех вопросов
numberOfAllQuestion1.innerHTML = questions.length;

let randomNumber;

let randomQuestion = () => {
   randomNumber = Math.floor(Math.random() * questions[indexOfQuestion].question.length); //рандомное число
};

let wrongArray = [];                                                                       //Массив не верных ответов

const load = () => {
    randomQuestion();
    backgroundRemove();
    backgroundChange();
    question.innerHTML = questions[indexOfQuestion].question[randomNumber]; //конкретно вопрос

    answ1.innerHTML = questions[indexOfQuestion].answers[randomNumber][0];  //варианты ответов
    answ2.innerHTML = questions[indexOfQuestion].answers[randomNumber][1];
    answ3.innerHTML = questions[indexOfQuestion].answers[randomNumber][2];
    answ4.innerHTML = questions[indexOfQuestion].answers[randomNumber][3];
 
    numberOfQuestion.innerHTML = indexOfPage + 1;              //номер текущей страницы
    numberOfQuestion1.innerHTML = indexOfPage;                 //количество правильных ответов
    ++indexOfPage;
    n--;
    for(let i = 0; i < questions[indexOfQuestion].answers[randomNumber].length; i++) {          //добавление не правильных ответов в массив
        if(i !== questions[indexOfQuestion].answers[randomNumber][4]) {
            wrongArray.push(i);
        }
    };
    
    if(indexOfPage <= 5) {                                                 //счётчик несгораемой суммы
        score = 0;
    } else if(indexOfPage <= 10) {
        score = 1000;
    } else if(indexOfPage >= 10) {
        score = 32000;
    };
    resultMoney.innerHTML = score;
};

let n = questions.length - 1;

let backgroundChange = () => numberOfQuestionList[n].classList.add('background'),     //смена фона в списке стоимостей вопросов
    backgroundRemove = () => numberOfQuestionList[n + 1].classList.remove('background');

const checkQuestion = () => {                         //Проверка оставшегося количества вопросов
    if(indexOfPage == questions.length) {
        gameWin();
    } else {
        load();
    }
};

const disabledAnswer = () => {                                    //блокировка оставшихся ответов
    answerElements.forEach(item => {
        item.classList.add('disabled');
        if(item.dataset.id == questions[indexOfQuestion].answers[randomNumber][4]) {
            item.classList.add('correct');
        };
    })
};

const enabledAnswer = () => {                                     //удаление блокировки ответов
    answerElements.forEach(item => {
        item.classList.remove('disabled', 'correct', 'wrong');
});
document.querySelector('.button_50').classList.remove('noactive1');       //удаление неактивности кнопок подсказок
document.querySelector('.button_1').classList.remove('noactive1');
document.querySelector('.button_google').classList.remove('noactive1');
};

const buttonNoActive = () => {                                               //удаление активности кнопки Далее
    document.querySelector('.button_main_next').classList.add('noactive');
},
     buttonNoActive50 = () => {
    soundHint.play();                                               //удаление активности кнопки 50x50
    document.querySelector('.button_50').classList.add('noactive');
    answerElements[wrongArray[0]].classList.add('wrong', 'disabled');         //действие подсказок
    answerElements[wrongArray[2]].classList.add('wrong', 'disabled');
},
     buttonNoActive1 = () => {                                               //удаление активности кнопки -1
    soundHint.play();
    document.querySelector('.button_1').classList.add('noactive');
    answerElements[wrongArray[1]].classList.add('wrong', 'disabled');        //действие подсказок
},
     buttonNoActiveGoogle = () => {                                               //удаление активности кнопки Google help
    soundHint.play();
    document.querySelector('.button_google').classList.add('noactive');            //действие подсказок
    clearTimeout(timer);
};

btnHint50.addEventListener('click', buttonNoActive50);
btnHint1.addEventListener('click', buttonNoActive1);
btnHintGoogle.addEventListener('click', buttonNoActiveGoogle);

const noActiveButtonHints = () => {                                             //Создание неактивности кнопок подсказок
    document.querySelector('.button_50').classList.add('noactive1');            
        document.querySelector('.button_1').classList.add('noactive1');
        document.querySelector('.button_google').classList.add('noactive1');
}

const checkAnswer = (el) => {                                                               //проверка на правильность ответа
    if(el.target.dataset.id == questions[indexOfQuestion].answers[randomNumber][4]){
        el.target.classList.add('correct');
        soundCorrect.play();
        clearTimeout(timer);
        wrongArray = [];
        noActiveButtonHints();
        
        
    } else {
        el.target.classList.add('wrong');
        soundWrong.play();
        buttonNoActive();
        noActiveButtonHints();
        clearTimeout(timer);
        setTimeout(gameOver, 2000);
        
    };

    disabledAnswer();
};

const validate = () => {                                         //отказ при невыбранном ответе
    if(!answerElements[0].classList.contains('disabled') || !answerElements[1].classList.contains('disabled') || !answerElements[2].classList.contains('disabled') || !answerElements[3].classList.contains('disabled')) {
        soundNoAnswer.play();
        document.querySelector('.modal_noanswer').classList.add('active');
    } else {                                                     //переход к следующему вопросу
        indexOfQuestion++;
        checkQuestion();
        enabledAnswer();
        timerStart = 100;
        timerMove();
        
    }
};

btnNext.addEventListener('click', validate);         //отказ при невыбранном ответе

for(let answer of answerElements) {
    answer.addEventListener('click', e => checkAnswer(e));
};

const tryAgain = () => {
    window.location.reload();
};

btnTryAgain.addEventListener('click', tryAgain);
btnTryAgain1.addEventListener('click', tryAgain);

window.addEventListener('load', () => {
    checkQuestion();
});