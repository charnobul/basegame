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
    const payTaxes = document.getElementById('payTaxes');
    const achievementsDiv = document.getElementById('achievements');

    let balance = 0;
    let clickValue = 0.01;
    let upgradeCost = 100;
    let autoClickerCost = 500;
    let taxesDue = 400;
    let loginAttempts = 0;
    let achievements = [];

    const secretKey = 'ponchik098';

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
        const userPassword = document.getElementById('loginPassword').value;

        if (decrypt(localStorage.getItem('userPassword')) === userPassword) {
            balance = parseFloat(localStorage.getItem('balance'));
            clickValue = parseFloat(localStorage.getItem('clickValue')) || 0.01;
            upgradeCost = parseFloat(localStorage.getItem('upgradeCost')) || 100;
            autoClickerCost = parseFloat(localStorage.getItem('autoClickerCost')) || 500;
            taxesDue = parseFloat(localStorage.getItem('taxesDue')) || 400;
            achievements = JSON.parse(localStorage.getItem('achievements')) || [];

            login.classList.add('hidden');
            bank.classList.remove('hidden');
            updateBalance();
            updateAchievements();
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

    coin.addEventListener('click', function () {
        balance += clickValue;
        updateBalance();
        saveProgress();
        checkAchievements();
    });

    upgradeClick.addEventListener('click', function () {
        if (balance >= upgradeCost) {
            balance -= upgradeCost;
            clickValue += 0.01;
            upgradeCost *= 1.5;
            upgradeClick.innerText = `Прокачать клик (+${clickValue.toFixed(2)} монет)`;
            updateBalance();
            saveProgress();
        } else {
            alert('Недостаточно средств для прокачки!');
        }
    });

    buyAutoClicker.addEventListener('click', function () {
        if (balance >= autoClickerCost) {
            balance -= autoClickerCost;
            setInterval(() => {
                balance += clickValue;
                updateBalance();
                saveProgress();
                checkAchievements();
            }, 1000);
            autoClickerCost *= 2;
            buyAutoClicker.innerText = `Купить автокликер (${autoClickerCost.toFixed(2)} гривен)`;
            updateBalance();
            saveProgress();
        } else {
            alert('Недостаточно средств для покупки автокликера!');
        }
    });

    payTaxes.addEventListener('click', function () {
        if (balance >= taxesDue) {
            balance -= taxesDue;
            updateBalance();
            saveProgress();
            alert('Налоги оплачены!');
        } else {
            alert('Недостаточно средств для оплаты налогов!');
        }
    });

    function updateBalance() {
        balanceDisplay.innerText = balance.toFixed(2);
    }

    function saveProgress() {
        localStorage.setItem('balance', balance.toFixed(2));
        localStorage.setItem('clickValue', clickValue.toFixed(2));
        localStorage.setItem('upgradeCost', upgradeCost.toFixed(2));
        localStorage.setItem('autoClickerCost', autoClickerCost.toFixed(2));
        localStorage.setItem('taxesDue', taxesDue.toFixed(2));
        localStorage.setItem('achievements', JSON.stringify(achievements));
    }

    function updateLoginAttempts() {
        loginAttempts = parseInt(localStorage.getItem('loginAttempts')) || 0;
        document.getElementById('loginAttempts').innerText = `Осталось попыток: ${5 - loginAttempts}`;
    }

    function encrypt(value) {
        let result = '';
        for (let i = 0; i < value.length; i++) {
            result += String.fromCharCode(value.charCodeAt(i ^ secretKey.charCodeAt(i % secretKey.length));
        }
        return result;
    }

    function decrypt(value) {
        return encrypt(value); // Simple XOR encryption is symmetric
    }

    function checkAchievements() {
        if (balance >= 100 && !achievements.includes('100 гривен')) {
            achievements.push('100 гривен');
            addAchievement('Достигнуто 100 гривен!');
        }
        if (balance >= 500 && !achievements.includes('500 гривен')) {
            achievements.push('500 гривен');
            addAchievement('Достигнуто 500 гривен!');
        }
        // Add more achievements as needed
    }

    function addAchievement(text) {
        const achievementDiv = document.createElement('div');
        achievementDiv.className = 'achievement';
        achievementDiv.innerText = text;
        achievementsDiv.appendChild(achievementDiv);
        alert(`Новое достижение: ${text}`);
    }

    function updateAchievements() {
        achievementsDiv.innerHTML = '';
        achievements.forEach((achievement) => {
            const achievementDiv = document.createElement('div');
            achievementDiv.className = 'achievement';
            achievementDiv.innerText = achievement;
            achievementsDiv.appendChild(achievementDiv);
        });
    }
});
