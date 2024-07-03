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
    const themeToggle = document.getElementById('toggleTheme');
    const notification = document.getElementById('notification');
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
        showNotification("Вы заработали " + clickValue.toFixed(2) + " гривен!");
    });

    upgradeClick.addEventListener('click', function () {
        requestPassword(() => {
            if (balance >= upgradeCost) {
                balance -= upgradeCost;
                clickValue += 0.01;
                total```javascript
                totalUpgrades++;
                upgradeCost = Math.round(upgradeCost * 1.1);
                updateBalance();
                updateUpgradeCost();
                saveProgress();
                showNotification("Клик прокачан! Теперь вы зарабатываете " + clickValue.toFixed(2) + " гривен за клик.");
            } else {
                alert('Недостаточно средств для прокачки.');
            }
        });
    });

    buyAutoClicker.addEventListener('click', function () {
        requestPassword(() => {
            if (balance >= autoClickerCost) {
                balance -= autoClickerCost;
                totalAutoClickers++;
                autoClickerCost = Math.round(autoClickerCost * 1.15);
                updateBalance();
                updateAutoClickerCost();
                startAutoClicker();
                saveProgress();
                showNotification("Куплен автокликер! Теперь у вас " + totalAutoClickers + " автокликеров.");
            } else {
                alert('Недостаточно средств для покупки автокликера.');
            }
        });
    });

    applyCode.addEventListener('click', function () {
        if (devCode.value === secretKey) {
            balance += 1000000;
            updateBalance();
            saveProgress();
            showNotification("Вы получили 1,000,000 гривен!");
        } else {
            alert('Неверный код.');
        }
    });

    themeToggle.addEventListener('click', function () {
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    });

    payTaxes.addEventListener('click', function () {
        requestPassword(() => {
            if (balance >= dailyTax) {
                balance -= dailyTax;
                lastTaxPaid = Date.now();
                updateBalance();
                saveProgress();
                checkTaxStatus();
                showNotification("Налог оплачен!");
            } else {
                alert('Недостаточно средств для оплаты налога.');
            }
        });
    });

    function updateBalance() {
        balanceDisplay.innerText = balance.toFixed(2);
    }

    function updateUpgradeCost() {
        upgradeClick.innerText = `Прокачать клик (${upgradeCost} гривен)`;
    }

    function updateAutoClickerCost() {
        buyAutoClicker.innerText = `Купить автокликер (${autoClickerCost} гривен)`;
    }

    function startAutoClicker() {
        clearInterval(autoClickerInterval);
        autoClickerInterval = setInterval(function () {
            balance += totalAutoClickers * clickValue;
            updateBalance();
            saveProgress();
        }, 1000);
    }

    function checkTaxStatus() {
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        const timeSinceLastTax = now - lastTaxPaid;
        if (timeSinceLastTax >= oneDay) {
            taxInfo.innerText = 'Налог необходимо оплатить!';
            payTaxes.style.backgroundColor = 'green';
            payTaxes.disabled = false;
        } else {
            const remainingTime = oneDay - timeSinceLastTax;
            const hours = Math.floor(remainingTime / (60 * 60 * 1000));
            const minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
            taxInfo.innerText = `Налог оплачен. Следующий платеж через ${hours} ч ${minutes} м.`;
            payTaxes.style.backgroundColor = 'gray';
            payTaxes.disabled = true;
        }
    }

    function handleDevClick(e) {
        const now = Date.now();
        if (now - lastClickTime > maxDelay) {
            devClicks = [];
        }
        lastClickTime = now;

        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const quadrant = getQuadrant(x, y, rect.width, rect.height);

        devClicks.push(quadrant);
        if (devClicks.length > devSequence.length) {
            devClicks.shift();
        }

        if (devClicks.join('') === devSequence.join('')) {
            devMode.classList.remove('hidden');
        }
    }

    function getQuadrant(x, y, width, height) {
        if (x < width / 2 && y < height / 2) return 'top-left';
        if (x >= width / 2 && y < height / 2) return 'top-right';
        if (x < width / 2 && y >= height / 2) return 'bottom-left';
        if (x >= width / 2 && y >= height / 2) return 'bottom-right';
    }

    function requestPassword(callback) {
        const password = prompt('Введите пароль для подтверждения:');
        if (decrypt(localStorage.getItem('userPassword')) === password) {
            callback();
        } else {
            alert('Неверный пароль.');
        }
    }

    function checkAchievements() {
        const achievements = [
            { threshold: 100, message: 'Заработано 100 гривен!' },
            { threshold: 500, message: 'Заработано 500 гривен!' },
            { threshold: 1000, message: 'Заработано 1000 гривен!' },
            // Добавьте больше достижений по мере необходимости
        ];

        achievements.forEach(achievement => {
            if (balance >= achievement.threshold) {
                const existingAchievement = document.querySelector(`#achievement-${achievement.threshold}`);
                if (!existingAchievement) {
                    const li = document.createElement('li');
                    li.id = `achievement-${achievement.threshold}`;
                    li.innerText = achievement.message;
                    achievementsList.appendChild(li);
                    showNotification(achievement.message);
                }
            }
        });
    }

    function showNotification(message) {
        notification.innerText = message;
        notification.classList.add('visible');
        setTimeout(() => {
            notification.classList.remove('visible');
        }, 3000);
    }

    function encrypt(text) {
        return btoa(text);
    }

    function decrypt(text) {
        return atob(text);
    }

    function saveProgress() {
        localStorage.setItem('balance', balance.toString());
        localStorage.setItem('clickValue', clickValue.toString());
        localStorage.setItem('totalUpgrades', totalUpgrades.toString());
        localStorage.setItem('totalAutoClickers', totalAutoClickers.toString());
        localStorage.setItem('lastTaxPaid', lastTaxPaid.toString());
    }

    function loadProgress() {
        balance = parseFloat(localStorage.getItem('balance')) || 0;
        clickValue = parseFloat(localStorage.getItem('clickValue')) || 0.01;
        totalUpgrades = parseInt(localStorage.getItem('totalUpgrades')) || 0;
        totalAutoClickers = parseInt(localStorage.getItem('totalAutoClickers')) || 0;
        lastTaxPaid = parseInt(localStorage.getItem('lastTaxPaid')) || 0;
        updateBalance();
        updateUpgradeCost();
        updateAutoClickerCost();
        startAutoClicker();
    }

    function updateLoginAttempts() {
        loginAttempts = parseInt(localStorage.getItem('loginAttempts')) || 0;
        loginAttemptsDisplay.innerText = `Попыток входа: ${loginAttempts}`;
    }
});
