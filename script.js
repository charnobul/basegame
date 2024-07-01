document.addEventListener('DOMContentLoaded', function () {
    const registrationForm = document.getElementById('registrationForm');
    const loginForm = document.getElementById('loginForm');
    const registration = document.getElementById('registration');
    const login = document.getElementById('login');
    const bank = document.getElementById('bank');
    const balanceDisplay = document.getElementById('balance');
    const coin = document.getElementById('coin');
    const upgradeClick = document.getElementById('upgradeClick');
    const devMode = document.getElementById('devMode');
    const devCode = document.getElementById('devCode');
    const applyCode = document.getElementById('applyCode');
    const loginPassword = document.getElementById('loginPassword');
    const loginAttemptsDisplay = document.getElementById('loginAttempts');
    const clickUpgradeCostDisplay = document.getElementById('clickUpgradeCost');
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const changePasswordPassword = document.getElementById('changePasswordPassword');
    const applyNewPasswordBtn = document.getElementById('applyNewPassword');
    const newPassword = document.getElementById('newPassword');

    let balance = 0;
    let clickValue = 0.01;
    let upgradeCost = 100;
    let clickUpgrades = 0;
    let loginAttempts = 5; // Начальное количество попыток входа

    let devClicks = [];
    const devSequence = ['top-left', 'top-right', 'top-left', 'top-left', 'bottom-right'];
    const maxDelay = 3000; // 3 seconds
    let lastClickTime = 0;

    const secretKey = 'ponchik098';

    // Проверка существующих данных
    if (localStorage.getItem('userPassword')) {
        login.classList.remove('hidden');
        loginAttempts = parseInt(localStorage.getItem('loginAttempts')) || 5;
        updateLoginAttempts();
    } else {
        registration.classList.remove('hidden');
    }

    registrationForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const userName = document.getElementById('name').value;
        const userPassword = document.getElementById('password').value;

        localStorage.setItem('userName', userName);
        localStorage.setItem('userPassword', encrypt(userPassword));
        localStorage.setItem('balance', '0');
        localStorage.setItem('clickUpgrades', '0');
        localStorage.setItem('loginAttempts', '5');

        registration.classList.add('hidden');
        bank.classList.remove('hidden');
        updateBalance();
    });

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const userPassword = loginPassword.value;

        if (decrypt(localStorage.getItem('userPassword')) === userPassword) {
            loginAttempts = 5; // Сбросить счетчик попыток при успешном входе
            localStorage.setItem('loginAttempts', '5');
            balance = parseFloat(localStorage.getItem('balance'));
            clickUpgrades = parseInt(localStorage.getItem('clickUpgrades')) || 0;
            upgradeCost = calculateUpgradeCost();
            bank.classList.remove('hidden');
            login.classList.add('hidden');
            updateClickUpgradeCost();
            updateBalance();
        } else {
            loginAttempts--;
            localStorage.setItem('loginAttempts', loginAttempts.toString());
            updateLoginAttempts();
            if (loginAttempts <= 0) {
                localStorage.clear();
                alert('Слишком много неверных попыток. Данные сброшены.');
                location.reload();
            }
        }
    });

    coin.addEventListener('click', function (e) {
        balance += clickValue;
        updateBalance();
        saveBalance();
        handleDevClick(e);
    });

    upgradeClick.addEventListener('click', function () {
        if (balance >= upgradeCost) {
            balance -= upgradeCost;
            clickValue += 0.01;
            clickUpgrades++;
            upgradeCost = calculateUpgradeCost();
            upgradeClick.innerText = `Прокачать клик (+${clickValue.toFixed(2)} гривны)`;
            updateClickUpgradeCost();
            updateBalance();
            saveBalance();
        } else {
            alert('Недостаточно средств для прокачки!');
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
                    default: break;
                }
            });
            const amount = parseFloat(number);
            if (!isNaN(amount)) {
                balance += amount;
            }
        }
        devCode.value = '';
        updateBalance();
        saveBalance();
    });

    changePasswordBtn.addEventListener('click', function () {
        changePasswordForm.classList.toggle('hidden');
    });

    applyNewPasswordBtn.addEventListener('click', function () {
        const oldPassword = changePasswordPassword.value.trim();
        const newPasswordValue = newPassword.value.trim();
        if (decrypt(localStorage.getItem('userPassword')) === oldPassword) {
            localStorage.setItem('userPassword', encrypt(newPasswordValue));
            alert('Пароль успешно изменен!');
            changePasswordPassword.value = '';
            newPassword.value = '';
        } else {
            alert('Неверный пароль!');
        }
    });

    function encrypt(value) {
        // Простая шифровка для демонстрационных целей
        return btoa(value);
    }

    function decrypt(value) {
        // Расшифровка для демонстрационных целей
        return atob(value);
    }

    function updateBalance() {
        balanceDisplay.innerText = balance.toFixed(2);
    }

    function saveBalance() {
        localStorage.setItem('balance', balance.toFixed(2));
        localStorage.setItem('clickUpgrades', clickUpgrades.toString());
    }

    function calculateUpgradeCost() {
        return 100 * Math.pow(1.5, clickUpgrades);
    }

    function updateClickUpgradeCost() {
        clickUpgradeCostDisplay.innerText = `Стоимость прокачки клика: ${upgradeCost.toFixed(2)} гривны`;
    }

    function updateLoginAttempts() {
        loginAttemptsDisplay.innerText = `Осталось попыток: ${loginAttempts}`;
    }

    function handleDevClick(event) {
        const currentTime = new Date().getTime();
        if (currentTime - lastClickTime <= maxDelay) {
            devClicks.push(event.target.id);
            if (devClicks.length === devSequence.length) {
                const validSequence = devClicks.every((click, index) => click === devSequence[index]);
                if (validSequence) {
                    devMode.classList.remove('hidden');
                }
                devClicks = [];
            }
        } else {
            devClicks = [];
        }
        lastClickTime = currentTime;
    }
});
