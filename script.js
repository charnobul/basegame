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
                totalUpgrades++;
                upgradeCost *= 1.5;
                upgradeClick.innerText = `Прокачать клик (${upgradeCost.toFixed(2)} гривен)`;
                updateBalance();
                saveProgress();
                showNotification("Клик прокачан! Теперь вы зарабатываете " + clickValue.toFixed(2) + " гривен за клик.");
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
                showNotification("Автокликер куплен! Теперь у вас " + totalAutoClickers + " автокликеров.");
            } else {
                alert('Недостаточно средств для покупки автокликера!');
            }
        });
    });

    applyCode.addEventListener('click', function () {
        const code = devCode.value.trim();
        if (code.startsWith('+')) {
            const amount = parseFloat(code.slice(1).replace(/[^\d.]/g, ''));
            if (!isNaN(amount)) {
                balance += amount;
                showNotification("Введено " + amount.toFixed(2) + " гривен!");
                updateBalance();
                saveProgress();
            } else {
                alert('Неверный код. Пожалуйста, введите правильный код.');
            }
        }
    });

    payTaxes.addEventListener('click', function () {
        if (balance >= dailyTax) {
            balance -= dailyTax;
            lastTaxPaid = Date.now();
            payTaxes.style.backgroundColor = 'gray';
            payTaxes.disabled = true;
            updateBalance();
            saveProgress();
            showNotification("Налог оплачен!");
        } else {
            alert('Недостаточно средств для оплаты налога!');
        }
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
        checkTaxStatus();
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
        upgradeCost = 100 * Math.pow(1.5, totalUpgrades);
        autoClickerCost = 500 * Math.pow(2, totalAutoClickers);
        upgradeClick.innerText = `Прокачать клик (${upgradeCost.toFixed(2)} гривен)`;
        buyAutoClicker.innerText = `Купить автокликер (${autoClickerCost.toFixed(2)} гривен)`;
        updateBalance();
        if (totalAutoClickers > 0) {
            startAutoClicker();
        }
    }

    function encrypt(text) {
        return btoa(text);
    }

    function decrypt(text) {
        return atob(text);
    }

    function updateLoginAttempts() {
        loginAttemptsDisplay.innerText = `Попытки входа: ${loginAttempts}`;
    }

    function startAutoClicker() {
        if (autoClickerInterval) clearInterval(autoClickerInterval);
        autoClickerInterval = setInterval(() => {
            balance += totalAutoClickers * clickValue;
            updateBalance();
            saveProgress();
        }, 1000);
    }

    function checkTaxStatus() {
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        if (now - lastTaxPaid >= oneDay) {
            taxInfo.innerText = 'Ежедневный налог: 400 гривен';
            payTaxes.style.backgroundColor = 'green';
            payTaxes.disabled = false;
        } else {
            taxInfo.innerText = 'Налог уже оплачен за сегодня';
            payTaxes.style.backgroundColor = 'gray';
            payTaxes.disabled = true;
        }
    }

    function checkAchievements() {
        achievementsList.innerHTML = '';
        if (balance >= 1000) {
            addAchievement('Миллионер', 'Накопите 1000 гривен');
        }
        if (totalUpgrades >= 10) {
            addAchievement('Прокачка', 'Прокачайте клик 10 раз');
        }
        if (totalAutoClickers >= 5) {
            addAchievement('Автокликер', 'Купите 5 автокликеров');
        }
    }

    function addAchievement(title, description) {
        const achievement = document.createElement('div');
        achievement.classList.add('achievement');
        achievement.innerHTML = `<strong>${title}</strong>: ${description}`;
        achievementsList.appendChild(achievement);
    }

    function showNotification(message) {
        notification.innerText = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    function requestPassword(callback) {
        const password = prompt('Введите пароль для подтверждения действия:');
        if (password && decrypt(localStorage.getItem('userPassword')) === password) {
            callback();
        } else {
            alert('Неверный пароль!');
        }
    }

    function handleDevClick(e) {
        const clickTime = Date.now();
        if (clickTime - lastClickTime > maxDelay) {
            devClicks = [];
        }
        lastClickTime = clickTime;

        const rect = e.target.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        if (clickX < rect.width / 2 && clickY < rect.height / 2) {
            devClicks.push('top-left');
        } else if (clickX >= rect.width / 2 && clickY < rect.height / 2) {
            devClicks.push('top-right');
        } else if (clickX < rect.width / 2 && clickY >= rect.height / 2) {
            devClicks.push('bottom-left');
        } else {
            devClicks.push('bottom-right');
        }

        if (devClicks.length > devSequence.length) {
            devClicks.shift();
        }

        if (devClicks.join() === devSequence.join()) {
            devMode.classList.remove('hidden');
        }
    }

    loadProgress();
});
