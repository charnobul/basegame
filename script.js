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

    let balance = 0;

    if (localStorage.getItem('userPassword')) {
        login.classList.remove('hidden');
    } else {
        registration.classList.remove('hidden');
    }

    registrationForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const userPassword = document.getElementById('password').value;
        localStorage.setItem('userPassword', userPassword);
        localStorage.setItem('balance', '0');
        registration.classList.add('hidden');
        bank.classList.remove('hidden');
        updateBalance();
    });

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const userPassword = loginPassword.value;
        if (localStorage.getItem('userPassword') === userPassword) {
            balance = parseFloat(localStorage.getItem('balance'));
            login.classList.add('hidden');
            bank.classList.remove('hidden');
            updateBalance();
        } else {
            alert('Неверный пароль.');
        }
    });

    coin.addEventListener('click', function () {
        balance += 0.01;
        updateBalance();
        saveProgress();
    });

    upgradeClick.addEventListener('click', function () {
        if (balance >= 100) {
            balance -= 100;
            updateBalance();
            saveProgress();
            alert('Клик прокачан!');
        } else {
            alert('Недостаточно средств для прокачки.');
        }
    });

    buyAutoClicker.addEventListener('click', function () {
        if (balance >= 500) {
            balance -= 500;
            updateBalance();
            saveProgress();
            alert('Куплен автокликер!');
        } else {
            alert('Недостаточно средств для покупки автокликера.');
        }
    });

    function updateBalance() {
        balanceDisplay.innerText = balance.toFixed(2);
    }

    function saveProgress() {
        localStorage.setItem('balance', balance.toString());
    }
});
