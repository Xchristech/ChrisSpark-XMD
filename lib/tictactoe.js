// lib/tictactoe.js
const tttGames = {}; // { [chatId]: gameState }

const WIN_COMBOS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function renderBoard(board) {
  const symbols = { X: '❌', O: '⭕', null: '⬜' };
  let out = '';
  for (let i = 0; i < 9; i++) {
    out += symbols[board[i]];
    if ((i+1)%3===0) out += '\n';
  }
  return out;
}

function checkWin(board) {
  for (const [a, b, c] of WIN_COMBOS) {
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function isDraw(board) {
  return board.every(cell => cell !== null);
}

module.exports = {
  tttGames,
  renderBoard,
  checkWin,
  isDraw
};
