document.addEventListener('DOMContentLoaded', function () {
    const registrationForm = document.getElementById('registrationForm');
    const loginForm = document.getElementById('loginForm');
    const registration = document.getElementById('registration');
    const login = document.getElementById('login');
    const bank = document.getElementById('bank');
    const balanceDisplay = document.getElementById('balance');
    const coin = document.getElementById('coin');
    const upgradeClick = document.getElementById('upgradeClick');
    const buyAutoClicker = document.getElementById('buyAutoClicker');
    const devMode = document.getElementById('devMode');
    const devCode = document.getElementById('devCode');
    const applyCode = document.getElementById('applyCode');
    const loginPassword = document.getElementById('loginPassword');
    const loginAttemptsDisplay = document.getElementById('loginAttempts');
    const achievementsList = document.getElementById('achievements');
    const themeToggle = document.getElementById('themeToggle');

    let balance = 0;
    let clickValue = 0.01;
    let upgradeCost = 100;
    let autoClickerCost = 500;
    let autoClickerInterval;
    let loginAttempts = 0;

    let devClicks = [];
    const devSequence = ['top-left', 'top-right', 'top-left', 'top-left', 'bottom-right'];
    const maxDelay = 3000; // 3 seconds
    let lastClickTime = 0;

    const secretKey = 'ponchik098';

    // Проверка существующих данных
    if (localStorage.getItem('userPassword')) {
        login.classList.remove('hidden');
        updateLoginAttempts();
        loadProgress();
    } else {
        registration.classList.remove('hidden');
    }

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
    }

    registrationForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const userName = document.getElementById('name').value;
        const userPassword = document.getElementById('password').value;

        localStorage.setItem('userName', userName);
        localStorage.setItem('userPassword', encrypt(userPassword));
        localStorage.setItem('balance', '0');
        localStorage.setItem('clickValue', clickValue);
        localStorage.setItem('loginAttempts', '0');

        registration.classList.add('hidden');
        bank.classList.remove('hidden');
        updateBalance();
    });

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const userPassword = loginPassword.value;

        if (decrypt(localStorage.getItem('userPassword')) === userPassword) {
            balance = parseFloat(localStorage.getItem('balance'));
            clickValue = parseFloat(localStorage.getItem('clickValue'));
            bank.classList.remove('hidden');
            login.classList.add('hidden');
            updateBalance();
        } else {
            loginAttempts++;
            localStorage.setItem('loginAttempts', loginAttempts);
            updateLoginAttempts();
            if (loginAttempts >= 5) {
                localStorage.clear();
                alert('Слишком много неверных попыток. Данные сброшены.');
                location.reload();
            }
        }
    });

    coin.addEventListener('click', function (e) {
        balance += clickValue;
        updateBalance();
        saveProgress();
        handleDevClick(e);
        checkAchievements();
    });

    upgradeClick.addEventListener('click', function () {
        if (balance >= upgradeCost) {
            balance -= upgradeCost;
            clickValue += 0.01;
            upgradeCost *= 1.5;
            upgradeClick.innerText = `Прокачать клик (${upgradeCost.toFixed(2)} гривен)`;
            updateBalance();
            saveProgress();
        } else {
            alert('Недостаточно средств для прокачки!');
        }
    });

    buyAutoClicker.addEventListener('click', function () {
        if (balance >= autoClickerCost) {
            balance -= autoClickerCost;
            startAutoClicker();
            autoClickerCost *= 2;
            buyAutoClicker.innerText = `Купить автокликер (${autoClickerCost.toFixed(2)} гривен)`;
            updateBalance();
            saveProgress();
        } else {
            alert('Недостаточно средств для покупки автокликера!');
        }
    });

    applyCode.addEventListener('click', function () {
        const code = devCode.value.trim();
        if (code.startsWith('-')) {
            const amount = parseFloat(code.slice(1));
            if (!isNaN(amount)) {
                balance -= amount;
            }
        } else if (code.startsWith('+')) {
            const letters = code.slice(1).split('');
            let number = '';
            letters.forEach(letter => {
                switch (letter) {
                    case 'h': number += '1'; break;
                    case 'k': number += '2'; break;
                    case 'r': number += '3'; break;
                    case 'v': number += '4'; break;
                    case 'p': number += '5'; break;
                    case 'z': number += '6'; break;
                    case 'e': number += '7'; break;
                    case 's': number += '8'; break;
                    case 'j': number += '9'; break;
                    case 'm': number += '0'; break;
                }
            });
            balance += parseInt(number);
        }
        updateBalance();
        saveProgress();
        devMode.classList.add('hidden');
    });

    themeToggle.addEventListener('click', function () {
        document.body.classList.toggle('dark-theme');
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });

    function updateBalance() {
        balanceDisplay.innerText = balance.toFixed(2);
    }

    function saveProgress() {
        localStorage.setItem('balance', balance.toFixed(2));
        localStorage.setItem('clickValue', clickValue.toFixed(2));
    }

    function loadProgress() {
        balance = parseFloat(localStorage.getItem('balance')) || 0;
        clickValue = parseFloat(localStorage.getItem('clickValue')) || 0.01;
        updateBalance();
        upgradeClick.innerText = `Прокачать клик (${upgradeCost.toFixed(2)} гривен)`;
    }

    function updateLoginAttempts() {
        loginAttempts = parseInt(localStorage.getItem('loginAttempts')) || 0;
        loginAttemptsDisplay.innerText = `Осталось попыток: ${5 - loginAttempts}`;
    }

    function handleDevClick(e) {
        const now = Date.now();
        const rect = coin.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        let position = '';
        if (x < rect.width / 2 && y < rect.height / 2) {
            position = 'top-left';
        } else if (x > rect.width / 2 && y < rect.height / 2) {
            position = 'top-right';
        } else if (x > rect.width / 2 && y > rect.height / 2) {
            position = 'bottom-right';
        }

        if (devClicks.length === 0 || (now - lastClickTime <= maxDelay)) {
            devClicks.push(position);
            if (devClicks.length === devSequence.length) {
                if (devClicks.join('') === devSequence.join('')) {
                    requestDeveloperPassword();
                }
                devClicks = [];
            }
        } else {
            devClicks = [position];
        }
        lastClickTime = now;
    }

    function requestDeveloperPassword() {
        let attempts = 3;
        while (attempts > 0) {
            const password = prompt('Введите пароль для режима разработчика:');
            if (password === secretKey) {
                devMode.classList.remove('hidden');
                return;
            } else {
                attempts--;
                if (attempts > 0) {
                    alert(`Неверный пароль. Осталось попыток: ${attempts}`);
                } else {
                    alert('Слишком много неверных попыток. Попробуйте позже.');
                }
            }
        }
    }

    function startAutoClicker() {
        if (autoClickerInterval) clearInterval(autoClickerInterval);
        autoClickerInterval = setInterval(function () {
            balance += clickValue;
            updateBalance();
            saveProgress();
            checkAchievements();
        }, 1000);
    }

    function checkAchievements() {
        const achievements = [
            { id: 'ach1000', text: 'Достигнуто 1000 гривен!', threshold: 1000 },
            { id: 'ach10000', text: 'Достигнуто 10000 гривен!', threshold: 10000 },
            { id: 'ach100000', text: 'Достигнуто 100000 гривен!', threshold: 100000 },
            // Добавьте остальные достижения по аналогии
        ];

        achievements.forEach(ach => {
            if (balance >= ach.threshold && !document.getElementById(ach.id)) {
                const achievement = document.createElement('li');
                achievement.innerText = ach.text;
                achievement.id = ach.id;
                achievementsList.appendChild(achievement);
            }
        });
    }

    function encrypt(value) {
        // Простой XOR шифр
        let result = '';
        for (let i = 0; i < value.length; i++) {
            result += String.fromCharCode(value.charCodeAt(i) ^ 13);
        }
        return result;
    }

    function decrypt(value) {
        // Простой XOR шифр (для дешифровки)
        let result = '';
        for (let i = 0; i < value.length; i++) {
            result += String.fromCharCode(value.charCodeAt(i) ^ 13);
        }
        return result;
    }
});
