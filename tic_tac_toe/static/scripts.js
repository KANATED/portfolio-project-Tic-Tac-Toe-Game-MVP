document.getElementById('human-vs-human').addEventListener('click', () => {
    startGame('human');
});

document.getElementById('human-vs-ai').addEventListener('click', () => {
    startGame('AI');
});

let board = Array(9).fill(' ');
let currentPlayer = 'X';
let gameMode = '';

const startGame = (mode) => {
    gameMode = mode;
    currentPlayer = 'X';
    board = Array(9).fill(' ');
    renderBoard();
};

const renderBoard = () => {
    let boardHTML = '';
    for (let i = 0; i < 9; i++) {
        boardHTML += `<div class="square" onclick="makeMove(${i})">${board[i]}</div>`;
    }
    document.getElementById('board').innerHTML = boardHTML;
};

const makeMove = (index) => {
    if (board[index] === ' ') {
        board[index] = currentPlayer;
        renderBoard();

        // Send move to the server
        sendMove(index, currentPlayer).then(response => {
            if (response.status === 'continue') {
                if (gameMode === 'AI' && currentPlayer === 'X') {
                    currentPlayer = 'O';
                    makeAIMove();
                } else {
                    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                }
            } else if (response.status === 'invalid') {
                alert('Invalid move! Try again.');
            } else if (response.winner) {
                alert(`${response.winner} wins!`);
            }
        });
    } else {
        alert('Invalid move! Square already taken.');
    }
};

const sendMove = async (index, player) => {
    const response = await fetch('/move', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ move: index, player: player }),
    });
    return response.json();
};

const makeAIMove = () => {
    // Send the board state to the server to get AI move
    fetch('/ai_move', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ board: board }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.move !== undefined) {
            board[data.move] = 'O';
            renderBoard();

            if (data.winner) {
                alert('AI wins!');
            } else {
                currentPlayer = 'X';
            }
        }
    });
};
