// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand(); // Развернуть приложение на весь экран

let timer;
let seconds = 0;
let currentPractice = null;

const practices = {
    square: {
        steps: ["Вдох", "Задержка", "Выдох", "Пауза"],
        durations: [4, 4, 4, 4]
    },
    wimhof: {
        steps: ["Глубокий вдох", "Задержка"],
        durations: [2, 10]
    }
};

function startPractice(type) {
    currentPractice = practices[type];
    seconds = 0;
    updateTimer();
    animateBreathing(0);
}

function animateBreathing(stepIndex) {
    if (!currentPractice || stepIndex >= currentPractice.steps.length) {
        document.getElementById("instruction").textContent = "Практика завершена!";
        clearInterval(timer);
        return;
    }

    const step = currentPractice.steps[stepIndex];
    const duration = currentPractice.durations[stepIndex] * 1000;

    document.getElementById("instruction").textContent = step;
    
    // Анимация круга
    const circle = document.getElementById("breath-circle");
    if (step === "Вдох" || step === "Глубокий вдох") {
        circle.style.transform = "scale(1.5)";
    } else if (step === "Выдох") {
        circle.style.transform = "scale(1)";
    }

    setTimeout(() => {
        animateBreathing(stepIndex + 1);
    }, duration);
}

function updateTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        document.getElementById("timer").textContent = 
            `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
}