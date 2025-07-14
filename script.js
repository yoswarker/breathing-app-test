// Инициализация Telegram WebApp
if (window.Telegram?.WebApp) {
  const tg = Telegram.WebApp;
  tg.expand();
  tg.setBackgroundColor('#181818');
}

const practice = {
  steps: ["Вдох", "Задержка", "Выдох", "Пауза"],
  durations: [4, 4, 4, 4] // В секундах
};

let currentStep = 0;
let isRunning = false;
let animationFrame;
let startTime;
let scale = 1;
let countdownInterval;

document.getElementById('start-btn').addEventListener('click', startCountdown);
document.getElementById('stop-btn').addEventListener('click', stopPractice);

function startCountdown() {
  document.getElementById('main-screen').classList.add('hidden');
  document.getElementById('practice-screen').classList.remove('hidden');
  
  let count = 3;
  const countdownElement = document.getElementById('countdown');
  countdownElement.classList.remove('hidden');
  countdownElement.textContent = `Приготовьтесь: ${count}`;
  
  countdownInterval = setInterval(() => {
    count--;
    countdownElement.textContent = `Приготовьтесь: ${count}`;
    
    if (count <= 0) {
      clearInterval(countdownInterval);
      countdownElement.classList.add('hidden');
      document.getElementById('stop-btn').classList.remove('hidden');
      startPractice();
    }
  }, 1000);
}

function startPractice() {
  if (isRunning) return;
  
  isRunning = true;
  currentStep = 0;
  scale = 1;
  startTime = null;
  
  const circle = document.getElementById('breath-circle');
  circle.style.transform = "scale(1)";
  document.getElementById('instruction').textContent = practice.steps[0];
  
  animateBreath();
}

function stopPractice() {
  // 1. Остановка всех анимаций
  cancelAnimationFrame(animationFrame);
  clearInterval(countdownInterval);
  
  // 2. Полный сброс состояния
  isRunning = false;
  currentStep = 0;
  scale = 1;
  startTime = null;
  
  // 3. Сброс визуальных элементов
  const circle = document.getElementById('breath-circle');
  circle.style.transform = "scale(1)";
  document.getElementById('instruction').textContent = "";
  document.getElementById('countdown').classList.add('hidden');
  document.getElementById('stop-btn').classList.add('hidden');
  
  // 4. Возврат на главный экран
  document.getElementById('main-screen').classList.remove('hidden');
  document.getElementById('practice-screen').classList.add('hidden');
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

  // Анимация масштабирования
  switch(step) {
    case "Вдох":
      scale = 1 + 0.5 * progress;
      break;
    case "Выдох":
      scale = 1.5 - 0.5 * progress;
      break;
    default:
      // Задержка и пауза без изменений масштаба
      break;
  }
  
  circle.style.transform = `scale(${scale})`;

  if (progress >= 1) {
    startTime = null;
    currentStep = (currentStep + 1) % practice.steps.length;
  }
  
  animationFrame = requestAnimationFrame(animateBreath);
}
