document.addEventListener('DOMContentLoaded', function () {
    const registrationForm = document.getElementById('registrationForm');
    const registration = document.getElementById('registration');
    const bank = document.getElementById('bank');
    const balanceDisplay = document.getElementById('balance');
    const coin = document.getElementById('coin');
    const upgradeClick = document.getElementById('upgradeClick');
    const devMode = document.getElementById('devMode');
    const devCode = document.getElementById('devCode');
    const applyCode = document.getElementById('applyCode');

    let balance = 0;
    let clickValue = 0.01;
    let upgradeCost = 100;

    registrationForm.addEventListener('submit', function (e) {
        e.preventDefault();
        registration.classList.add('hidden');
        bank.classList.remove('hidden');
    });

    coin.addEventListener('click', function () {
        balance += clickValue;
        updateBalance();
    });

    upgradeClick.addEventListener('click', function () {
        if (balance >= upgradeCost) {
            balance -= upgradeCost;
            clickValue += 0.01;
            upgradeCost *= 1.5;
            upgradeClick.innerText = `Прокачать клик (+${clickValue.toFixed(2)} монет)`;
            updateBalance();
        } else {
            alert('Недостаточно средств для прокачки!');
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === '2') {
            devMode.classList.toggle('hidden');
        }
    });

    applyCode.addEventListener('click', function () {
        const code = devCode.value.trim();
        if (code.startsWith('-')) {
            const amount = parseFloat(code.slice(1));
            if (!isNaN(amount)) {
                balance -= amount;
            }
        } else if (code.startsWith('=')) {
            const letters = code.slice(1).split('');
            letters.forEach(letter => {
                switch (letter) {
                    case 'h': balance += 1; break;
                    case 'k': balance += 2; break;
                    case 'r': balance += 3; break;
                    case 'v': balance += 4; break;
                    case 'p': balance += 5; break;
                    case 'z': balance += 6; break;
                    case 'e': balance += 7; break;
                    case 's': balance += 8; break;
                    case 'j': balance += 9; break;
                    case 'm': balance += 0; break;
                }
            });
        }
        updateBalance();
        devMode.classList.add('hidden');
    });

    function updateBalance() {
        balanceDisplay.innerText = balance.toFixed(2);
    }
});
