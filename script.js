const startButton = document.querySelector('#start-btn');
const nextButton = document.querySelector('#next-btn');
const exitButton = document.getElementById('exit-btn');
const questionContainerElement = document.querySelector('#question-container');
const questionElement = document.querySelector('#question');
const answerButtonsElement = document.querySelector('#answer-buttons');

let shuffledQuestions, currentQuestionIndex, countdown, correctAnswers;

const startQuiz = () => {
    startButton.classList.add('hidden');
    nextButton.classList.add('hidden');
    nextButton.classList.remove('exit');
    shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    correctAnswers = 0;
    questionContainerElement.classList.remove('hidden');
    setNextQuestion();
};

const setNextQuestion = () => {
    resetState();
    displayQuestion(shuffledQuestions[currentQuestionIndex]);
    exitButton.classList.add('hidden');
};

const displayQuestion = (question) => {
    questionElement.innerText = question.question;
    nextButton.classList.add('hidden');
    let timeLeft = 10;
    const timerContainer = document.createElement('div');
    timerContainer.classList.add('relative', 'w-full', 'h-7', 'bg-gray-300', 'rounded-md', 'overflow-hidden');
    const timerElement = document.createElement('div');
    timerElement.textContent = `${timeLeft} seconds`;
    timerElement.classList.add('absolute', 'top-0', 'left-0', 'h-full', 'bg-green-500', 'rounded-lg');
    timerContainer.appendChild(timerElement);
    timerContainer.id = 'timer-container';
    questionContainerElement.appendChild(timerContainer);

    countdown = setInterval(() => {
        timeLeft--;
        const percentLeft = (timeLeft / 10) * 100;
        timerElement.textContent = `${timeLeft} seconds`;
        timerElement.style.width = percentLeft + '%';

        if (timeLeft === 0) {
            chooseAnswer(null);
            alert("TimeOut...None option selected")
        }
    }, 1000);

    question.answers.forEach((answer) => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('bg-blue-400', 'border', 'border-blue-900', 'rounded-lg', 'border-solid', 'text-white', 'outline-none', 'py-1', 'px-2.5');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', chooseAnswer);
        answerButtonsElement.appendChild(button);
    });
};

const resetState = () => {
    clearStatusClass(document.body);
    nextButton.classList.add('hidden');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
    const prevTimerContainer = document.querySelector('#timer-container');
    if (prevTimerContainer) {
        prevTimerContainer.remove();
    }
};

const chooseAnswer = (e) => {
    clearInterval(countdown);
    const selectedButton = e ? e.target : null;
    const correct = selectedButton ? selectedButton.dataset.correct : false;

    Array.from(answerButtonsElement.children).forEach((button) => {
        if (button === selectedButton) {
            button.classList.add('bg-blue-900');
        }
    });

    if (correct) {
        correctAnswers++;
    }

    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hidden');
    } else {
        if (correct) {
            setStatusClass(selectedButton, correct);
        }
        setTimeout(showResult, 500);
    }
};

const showResult = () => {
    questionContainerElement.classList.add('hidden');
    const score = `You answered ${correctAnswers} out of ${shuffledQuestions.length} questions correctly.`;

    const percentageCorrect = (correctAnswers / shuffledQuestions.length) * 100;
    if (percentageCorrect > 75) {
        const successMessage = `
            <div id="modal-bg" class="modal-bg fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
                <div class="modal p-8 bg-white rounded-lg shadow-lg">
                    <img src="assets/images/amj.gif" class="w-40 mx-auto mb-4" alt="Success GIF">
                    <p class="text-center">${score}</p>
                    <button id="ok-btn" class="bg-pink-700 px-4 py-2 text-white text-lg rounded-lg mt-4 mx-auto block">OK</button>
                    <audio autoplay src="assets/audios/yay-6120.mp3"></audio>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', successMessage);

        const okButton = document.getElementById('ok-btn');
        okButton.addEventListener('click', () => {
            const modalBg = document.getElementById('modal-bg');
            modalBg.remove(); // Remove modal background
            startButton.innerText = 'Restart';
            startButton.classList.remove('hidden');

            exitButton.addEventListener('click', () => {
                window.location.reload(); // Reload the page to exit the quiz
            });
            exitButton.classList.remove('hidden');
        });

    } else {
        const successMessage = `
            <div id="modal-bg" class="modal-bg fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
                <div class="modal p-8 bg-white rounded-lg shadow-lg">
                    <img src="assets/images/giphy.gif" class="w-40 mx-auto mb-4" alt="Sad GIF">
                    <p class="text-center">${score}</p>
                    <button id="ok-btn" class="bg-pink-700 px-4 py-2 text-white text-lg rounded-lg mt-4 mx-auto block">OK</button>
                    <audio autoplay src="assets/audios/sad.mp3"></audio>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', successMessage);

        const okButton = document.getElementById('ok-btn');
        okButton.addEventListener('click', () => {
            const modalBg = document.getElementById('modal-bg');
            modalBg.remove(); // Remove modal background
            startButton.innerText = 'Restart';
            startButton.classList.remove('hidden');

            exitButton.addEventListener('click', () => {
                window.location.reload();
            });
            exitButton.classList.remove('hidden');
        });
    }
};


const setStatusClass = (element, correct) => {
    clearStatusClass(element);
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
};


const clearStatusClass = (element) => {
    element.classList.remove('correct');
    element.classList.remove('wrong');
};

const questions = [
    {
        question: 'What does HTML stand for?',
        answers: [
            { text: 'Hyperlinks and Text Markup Language', correct: false },
            { text: 'Hyper Text Markup Language', correct: true },
            { text: 'Home Tool Markup Language', correct: false },
            { text: 'Hyper Transfer Markup Language', correct: false },
        ],
    },
    {
        question: 'Which tag is used to create a hyperlink in HTML?',
        answers: [
            { text: '<h1>', correct: false },
            { text: '<p>', correct: false },
            { text: '<div>', correct: false },
            { text: '<a>', correct: true },
        ],
    },
    {
        question: 'What does CSS stand for?',
        answers: [
            { text: 'Cascading Style Sheets', correct: true },
            { text: 'Creative Style Sheets', correct: false },
            { text: 'Computer Style Sheets', correct: false },
            { text: 'Colorful Style Sheets', correct: false },
        ],
    },
    {
        question: 'Which property is used to change the background color of an element in CSS?',
        answers: [
            { text: 'color', correct: false },
            { text: 'background-color', correct: true },
            { text: 'font-size', correct: false },
            { text: 'text-align', correct: false },
        ],
    },
    {
        question: 'What symbol is used to select an ID in CSS?',
        answers: [
            { text: '/', correct: false },
            { text: '.', correct: false },
            { text: '#', correct: true },
            { text: '&', correct: false },
        ],
    },
];


startButton.addEventListener('click', startQuiz);

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
});