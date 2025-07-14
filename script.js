// Инициализация Telegram WebApp
if (window.Telegram && Telegram.WebApp) {
  const tg = Telegram.WebApp;
  tg.expand(); // Растянуть на весь экран
  tg.enableClosingConfirmation(); // Подтверждение закрытия
  tg.setHeaderColor('#26a69a');
  tg.setBackgroundColor('#e0f7fa');
}

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
  console.log("Запуск практики:", type);
  
  if (!practices[type]) {
    alert("Ошибка: неизвестный тип практики");
    return;
  }

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
  
  // Анимация круга + вибрация
  const circle = document.getElementById("breath-circle");
  if (step.includes("Вдох")) {
    circle.style.transform = "scale(1.5)";
    vibrate(200);
  } else if (step === "Выдох") {
    circle.style.transform = "scale(1)";
    vibrate(100);
  } else if (step === "Задержка") {
    vibrate([100, 200, 100]);
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

function vibrate(pattern) {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  } else {
    console.log("Вибрация не поддерживается");
  }
}

// Для iOS: вибрация только после клика
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => vibrate(50));
});
