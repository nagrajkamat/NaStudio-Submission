const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000; 

app.use(cors());
app.use(bodyParser.json());

// Initialize game state
let gameState = {
  board: Array(9).fill(null),
  currentPlayer: "X",
};

// Function to check for a win
function checkWin() {
  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];

  for (const condition of winConditions) {
    const [a, b, c] = condition;
    if (
      gameState.board[a] &&
      gameState.board[a] === gameState.board[b] &&
      gameState.board[a] === gameState.board[c]
    ) {
      return true; // There's a winner
    }
  }

  return false; // No winner yet
}

// Function to check for a draw
function isBoardFull() {
  return gameState.board.every((square) => square !== null);
}

// API endpoint to start a new game
app.post("/start-game", (req, res) => {
  gameState = {
    board: Array(9).fill(null),
    currentPlayer: "X",
  };
  res.json({ message: "New game started!" });
});

// API endpoint to make a move
app.post("/make-move", (req, res) => {
  const { squareIndex } = req.body;

  if (squareIndex < 0 || squareIndex >= 9) {
    return res.status(400).json({ message: "Invalid square index!" });
  }

  if (gameState.board[squareIndex] === null) {
    gameState.board[squareIndex] = gameState.currentPlayer;

    if (checkWin()) {
      res.json({ message: `${gameState.currentPlayer} wins!` });
    } else if (isBoardFull()) {
      res.json({ message: "It's a draw!" });
    } else {
      gameState.currentPlayer = gameState.currentPlayer === "X" ? "O" : "X";
      res.json({ message: "Move successful!", board: gameState.board });
    }
  } else {
    res.status(400).json({ message: "Invalid move!" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// ERROR HANDLING
// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Setting the response status code based on the error
  res.status(500).json({ error: "Internal server error" });
});

// Starting the server
const portS = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// Throw Error handling
app.get("/example", (req, res, next) => {
  try {
    // Some code that might throw an error
    if (somethingIsWrong) {
      throw new Error("Something went wrong");
    }
    // ...
    res.json({ success: true });
  } catch (error) {
    next(error); // Passing the error to the error-handling middleware
  }
});

// BACKEND DATABASE INTERGRATION

const admin = require("firebase-admin");

// Initializing Firebase Admin SDK with my service account credentials
const serviceAccount = require({
  type: "service_account",
  project_id: "advance-medium-323606",
  private_key_id: "dd9825531db56817a6471eaf12df922e154d2737",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCyFXOxRTWQJK9q\n3rSf/7T9bA9i6Srazve6QMcCK6CjZDLWbr0yXV+GteO16JyhWfKT/IDEByc3T5Ao\nISZa7HEsyj3ivbinBssNWGBEcPziMO1kJ5D6h/gt9WzMGpMTaobZHImx/2QJCU5M\nwOxNEVsVn5u9UW6p/WGMK16MMmpoIfb4pr/RxCEXHkI5FXGfHsDdh8K3O+Gn6sIW\nD09KJfGpKszYiAlwSl6PN9IozpUFOI5E2tcSiOL2YWlw8NLg2nqhWEph3Omuv2fU\neqs3YAfnyf0vVJbzjx6x8vxfJTVavRREZgulIQZ7RwLt9U/jqtWD0wjXQHkZm/0D\nqpIuxwCxAgMBAAECggEALcq+WRMG1u3X/Y8OuyWxkIi83B5A2srlgIsvoSs+v0UA\nnYsUM2M3MRiMWTZbMFJEwjDnm4CLYPmgg/EiP7cU0wOeLjPCy5A/nkrfVjoHjNIv\n+NUDvqg/9PFq7IDY2OFHk4R3E8IsIva1n57sJFUWKtVD4saRwjxZXQW55isAmY3T\nWnmpZhS9FJ81OXuSbxj1xUOs6U97I3fpUXVNeXr9mzH/RJvkYgglAfX5ITw+A8NI\nqa7EaOgvFReiJIKSvWHRI5GTl0hoVLKQlG4mzWxKkJ6F+t1Bpsp+sseaBaNBY+zp\nV08C9JMHoFg3l9pbpPR1eG3ltXKjv0aLlZ37+nk2EQKBgQD2QZiiigytO/SG6DpK\nszSAbNulE6uSn2LGPMXpdKr4nXiocJ0skY0PEfxze9jV0unC61zIvDTS4a5ld7Oe\n5cJPmJsVC8t7EUOD6AOYtUvYN1PU+LD2Jw8XBJfk0XapoNRGv46hTSg4vb+MriFu\niZ9qKVWISO7pYlSmosE9n38DywKBgQC5IVEEjZAmmqB/c9gddmf1uh1JX844gXdx\npmMeB2vqyyuSl8BvKUoOIrVl+reoOj+JOSypK2t1DT6p26LP9qZwlpUd3j2so4Qy\nFPQTfJ+ziLSFxPX0tq76aUPOnhGbO8nawx6Yxht/PgxLKpdd3kQi6LA1N9iAMSMU\nFQ3DwFxV8wKBgQDU2SHa68PFQFs8+CDaTEcG8hBvgK79zrILcqAGB4d32HRf8uaH\njU8FRaCVGOj0+JaAmfraroJh/BtHLM2efC0Vq2vwJv+74dIfgz0Ikzt5KWlWXZZn\nTJ9oX9oCN2J/f7m7ZPsdRJmNYcTdDe1ro5ycoBmD8LZAF3PfjDHG18NrPQKBgB/8\n/b7HpyzEcw8SuTj+CKCQ9BaFk2B4Hmdo1J+PsLn1OSYvSnTqsX0XyjhAxhMvXWMc\nmfbxJbQoAbff15YPjFrP6hwrFoUKDAGLVVE4q2+eI3MpwUXzevCR18GP1oL4JbzD\nEjpboMyvr/gc9+KkUSmnAytu5t3fn6wMp0A3sLy5AoGANhZlWzcAB7UnusFXwkrD\nScrWGfxc6ZSsx0V3KsPP1rurWtiD4NqyjnZqDwnWqahGin7tQgKrv3qpmgSzBNTV\nlj5OsRwTyof3h+y5FXqTHtgAUYN6qlo6tDSb5WvslTuNclPKCEdN785qG4sQ3xuy\ntYN1SOXAQf8fsTmWqhi5Dug=\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-8vpk9@advance-medium-323606.iam.gserviceaccount.com",
  client_id: "106063656466574003935",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-8vpk9%40advance-medium-323606.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://firebase.google.com/u/1/project/advance-medium-323606/settings/general",
});

{
  background-color; #f0f0f0; /* Fallback color */
  background-image; url('background-image.jpg');
  background-size; cover;
  background-repet; no-repeat;
  background-position; center;
}
