document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('minesweeper');
    const passwordInput = document.getElementById('password');
    const eraseButton = document.getElementById('eraseButton');
    const resetButton = document.getElementById('resetButton');
    const rows = 8;
    const cols = 8;
    const totalCells = rows * cols;
    const chars = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const bombImageSrc = 'https://nickarocho.github.io/minesweeper/images/bomb.png'; // Replace with the actual path to your bomb image
    let cells = [];
    let password = '';
    const bombChance = 0.2;

    function initializeGrid() {
        grid.innerHTML = '';
        cells = [];
        password = '';
        passwordInput.value = '';

        // Shuffle the characters array
        let shuffledChars = chars.split('').sort(() => 0.5 - Math.random());

        // Ensure we have enough characters to fill the grid
        while (shuffledChars.length < totalCells * (1 - bombChance)) {
            shuffledChars = shuffledChars.concat(chars.split('')).sort(() => 0.5 - Math.random());
        }

        // Initialize the Minesweeper grid with shuffled characters
        for (let row = 0; row < rows; row++) {
            cells[row] = [];
            for (let col = 0; col < cols; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;

                // Randomly assign some cells to be bombs
                if (Math.random() < bombChance) {
                    cell.dataset.bomb = true;
                } else {
                    cell.dataset.char = shuffledChars.pop();
                }

                cell.addEventListener('click', handleCellClick);
                grid.appendChild(cell);
                cells[row][col] = cell;
            }
        }
    }

    function handleCellClick(event) {
        const cell = event.target;
        if (cell.dataset.bomb) {
            const bombImage = document.createElement('img');
            bombImage.src = bombImageSrc;
            bombImage.classList.add('bomb');
            cell.appendChild(bombImage);
            password += 'B';
            setTimeout(initializeGrid, 1000); // Reset the game after 1 second
        } else {
            const char = cell.dataset.char;
            cell.textContent = char;
            password += char;
        }

        cell.classList.add('revealed');
        cell.removeEventListener('click', handleCellClick);
        passwordInput.value = password;
    }

    function handleEraseClick() {
        if (password.length > 0) {
            password = password.slice(0, -1);
            passwordInput.value = password;
        }
    }

    resetButton.addEventListener('click', initializeGrid);
    eraseButton.addEventListener('click', handleEraseClick);

    initializeGrid();
});