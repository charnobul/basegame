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
    const scrollUp = document.getElementById('scrollUp');
    const scrollDown = document.getElementById('scrollDown');
    const taxes = document.getElementById('taxes');
    const taxInfo = document.getElementById('taxInfo');
    const payTaxes = document.getElementById('payTaxes');

    let balance = 0;
    let clickValue = 0.01;
    let upgradeCost = 100;
    let autoClickerCost = 500;
    let autoClickerInterval;
    let loginAttempts = 0;
    let totalUpgrades = 0;
    let totalAutoClickers = 0;

    let devClicks = [];
    const devSequence = ['top-left', 'top-right', 'top-left', 'top-left', 'bottom-right'];
    const maxDelay = 3000; // 3 seconds
    let lastClickTime = 0;

    const secretKey = 'ponchik098';
    const dailyTax = 400;
    let lastTaxPaid = 0;

    // Проверка существующих данных
    if (localStorage.getItem('userPassword')) {
        login.classList.remove('hidden');
        updateLoginAttempts();
        loadProgress();
        checkTaxStatus();
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
        localStorage.setItem('totalUpgrades', '0');
        localStorage.setItem('totalAutoClickers', '0');
        localStorage.setItem('lastTaxPaid', '0');

        registration.classList.add('hidden');
        bank.classList.remove('hidden');
        updateBalance();
        checkTaxStatus();
    });

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const userPassword = loginPassword.value;

        if (decrypt(localStorage.getItem('userPassword')) === userPassword) {
            balance = parseFloat(localStorage.getItem('balance'));
            clickValue = parseFloat(localStorage.getItem('clickValue'));
            totalUpgrades = parseInt(localStorage.getItem('totalUpgrades')) || 0;
            totalAutoClickers = parseInt(localStorage.getItem('totalAutoClickers')) || 0;
            lastTaxPaid = parseInt(localStorage.getItem('lastTaxPaid')) || 0;
            bank.classList.remove('hidden');
            login.classList.add('hidden');
            updateBalance();
            checkTaxStatus();
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
        requestPassword(() => {
            if (balance >= upgradeCost) {
                balance -= upgradeCost;
                clickValue += 0.01;
                totalUpgrades++;
                upgradeCost *= 1.5;
                upgradeClick.innerText = `Прокачать клик (${upgradeCost.toFixed(2)} гривен)`;
                updateBalance();
                saveProgress();
            } else {
                alert('Недостаточно средств для прокачки!');
            }
        });
    });

    buyAutoClicker.addEventListener('click', function () {
        requestPassword(() => {
            if (balance >= autoClickerCost) {
                balance -= autoClickerCost;
                totalAutoClickers++;
                startAutoClicker();
                autoClickerCost *= 2;
                buyAutoClicker.innerText = `Купить автокликер (${autoClickerCost.toFixed(2)} гривен)`;
                updateBalance();
                saveProgress();
            } else {
                alert('Недостаточно средств для покупки автокликера!');
            }
        });
    });

    applyCode.addEventListener('click', function () {
        const code = devCode.value.trim();
        if (code.startsWith('-')) {
            const amount = parseFloat(code.slice(1));
            if (!isNaN(amount)) {
                balance -= amount;
            } else {
                alert('Неверный код. Пожалуйста, введите правильный код.');
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
                    case 'j': number += '5'; break;
                    case 'e': number += '6'; break;
                    case 'n': number += '7'; break;
                    case 'q': number += '8'; break;
                    case 'd': number += '9'; break;
                    case 'y': number += '0'; break;
                    default: break;
                }
            });
            const amount = parseFloat(number);
            if (!isNaN(amount)) {
                balance += amount;
            } else {
                alert('Неверный код. Пожалуйста, введите правильный код.');
            }
        } else {
            alert('Неверный код. Пожалуйста, введите правильный код.');
        }
        updateBalance();
        saveProgress();
        devCode.value = '';
    });

    themeToggle.addEventListener('click', function () {
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    });

    scrollUp.addEventListener('click', function () {
        window.scrollBy(0, -100);
    });

    scrollDown.addEventListener('click', function () {
        window.scrollBy(0, 100);
    });

    payTaxes.addEventListener('click', function () {
        requestPassword(() => {
            if (balance >= dailyTax) {
                balance -= dailyTax;
                lastTaxPaid = Date.now();
                localStorage.setItem('lastTaxPaid', lastTaxPaid);
                updateBalance();
                checkTaxStatus();
                saveProgress();
            } else {
                alert('Недостаточно средств для оплаты налогов!');
            }
        });
    });

    function startAutoClicker() {
        if (autoClickerInterval) clearInterval(autoClickerInterval);
        autoClickerInterval = setInterval(() => {
            balance += clickValue * totalAutoClickers;
            updateBalance();
            saveProgress();
        }, 1000);
    }

    function updateBalance() {
        balanceDisplay.innerText = balance.toFixed(2);
    }

    function saveProgress() {
        localStorage.setItem('balance', balance.toFixed(2));
        localStorage.setItem('clickValue', clickValue);
        localStorage.setItem('totalUpgrades', totalUpgrades);
        localStorage.setItem('totalAutoClickers', totalAutoClickers);
    }

    function loadProgress() {
        balance = parseFloat(localStorage.getItem('balance')) || 0;
        clickValue = parseFloat(localStorage.getItem('clickValue')) || 0.01;
        totalUpgrades = parseInt(localStorage.getItem('totalUpgrades')) || 0;
        totalAutoClickers = parseInt(localStorage.getItem('totalAutoClickers')) || 0;
        upgradeCost = 100 * Math.pow(1.5, totalUpgrades);
        autoClickerCost = 500 * Math.pow(2, totalAutoClickers);
        upgradeClick.innerText = `Прокачать клик (${upgradeCost.toFixed(2)} гривен)`;
        buyAutoClicker.innerText = `Купить автокликер (${autoClickerCost.toFixed(2)} гривен)`;
        updateBalance();
        startAutoClicker();
        checkAchievements();
    }

    function updateLoginAttempts() {
        loginAttempts = parseInt(localStorage.getItem('loginAttempts')) || 0;
        loginAttemptsDisplay.innerText = `Попытки входа: ${loginAttempts}`;
    }

    function checkTaxStatus() {
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        const daysPassed = Math.floor((now - lastTaxPaid) / oneDay);
        if (daysPassed >= 1) {
            payTaxes.disabled = false;
            payTaxes.style.backgroundColor = 'green';
        } else {
            payTaxes.disabled = true;
            payTaxes.style.backgroundColor = 'gray';
        }
    }

    function requestPassword(callback) {
        const password = prompt('Введите пароль:');
        if (password && decrypt(localStorage.getItem('userPassword')) === password) {
            callback();
        } else {
            alert('Неверный пароль!');
        }
    }

    function checkAchievements() {
        const achievements = [
            { id: 1, text: 'Сделано 10 кликов', condition: balance >= 0.10 },
            { id: 2, text: 'Сделано 100 кликов', condition: balance >= 1.00 },
            { id: 3, text: 'Сделано 1,000 кликов', condition: balance >= 10.00 },
            { id: 4, text: 'Сделано 10,000 кликов', condition: balance >= 100.00 },
            { id: 5, text: 'Сделано 100,000 кликов', condition: balance >= 1000.00 },
            { id: 6, text: 'Сделано 1,000,000 кликов', condition: balance >= 10000.00 },
            { id: 7, text: 'Сделано 10,000,000 кликов', condition: balance >= 100000.00 },
            { id: 8, text: 'Сделано 100,000,000 кликов', condition: balance >= 1000000.00 },
            { id: 9, text: 'Сделано 1,000,000,000 кликов', condition: balance >= 10000000.00 },
            { id: 10, text: 'Сделано 10,000,000,000 кликов', condition: balance >= 100000000.00 },
            { id: 11, text: 'Куплен автокликер', condition: localStorage.getItem('autoClickerBought') === 'true' },
            { id: 12, text: 'Прокачан клик', condition: clickValue > 0.01 },
            { id: 13, text: 'Баланс достиг 100 гривен', condition: balance >= 100 },
            { id: 14, text: 'Баланс достиг 1,000 гривен', condition: balance >= 1000 },
            { id: 15, text: 'Баланс достиг 10,000 гривен', condition: balance >= 10000 },
            { id: 16, text: 'Баланс достиг 100,000 гривен', condition: balance >= 100000 },
            { id: 17, text: 'Баланс достиг 1,000,000 гривен', condition: balance >= 1000000 },
            { id: 18, text: 'Баланс достиг 10,000,000 гривен', condition: balance >= 10000000 },
            { id: 19, text: 'Баланс достиг 100,000,000 гривен', condition: balance >= 100000000 },
            { id: 20, text: 'Баланс достиг 1,000,000,000 гривен', condition: balance >= 1000000000 }
        ];

        achievements.forEach(ach => {
            if (ach.condition && !document.getElementById(`achievement-${ach.id}`)) {
                const achievement = document.createElement('li');
                achievement.id = `achievement-${ach.id}`;
                achievement.innerText = ach.text;
                achievementsList.appendChild(achievement);
            }
        });
    }

    function handleDevClick(e) {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const now = Date.now();

        if (devClicks.length === 0 || now - lastClickTime > maxDelay) {
            devClicks = [];
        }
        lastClickTime = now;

        const quadrant = (x < rect.width / 2 ? 'left' : 'right') + '-' + (y < rect.height / 2 ? 'top' : 'bottom');
        devClicks.push(quadrant);

        if (devClicks.length > devSequence.length) {
            devClicks.shift();
        }

        if (devClicks.join('-') === devSequence.join('-')) {
            devMode.classList.remove('hidden');
        }
    }

    function encrypt(value) {
        let result = '';
        for (let i = 0; i < value.length; i++) {
            result += String.fromCharCode(value.charCodeAt(i) ^ 13);
        }
        return result;
    }

    function decrypt(value) {
        let result = '';
        for (let i = 0; i < value.length; i++) {
            result += String.fromCharCode(value.charCodeAt(i) ^ 13);
        }
        return result;
    }
});
