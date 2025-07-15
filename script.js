// Инициализация Telegram WebApp
if (window.Telegram?.WebApp) {
  const tg = Telegram.WebApp;
  tg.expand();
  tg.setBackgroundColor('#181818');
}

// Режимы дыхания
const modes = {
  standard: {
    steps: ["Вдох", "Задержка", "Выдох", "Пауза"],
    durations: [4, 7, 8, 2],
    scales: {
      "Вдох": [1, 1.4],
      "Задержка": [1.4, 1.4],
      "Выдох": [1.4, 1],
      "Пауза": [1, 1]
    }
  },
  sleep: {
    steps: ["Медленный вдох", "Задержка", "Плавный выдох"],
    durations: [6, 2, 8],
    scales: {
      "Медленный вдох": [1, 1.4],
      "Задержка": [1.4, 1.4],
      "Плавный выдох": [1.4, 1]
    }
  },
  antistress: {
    steps: ["Глубокий вдох", "Быстрый выдох"],
    durations: [5, 3],
    scales: {
      "Глубокий вдох": [1, 1.4],
      "Быстрый выдох": [1.4, 1]
    }
  }
};

let currentMode = 'standard';
let practice = JSON.parse(JSON.stringify(modes.standard));
let currentStep = 0;
let isRunning = false;
let animationFrame;
let startTime;
let countdownInterval;

// Элементы интерфейса
const menuBtn = document.getElementById('menu-btn');
const menu = document.getElementById('menu');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');

// Инициализация
document.querySelectorAll('.menu-item').forEach(item => {
  item.addEventListener('click', () => {
    currentMode = item.dataset.mode;
    document.querySelector('.menu-item.active').classList.remove('active');
    item.classList.add('active');
    document.body.className = `${currentMode}-mode`;
    resetPractice();
    menu.classList.remove('active');
  });
});

menuBtn.addEventListener('click', () => {
  menu.classList.toggle('active');
});

startBtn.addEventListener('click', startCountdown);
stopBtn.addEventListener('click', stopPractice);

function startCountdown() {
  document.getElementById('main-screen').classList.add('hidden');
  document.getElementById('practice-screen').classList.remove('hidden');
  
  let count = 3;
  const countdownElement = document.getElementById('countdown');
  countdownElement.classList.remove('hidden');
  countdownElement.textContent = count;
  
  countdownInterval = setInterval(() => {
    count--;
    countdownElement.textContent = count;
    
    if (count <= 0) {
      clearInterval(countdownInterval);
      countdownElement.classList.add('hidden');
      stopBtn.classList.remove('hidden');
      startPractice();
    }
  }, 1000);
}

function startPractice() {
  if (isRunning) return;
  
  isRunning = true;
  currentStep = 0;
  startTime = null;
  
  const circle = document.getElementById('breath-circle');
  circle.style.transform = "scale(1)";
  document.getElementById('instruction').textContent = practice.steps[0];
  
  animateBreath();
}

function stopPractice() {
  isRunning = false;
  cancelAnimationFrame(animationFrame);
  clearInterval(countdownInterval);
  
  const circle = document.getElementById('breath-circle');
  circle.style.transform = "scale(1)";
  document.getElementById('instruction').textContent = "";
  document.getElementById('countdown').classList.add('hidden');
  stopBtn.classList.add('hidden');
  
  document.getElementById('main-screen').classList.remove('hidden');
  document.getElementById('practice-screen').classList.add('hidden');
}

function resetPractice() {
  stopPractice();
  practice = JSON.parse(JSON.stringify(modes[currentMode]));
  playEffect("Смена режима"); // Звук при смене режима
  document.body.className = `${currentMode}-mode`;
}

function animateBreath(timestamp) {
  if (!isRunning) return;
  
  if (!startTime) startTime = timestamp;
  const elapsed = (timestamp - startTime) / 1000;
  const duration = practice.durations[currentStep];
  const progress = Math.min(elapsed / duration, 1);
  
  const circle = document.getElementById('breath-circle');
  const instruction = document.getElementById('instruction');
  const step = practice.steps[currentStep];
  
  instruction.textContent = step;

  // 1. ВЫЧИСЛЕНИЕ ТЕКУЩЕГО МАСШТАБА (ЗДЕСЬ МЕНЯЕТСЯ РАЗМЕР)
  const [startScale, endScale] = practice.scales[step];
  const currentScale = startScale + (endScale - startScale) * progress;
  
  // 2. ПРИМЕНЕНИЕ МАСШТАБА К КРУГУ
  circle.style.transform = `scale(${currentScale})`;

  if (progress >= 1) {
    startTime = null;
    currentStep = (currentStep + 1) % practice.steps.length;
  }
  
  animationFrame = requestAnimationFrame(animateBreath);
}
const sounds = {
  inhale: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-single-breath-in-1230.mp3'),
  exhale: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-breath-out-1231.mp3'),
  transition: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-quick-jump-arcade-game-239.mp3')
};

// Проверка поддержки вибрации
const canVibrate = 'vibrate' in navigator;

function playEffect(step) {
  try {
    // Вибрация (на мобильных устройствах)
    if (canVibrate) {
      switch(step) {
        case "Вдох":
        case "Медленный вдох":
        case "Глубокий вдох":
          navigator.vibrate(200);
          break;
        case "Выдох":
        case "Плавный выдох":
        case "Быстрый выдох":
          navigator.vibrate(100);
          break;
        case "Задержка":
          navigator.vibrate([100, 50, 100]);
          break;
      }
    }

    // Звуковые эффекты
    if (sounds.inhale && sounds.exhale) {
      switch(step) {
        case "Вдох":
        case "Медленный вдох":
        case "Глубокий вдох":
          sounds.inhale.currentTime = 0;
          sounds.inhale.play();
          break;
        case "Выдох":
        case "Плавный выдох":
        case "Быстрый выдох":
          sounds.exhale.currentTime = 0;
          sounds.exhale.play();
          break;
        case "Смена режима":
          sounds.transition.currentTime = 0;
          sounds.transition.play();
          break;
      }
    }
  } catch (e) {
    console.log("Ошибка воспроизведения:", e);
  }
}

// Обновлённая функция animateBreath()
function animateBreath(timestamp) {
  if (!isRunning) return;
  
  if (!startTime) {
    startTime = timestamp;
    playEffect(practice.steps[currentStep]); // Воспроизводим звук при начале фазы
  }
  
  const elapsed = (timestamp - startTime) / 1000;
  const duration = practice.durations[currentStep];
  const progress = Math.min(elapsed / duration, 1);
  
  const circle = document.getElementById('breath-circle');
  const instruction = document.getElementById('instruction');
  const step = practice.steps[currentStep];
  
  instruction.textContent = step;

  const [startScale, endScale] = practice.scales[step];
  const currentScale = startScale + (endScale - startScale) * progress;
  circle.style.transform = `scale(${currentScale})`;

  if (progress >= 1) {
    startTime = null;
    currentStep = (currentStep + 1) % practice.steps.length;
    playEffect(practice.steps[currentStep]); // Звук следующей фазы
  }
  
  animationFrame = requestAnimationFrame(animateBreath);
}

// Управление звуком
let soundEnabled = true;
const soundToggle = document.createElement('div');
soundToggle.className = 'sound-toggle';
document.body.appendChild(soundToggle);

soundToggle.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  soundToggle.classList.toggle('muted');
});

// Сброс при загрузке
window.addEventListener('load', resetPractice);
