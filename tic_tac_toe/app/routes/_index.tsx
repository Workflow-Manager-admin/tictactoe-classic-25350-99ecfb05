import { useState } from "react";

/**
 * Main Container for TicTacToe Classic
 * - Two player mode (same device)
 * - Turn indicator
 * - Win/draw detection
 * - Reset button
 * - Minimalist, responsive, centered UI with provided color scheme
 */

// PUBLIC_INTERFACE
export const meta = () => [
  { title: "Tic Tac Toe Classic" },
  { name: "description", content: "Minimalist, classic Tic Tac Toe game" },
];

const COLORS = {
  primary: "#ffffff",
  secondary: "#222222",
  accent: "#4caf50",
};

/**
 * Returns winner ("X" or "O"), [winningSquares], "draw", or null
 */
function calculateWinner(board) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6],            // diagonals
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  if (board.every(cell => cell !== null)) {
    return { winner: "draw" };
  }
  return null;
}

/**
 * Main Game Component
 */
// PUBLIC_INTERFACE
export default function Index() {
  // X goes first
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const result = calculateWinner(board);

  const handleCellClick = idx => {
    if (board[idx] !== null || (result && result.winner)) return; // No move
    const newBoard = [...board];
    newBoard[idx] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  let status;
  if (result?.winner === "draw") {
    status = "It's a draw!";
  } else if (result?.winner === "X" || result?.winner === "O") {
    status = (
      <span>
        <span
          style={{ color: COLORS.accent, fontWeight: 700 }}
          className="font-bold"
        >
          {result.winner}
        </span>{" "}
        wins!
      </span>
    );
  } else {
    status = (
      <span>
        Next turn:&nbsp;
        <span
          style={{ color: isXNext ? COLORS.accent : COLORS.secondary, fontWeight: 700 }}
          className="font-bold"
        >
          {isXNext ? "X" : "O"}
        </span>
      </span>
    );
  }

  // Determine cell highlight for winner
  const winningSquares = result?.line || [];

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        background: COLORS.primary,
        color: COLORS.secondary,
        fontFamily: "'Inter', ui-sans-serif, sans-serif",
      }}
    >
      <section
        className="flex flex-col items-center p-4 gap-6 w-full max-w-sm"
      >
        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: COLORS.secondary, letterSpacing: "0.04em" }}
        >
          Tic Tac Toe Classic
        </h1>

        <div
          className="mb-2 text-md text-center"
          style={{ minHeight: "2.5em" }}
          data-testid="turn-indicator"
        >
          {status}
        </div>

        <div
          className="grid grid-cols-3 gap-2 bg-gray-100 rounded-lg p-3 shadow"
          style={{
            background: "#f9f9f9",
            border: `1.5px solid #eee`,
            width: "min(90vw, 348px)",
            aspectRatio: "1 / 1",
          }}
        >
          {board.map((val, idx) => (
            <button
              key={idx}
              className="aspect-square text-4xl md:text-5xl font-bold flex items-center justify-center border rounded-lg transition-colors"
              style={{
                background: COLORS.primary,
                borderColor: winningSquares.includes(idx)
                  ? COLORS.accent
                  : "#ddd",
                color: winningSquares.includes(idx)
                  ? COLORS.accent
                  : COLORS.secondary,
                borderWidth: "2px",
                cursor:
                  !result?.winner && board[idx] === null
                    ? "pointer"
                    : "default",
                outline: "none",
                transition: "border-color 0.2s",
                userSelect: "none",
              }}
              onClick={() => handleCellClick(idx)}
              aria-label={`Cell ${idx + 1}: ${val || "empty"}`}
              disabled={!!result?.winner || val}
              tabIndex={0}
            >
              {val}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={reset}
          className="mt-4 px-6 py-2 rounded-md text-md font-semibold border"
          style={{
            background: COLORS.accent,
            color: COLORS.primary,
            border: "none",
            boxShadow: "0 1px 8px 0 #0001",
            transition: "background 0.16s",
            minWidth: "8em",
          }}
        >
          Reset
        </button>

        <footer className="mt-2 text-xs text-gray-400 text-center">
          2-Player | by Remix | Minimal UI
        </footer>
      </section>
    </main>
  );
}
