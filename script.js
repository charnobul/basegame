// script.js
let password = "ponchik098";
let attempts = 5;
let balance = 0;
let clickValue = 0.01;
let upgradeCost = 100;
let clickMultiplier = 1.5;

const passwordInput = document.getElementById('passwordInput');
const attemptsLeft = document.getElementById('attemptsLeft');
const balanceDisplay = document.getElementById('balance');
const upgradeCostDisplay = document.getElementById('upgradeCost');
const loginSection = document.getElementById('loginSection');
const gameSection = document.getElementById('gameSection');
const developerSection = document.getElementById('developerSection');
const developerCodeInput = document.getElementById('developerCodeInput');

function login() {
    let passwordAttempt = passwordInput.value;
    if (passwordAttempt === password) {
        attempts = 5;
        attemptsLeft.textContent = attempts;
        passwordInput.value = '';
        loginSection.classList.add('hidden');
        gameSection.classList.remove('hidden');
        updateBalance();
    } else {
        attempts--;
        attemptsLeft.textContent = attempts;
        if (attempts === 0) {
            alert('Вы использовали все попытки. Пожалуйста, попробуйте позже.');
            passwordInput.disabled = true;
        }
    }
}

function updateBalance() {
    balanceDisplay.textContent = balance.toFixed(2);
}

function clickCoin() {
    coin.classList.add('clicked');
    setTimeout(() => {
        coin.classList.remove('clicked');
    }, 200); // Удаляем класс 'clicked' через 200 мс

    balance += clickValue;
    updateBalance();
}

const coin = document.getElementById('coin');
coin.addEventListener('click', clickCoin);

function buyUpgrade() {
    if (balance >= upgradeCost) {
        balance -= upgradeCost;
        clickValue *= clickMultiplier;
        upgradeCost *= clickMultiplier;
        updateBalance();
        upgradeCostDisplay.textContent = upgradeCost.toFixed(2);
    } else {
        alert('Недостаточно гривен для покупки улучшения клика!');
    }
}

function enterDeveloperMode() {
    const code = developerCodeInput.value;
    if (code === "jjj") {
        developerCodeInput.value = '';
        developerSection.classList.add('hidden');
        // Добавьте код для входа в режим разработчика
    } else {
        alert('Неверный код. Пожалуйста, попробуйте снова.');
    }
}
