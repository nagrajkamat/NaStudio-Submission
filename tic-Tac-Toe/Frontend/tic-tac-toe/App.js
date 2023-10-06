import React, { useState } from "react";
import "./App.css";

// Defining the calculateWinner function
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

function App() {
  const [board, setBoard] = useState(Array(9).fill(null)); // Initialize an empty board
  const [xIsNext, setXIsNext] = useState(true);

  // Defining the makeMove function
  function makeMove(index) {
    const squares = [...board];

    if (squares[index] || calculateWinner(squares)) {
      return;
    }

    squares[index] = xIsNext ? "X" : "O";
    setBoard(squares);
    setXIsNext(!xIsNext);
  }

  const renderSquare = (index) => (
    <button className="square" onClick={() => makeMove(index)}>
      {board[index]}
    </button>
  );

  const winner = calculateWinner(board);
  const status = winner
    ? `Winner: ${winner}`
    : `Next player: ${xIsNext ? "X" : "O"}`;

  return (
    <div className="game">
      <div className="game-board">
        <div className="status">{status}</div>
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </div>
    </div>
  );
}

export default App;

// INTEGRATING THE FRONTEND - DATABASE

import firebase from "firebase/app";
import "firebase/auth";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBZbNy1P3PBR9vZmUhzuYGquNVZ3Ig6C3I",
  authDomain: "advance-medium-323606.firebaseapp.com",
  projectId: "advance-medium-323606",
  storageBucket: "advance-medium-323606.appspot.com",
  messagingSenderId: "169378909130",
  appId: "1:169378909130:web:5931b22ecb8ec89c345d33",
  measurementId: "G-7RYSF15RR2",
};

// Initializing Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
firebase.initializeApp(firebaseConfig);
