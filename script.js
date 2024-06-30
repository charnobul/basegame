// script.js
document.addEventListener('DOMContentLoaded', () => {
    const nicknameInput = document.getElementById('nickname');
    const registerBtn = document.getElementById('register-btn');
    const playBtn = document.getElementById('play-btn');
    const usernameDisplay = document.getElementById('username');
    const registrationDiv = document.getElementById('registration');
    const gameDiv = document.getElementById('game');
    const clickCoinBtn = document.getElementById('click-coin');
    const coinCountDisplay = document.getElementById('coin-count');

    let username = '';
    let coinCount = 0;

    registerBtn.addEventListener('click', () => {
        username = nicknameInput.value.trim();
        if (username) {
            usernameDisplay.textContent = username;
            registrationDiv.style.display = 'none';
            gameDiv.style.display = 'block';
        } else {
            alert('Пожалуйста, введите никнейм.');
        }
    });

    playBtn.addEventListener('click', () => {
        alert('Игра началась!');
    });

    clickCoinBtn.addEventListener('click', () => {
        coinCount++;
        coinCountDisplay.textContent = coinCount;
    });
});
