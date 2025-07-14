// Инициализация Telegram WebApp
if (window.Telegram?.WebApp) {
  const tg = Telegram.WebApp;
  tg.expand();
  tg.setBackgroundColor('#181818');
}

const practice = {
  steps: ["Вдох", "Задержка", "Выдох", "Пауза"],
  durations: [4, 4, 4, 4]
};

let currentStep = 0;
let isRunning = false;

document.getElementById('start-btn').addEventListener('click', () => {
  document.getElementById('main-screen').classList.add('hidden');
  document.getElementById('practice-screen').classList.remove('hidden');
  startPractice();
});

function startPractice() {
  if (isRunning) return;
  isRunning = true;
  animateBreath();
}

function animateBreath() {
  if (currentStep >= practice.steps.length) {
    currentStep = 0;
  }

  const circle = document.getElementById('breath-circle');
  const instruction = document.getElementById('instruction');
  const step = practice.steps[currentStep];
  const duration = practice.durations[currentStep] * 1000;

  instruction.textContent = step;

  // Анимация круга
  if (step === "Вдох") {
    circle.style.transform = "scale(1.5)";
    circle.style.borderColor = "#8B008B";
  } else if (step === "Выдох") {
    circle.style.transform = "scale(1)";
    circle.style.borderColor = "#4B0082";
  }

  currentStep++;
  
  setTimeout(() => {
    animateBreath();
  }, duration);
}
