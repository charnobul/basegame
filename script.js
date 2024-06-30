// script.js
document.addEventListener('DOMContentLoaded', () => {
    const nicknameInput = document.getElementById('nickname');
    const registerBtn = document.getElementById('register-btn');
    const usernameDisplay = document.getElementById('username');
    const registrationDiv = document.getElementById('registration');
    const gameDiv = document.getElementById('game');
    const clickCoinBtn = document.getElementById('click-coin');
    const coinCountDisplay = document.getElementById('coin-count');
    const upgradeClickBtn = document.getElementById('upgrade-click');
    const upgradeIncomeBtn = document.getElementById('upgrade-income');
    const transferBtn = document.getElementById('transfer-btn');
    const transferDiv = document.getElementById('transfer');
    const playerList = document.getElementById('player-list');
    const transferAmountInput = document.getElementById('transfer-amount');
    const transferConfirmBtn = document.getElementById('transfer-confirm-btn');

    let username = localStorage.getItem('username') || '';
    let coinCount = parseInt(localStorage.getItem('coinCount')) || 0;
    let clickValue = parseInt(localStorage.getItem('clickValue')) || 1;
    let incomeValue = parseInt(localStorage.getItem('incomeValue')) || 0;
    let upgradeClickCost = parseInt(localStorage.getItem('upgradeClickCost')) || 50;
    let upgradeIncomeCost = parseInt(localStorage.getItem('upgradeIncomeCost')) || 50;
    let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    let userCoins = JSON.parse(localStorage.getItem('userCoins')) || {};

    const saveState = () => {
        localStorage.setItem('username', username);
        localStorage.setItem('coinCount', coinCount);
        localStorage.setItem('clickValue', clickValue);
        localStorage.setItem('incomeValue', incomeValue);
        localStorage.setItem('upgradeClickCost', upgradeClickCost);
        localStorage.setItem('upgradeIncomeCost', upgradeIncomeCost);
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        localStorage.setItem('userCoins', JSON.stringify(userCoins));
    };

    const updatePlayerList = () => {
        playerList.innerHTML = '';
        registeredUsers.forEach(user => {
            if (user !== username) {
                const option = document.createElement('option');
                option.value = user;
                option.textContent = user;
                playerList.appendChild(option);
            }
        });
    };

    if (username) {
        usernameDisplay.textContent = username;
        registrationDiv.style.display = 'none';
        gameDiv.style.display = 'block';
        coinCountDisplay.textContent = coinCount;
        updatePlayerList();
    }

    registerBtn.addEventListener('click', () => {
        const newUsername = nicknameInput.value.trim();
        if (newUsername) {
            if (registeredUsers.includes(newUsername)) {
                alert('Этот ник уже используется. Пожалуйста, выберите другой.');
            } else {
                username = newUsername;
                registeredUsers.push(username);
                userCoins[username] = 0;
                usernameDisplay.textContent = username;
                registrationDiv.style.display = 'none';
                gameDiv.style.display = 'block';
                updatePlayerList();
                saveState();
            }
        } else {
            alert('Пожалуйста, введите никнейм.');
        }
    });

    clickCoinBtn.addEventListener('click', () => {
        coinCount += clickValue;
        coinCountDisplay.textContent = coinCount;
        userCoins[username] = coinCount;
        saveState();
    });

    upgradeClickBtn.addEventListener('click', () => {
        if (coinCount >= upgradeClickCost) {
            coinCount -= upgradeClickCost;
            clickValue++;
            upgradeClickCost = Math.floor(upgradeClickCost * 3);
            coinCountDisplay.textContent = coinCount;
            upgradeClickBtn.textContent = `Улучшение клика (${upgradeClickCost} монет)`;
            userCoins[username] = coinCount;
            saveState();
        } else {
            alert('Недостаточно монет для улучшения.');
        }
    });

    upgradeIncomeBtn.addEventListener('click', () => {
        if (coinCount >= upgradeIncomeCost) {
            coinCount -= upgradeIncomeCost;
            incomeValue++;
            upgradeIncomeCost = Math.floor(upgradeIncomeCost * 1.5);
            coinCountDisplay.textContent = coinCount;
            upgradeIncomeBtn.textContent = `Улучшение прибыли в секунду (${upgradeIncomeCost} монет)`;
            userCoins[username] = coinCount;
            saveState();
        } else {
            alert('Недостаточно монет для улучшения.');
        }
    });

    setInterval(() => {
        coinCount += incomeValue;
        coinCountDisplay.textContent = coinCount;
        userCoins[username] = coinCount;
        saveState();
    }, 1000);

    transferBtn.addEventListener('click', () => {
        transferDiv.style.display = 'block';
    });

    transferConfirmBtn.addEventListener('click', () => {
        const recipient = playerList.value;
        const transferAmount = parseInt(transferAmountInput.value);
        if (recipient && transferAmount > 0 && transferAmount <= coinCount) {
            coinCount -= transferAmount;
            userCoins[username] = coinCount;
            userCoins[recipient] = (userCoins[recipient] || 0) + transferAmount;
            coinCountDisplay.textContent = coinCount;
            alert(`Вы перевели ${transferAmount} монет игроку ${recipient}`);
            saveState();
        } else {
            alert('Недостаточно монет для перевода или неверная сумма.');
        }
        transferAmountInput.value = '';
    });
});
