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

    let balance = 0;
    let clickValue = 0.01;
    let upgradeCost = 100;
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
        saveBalance();
        handleDevClick(e);
    });

    upgradeClick.addEventListener('click', function () {
        if (balance >= upgradeCost) {
            balance -= upgradeCost;
            clickValue += 0.01;
            upgradeCost *= 1.5;
            upgradeClick.innerText = `Прокачать клик (+${clickValue.toFixed(2)} монет)`;
            updateBalance();
            saveBalance();
        } else {
            alert('Недостаточно средств для прокачки!');
        }
    });

    applyCode.addEventListener('click', function () {
        const code = decrypt(devCode.value.trim());
        if (code.startsWith('-')) {
            const amount = parseFloat(code.slice(1));
            if (!isNaN(amount)) {
                balance -= amount;
            }
        } else if (code.startsWith('=')) {
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
        saveBalance();
        devMode.classList.add('hidden');
    });

    function updateBalance() {
        balanceDisplay.innerText = balance.toFixed(2);
    }

    function saveBalance() {
        localStorage.setItem('balance', balance.toFixed(2));
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
