import React, { useEffect, useState, useRef, useCallback } from "react";

const WIDTH = 10;
const HEIGHT = 20;
const CELL_SIZE = 30;

// Define heroes with symbols and colors
const HEROES = [
  { name: "Thor", symbol: "⚡", color: "#FFD700", bg: "#4A4A00" },
  { name: "Iron Man", symbol: "🤖", color: "#FF4500", bg: "#4A1A00" },
  { name: "Captain America", symbol: "🛡️", color: "#4169E1", bg: "#001A4A" },
  { name: "Black Widow", symbol: "🕷️", color: "#FF69B4", bg: "#4A1A3A" },
  { name: "Hulk", symbol: "💪", color: "#32CD32", bg: "#1A4A1A" },
];

// Tetromino shapes
const TETROMINOS = {
  Thor: { shape: [[0,1,0],[1,1,1]] },
  IronMan: { shape: [[1,1,1,1]] },
  CaptainAmerica: { shape: [[1,1],[1,1]] },
  BlackWidow: { shape: [[0,1,1],[1,1,0]] },
  Hulk: { shape: [[1,1,0],[0,1,1]] },
};

function randomPiece() {
  const keys = Object.keys(TETROMINOS);
  const type = keys[Math.floor(Math.random() * keys.length)];
  const heroIndex = keys.indexOf(type);
  return {
    type,
    shape: TETROMINOS[type].shape.map(row => row.slice()),
    heroIndex,
  };
}

function rotateMatrix(matrix) {
  return matrix[0].map((_, i) => matrix.map(row => row[row.length - 1 - i]));
}

function createEmptyGrid() {
  return Array.from({ length: HEIGHT }, () => Array.from({ length: WIDTH }, () => null));
}

export default function MarvelTetris() {
  const [grid, setGrid] = useState(() => createEmptyGrid());
  const [current, setCurrent] = useState(() => {
    const p = randomPiece();
    return { ...p, x: Math.floor((WIDTH - p.shape[0].length) / 2), y: 0 };
  });
  const [next, setNext] = useState(() => randomPiece());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [dropInterval, setDropInterval] = useState(1000);
  const intervalRef = useRef(null);

  const collides = useCallback((shape, x, y, g = grid) => {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const newX = x + c;
          const newY = y + r;
          if (newX < 0 || newX >= WIDTH || newY >= HEIGHT) return true;
          if (newY >= 0 && g[newY][newX]) return true;
        }
      }
    }
    return false;
  }, [grid]);

  const lockPiece = useCallback(() => {
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => row.slice());
      const { shape, x, y, heroIndex } = current;
      
      // Place piece
      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
          if (shape[r][c]) {
            const gx = x + c;
            const gy = y + r;
            if (gy >= 0 && gy < HEIGHT && gx >= 0 && gx < WIDTH) {
              newGrid[gy][gx] = { heroIndex };
            }
          }
        }
      }

      // Clear completed lines
      let linesCleared = 0;
      for (let row = HEIGHT - 1; row >= 0; row--) {
        if (newGrid[row].every(cell => cell !== null)) {
          newGrid.splice(row, 1);
          newGrid.unshift(Array.from({ length: WIDTH }, () => null));
          linesCleared++;
          row++; // Check same row again
        }
      }

      if (linesCleared > 0) {
        setScore(s => s + linesCleared * 100 * linesCleared);
        setDropInterval(d => Math.max(200, d - linesCleared * 50));
      }

      return newGrid;
    });

    // Set new current piece
    const newPiece = { ...next, x: Math.floor((WIDTH - next.shape[0].length) / 2), y: 0 };
    setCurrent(newPiece);
    setNext(randomPiece());

    // Check for game over
    setTimeout(() => {
      if (collides(newPiece.shape, newPiece.x, newPiece.y, grid)) {
        setGameOver(true);
      }
    }, 100);
  }, [current, next, grid, collides]);

  const drop = useCallback(() => {
    if (gameOver) return;
    
    setCurrent(prev => {
      const newY = prev.y + 1;
      if (collides(prev.shape, prev.x, newY)) {
        lockPiece();
        return prev;
      }
      return { ...prev, y: newY };
    });
  }, [gameOver, collides, lockPiece]);

  // Game loop
  useEffect(() => {
    if (gameOver) return;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(drop, dropInterval);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [drop, dropInterval, gameOver]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return;
      
      e.preventDefault();
      
      setCurrent(prev => {
        switch (e.key) {
          case "ArrowLeft": {
            const newX = prev.x - 1;
            if (!collides(prev.shape, newX, prev.y)) {
              return { ...prev, x: newX };
            }
            break;
          }
          case "ArrowRight": {
            const newX = prev.x + 1;
            if (!collides(prev.shape, newX, prev.y)) {
              return { ...prev, x: newX };
            }
            break;
          }
          case "ArrowDown": {
            drop();
            break;
          }
          case "ArrowUp": {
            const rotated = rotateMatrix(prev.shape);
            if (!collides(rotated, prev.x, prev.y)) {
              return { ...prev, shape: rotated };
            }
            break;
          }
          case " ": {
            let newY = prev.y;
            while (!collides(prev.shape, prev.x, newY + 1)) {
              newY++;
            }
            const dropped = { ...prev, y: newY };
            setTimeout(lockPiece, 50);
            return dropped;
          }
        }
        return prev;
      });
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameOver, collides, drop, lockPiece]);

  const reset = () => {
    setGrid(createEmptyGrid());
    setScore(0);
    setDropInterval(1000);
    setGameOver(false);
    const p = randomPiece();
    setNext(randomPiece());
    setCurrent({ ...p, x: Math.floor((WIDTH - p.shape[0].length) / 2), y: 0 });
  };

  const getRenderGrid = () => {
    const render = grid.map(row => row.slice());
    
    if (current && !gameOver) {
      const { shape, x, y, heroIndex } = current;
      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
          if (shape[r][c]) {
            const gx = x + c;
            const gy = y + r;
            if (gy >= 0 && gy < HEIGHT && gx >= 0 && gx < WIDTH) {
              render[gy][gx] = { heroIndex, falling: true };
            }
          }
        }
      }
    }
    return render;
  };

  const renderGrid = getRenderGrid();
  const nextHero = HEROES[next.heroIndex];

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#000000', 
      color: '#ffffff', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
        
        {/* Game Board */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            marginBottom: '20px',
            background: 'linear-gradient(45deg, #ff0000, #0000ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center'
          }}>
            MARVEL TETRIS
          </h1>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${WIDTH}, ${CELL_SIZE}px)`,
            backgroundColor: '#111111',
            border: '3px solid #444444',
            borderRadius: '8px',
            padding: '10px',
            boxShadow: '0 0 30px rgba(0,150,255,0.3)'
          }}>
            {renderGrid.map((row, y) =>
              row.map((cell, x) => {
                const isEmpty = !cell;
                const hero = cell ? HEROES[cell.heroIndex] : null;
                
                return (
                  <div
                    key={`${x}-${y}`}
                    style={{
                      width: `${CELL_SIZE}px`,
                      height: `${CELL_SIZE}px`,
                      backgroundColor: isEmpty ? '#1a1a1a' : hero.bg,
                      border: '1px solid #333333',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: isEmpty ? 'transparent' : hero.color,
                      textShadow: isEmpty ? 'none' : '0 0 8px rgba(255,255,255,0.8)',
                      transition: 'all 0.1s ease'
                    }}
                  >
                    {isEmpty ? '' : hero.symbol}
                  </div>
                );
              })
            )}
          </div>

          {/* Controls */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginTop: '20px',
            width: '100%'
          }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={drop}
                disabled={gameOver}
                style={{
                  padding: '10px 15px',
                  backgroundColor: gameOver ? '#666666' : '#0066cc',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: gameOver ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Drop ↓
              </button>
              <button
                onClick={() => {
                  if (!gameOver) {
                    setCurrent(prev => {
                      const rotated = rotateMatrix(prev.shape);
                      if (!collides(rotated, prev.x, prev.y)) {
                        return { ...prev, shape: rotated };
                      }
                      return prev;
                    });
                  }
                }}
                disabled={gameOver}
                style={{
                  padding: '10px 15px',
                  backgroundColor: gameOver ? '#666666' : '#00cc66',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: gameOver ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Rotate ↻
              </button>
              <button
                onClick={reset}
                style={{
                  padding: '10px 15px',
                  backgroundColor: '#cc6600',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Reset
              </button>
            </div>

            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
              Score: <span style={{ color: '#ffcc00' }}>{score}</span>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div style={{ width: '200px' }}>
          {/* Next Piece */}
          <div style={{ 
            backgroundColor: '#222222', 
            padding: '20px', 
            borderRadius: '10px', 
            marginBottom: '20px',
            border: '2px solid #444444'
          }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', textAlign: 'center' }}>
              Next Hero
            </div>
            <div style={{ color: '#cccccc', marginBottom: '15px', textAlign: 'center' }}>
              {nextHero.name}
            </div>
            <div style={{
              backgroundColor: '#111111',
              border: '1px solid #555555',
              borderRadius: '5px',
              padding: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '80px'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${next.shape[0].length}, 25px)`,
                gap: '2px'
              }}>
                {next.shape.flatMap((row, r) =>
                  row.map((val, c) => (
                    <div
                      key={`${r}-${c}`}
                      style={{
                        width: '25px',
                        height: '25px',
                        backgroundColor: val ? nextHero.bg : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: val ? nextHero.color : 'transparent',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        borderRadius: '3px',
                        textShadow: val ? '0 0 5px rgba(255,255,255,0.8)' : 'none'
                      }}
                    >
                      {val ? nextHero.symbol : ''}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Controls Guide */}
          <div style={{ 
            backgroundColor: '#222222', 
            padding: '20px', 
            borderRadius: '10px',
            border: '2px solid #444444'
          }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
              Controls
            </div>
            <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#cccccc' }}>
              <div>← → : Move left/right</div>
              <div>↑ : Rotate piece</div>
              <div>↓ : Soft drop</div>
              <div><strong>Space</strong> : Hard drop</div>
            </div>
            <div style={{ 
              marginTop: '15px', 
              fontSize: '12px', 
              color: '#999999',
              borderTop: '1px solid #444444',
              paddingTop: '15px'
            }}>
              Assemble your Marvel heroes and clear the board!
            </div>
          </div>

          {/* Game Over */}
          {gameOver && (
            <div style={{ 
              marginTop: '20px',
              backgroundColor: '#660000', 
              padding: '20px', 
              borderRadius: '10px',
              border: '2px solid #cc0000',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>
                GAME OVER
              </div>
              <div style={{ marginBottom: '15px' }}>
                Final Score: <strong style={{ color: '#ffcc00' }}>{score}</strong>
              </div>
              <button 
                onClick={reset}
                style={{
                  padding: '12px 20px',
                  backgroundColor: '#0066cc',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}
              >
                Assemble Again!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}