// script.js

// Фиктивные данные для примера
let currentUser = {
  username: 'user1',
  coins: 100,
};

// Функция для обновления информации о текущем пользователе на странице
function updateUserInfo() {
  document.getElementById('username').textContent = currentUser.username;
  document.getElementById('coins').textContent = currentUser.coins;
}

// Функция для клика по монетке (увеличение монет)
function clickCoin() {
  currentUser.coins += currentUser.clickValue;
  updateUserInfo();
}

// Функция для перевода монет другому игроку
function transferCoins() {
  const recipient = document.getElementById('recipient').value;
  const amount = parseInt(document.getElementById('amount').value);

  // Здесь должна быть логика для отправки запроса на сервер для выполнения перевода
  console.log(`Перевод ${amount} монет игроку ${recipient}`);
}

// Функция для загрузки топа игроков
async function loadTopPlayers() {
  try {
    const response = await fetch('/topPlayers'); // Замените на свой маршрут сервера
    if (!response.ok) {
      throw new Error('Ошибка загрузки топа игроков');
    }
    const topPlayers = await response.json();
    const topList = document.getElementById('top-list');
    topList.innerHTML = '';
    topPlayers.forEach(player => {
      const listItem = document.createElement('li');
      listItem.textContent = `${player.username} - ${player.coins} монет`;
      topList.appendChild(listItem);
    });
  } catch (error) {
    console.error('Ошибка загрузки топа игроков:', error.message);
  }
}

// Загрузка топа игроков при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  updateUserInfo();
  loadTopPlayers();
});
