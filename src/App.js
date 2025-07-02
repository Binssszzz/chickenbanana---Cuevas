import React, { useState } from 'react';
import './App.css';

const bananaImg = 'https://thumbs.dreamstime.com/b/bunch-bananas-6175887.jpg?w=768';
const chickenImg = 'https://thumbs.dreamstime.com/z/full-body-brown-chicken-hen-standing-isolated-white-backgroun-background-use-farm-animals-livestock-theme-49741285.jpg?ct=jpeg';

const NUM_TILES = 36;

function shuffleImages() {
  const images = [
    ...Array(NUM_TILES / 2).fill(bananaImg),
    ...Array(NUM_TILES / 2).fill(chickenImg),
  ];
  for (let i = images.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [images[i], images[j]] = [images[j], images[i]];
  }
  return images;
}

function App() {
  const [images, setImages] = useState(shuffleImages());
  const [revealed, setRevealed] = useState(Array(NUM_TILES).fill(false));
  const [animatedTiles, setAnimatedTiles] = useState(Array(NUM_TILES).fill(false));
  const [playerChoice, setPlayerChoice] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [correctClicks, setCorrectClicks] = useState(0);
  const [winner, setWinner] = useState('');

  const [bananaScore, setBananaScore] = useState(() => {
    return parseInt(localStorage.getItem('bananaScore')) || 0;
  });
  const [chickenScore, setChickenScore] = useState(() => {
    return parseInt(localStorage.getItem('chickenScore')) || 0;
  });

  const choiceImg = playerChoice === 'banana' ? bananaImg : chickenImg;

  const checkWin = (newRevealed) => {
    return images.every((img, i) => {
      if (img === choiceImg) return newRevealed[i];
      else return true;
    });
  };

  const handleTileClick = (index) => {
    if (gameOver || revealed[index] || playerChoice === null) return;

    const newRevealed = [...revealed];
    const newAnimated = [...animatedTiles];
    newRevealed[index] = true;
    newAnimated[index] = true;

    setRevealed(newRevealed);
    setAnimatedTiles(newAnimated);

    if (images[index] === choiceImg) {
      const updatedClicks = correctClicks + 1;
      setCorrectClicks(updatedClicks);
      if (checkWin(newRevealed)) {
        setMessage(`🎉 ${playerChoice.toUpperCase()} wins! +5 points`);
        setWinner(playerChoice);
        if (playerChoice === 'banana') {
          const newScore = bananaScore + 5;
          setBananaScore(newScore);
          localStorage.setItem('bananaScore', newScore);
        } else {
          const newScore = chickenScore + 5;
          setChickenScore(newScore);
          localStorage.setItem('chickenScore', newScore);
        }
        setGameOver(true);
      }
    } else {
      const opponent = playerChoice === 'banana' ? 'chicken' : 'banana';
      setWinner(opponent);
      setMessage(`❌ Wrong box! ${playerChoice.toUpperCase()} loses. ${opponent.toUpperCase()} gains +5 points!`);

      if (opponent === 'banana') {
        const newScore = bananaScore + 5;
        setBananaScore(newScore);
        localStorage.setItem('bananaScore', newScore);
      } else {
        const newScore = chickenScore + 5;
        setChickenScore(newScore);
        localStorage.setItem('chickenScore', newScore);
      }

      setGameOver(true);
    }
  };

  const restartRound = (choice) => {
    setPlayerChoice(choice);
    setImages(shuffleImages());
    setRevealed(Array(NUM_TILES).fill(false));
    setAnimatedTiles(Array(NUM_TILES).fill(false));
    setGameOver(false);
    setMessage('');
    setCorrectClicks(0);
    setWinner('');
  };

  const resetScores = () => {
    localStorage.removeItem('bananaScore');
    localStorage.removeItem('chickenScore');
    setBananaScore(0);
    setChickenScore(0);
  };

  return (
    <div className="container">
      <h1>🐔 Chicken vs 🍌 Banana Game</h1>

      {(gameOver || playerChoice === null) && (
        <div className="choices">
          <p><strong>{gameOver ? 'Next round — choose side:' : 'Choose your side:'}</strong></p>
          <button onClick={() => restartRound('banana')}>Play as Banana 🍌</button>
          <button onClick={() => restartRound('chicken')}>Play as Chicken 🐔</button>
        </div>
      )}

      {playerChoice && !gameOver && (
        <div className="game-area-row">
          <div className="grid">
            {images.map((img, index) => (
              <div
                key={index}
                className="square"
                onClick={() => handleTileClick(index)}
              >
                {revealed[index] ? (
                  <img
                    src={img}
                    alt="tile"
                    className={animatedTiles[index] ? 'pop-in' : ''}
                  />
                ) : null}
              </div>
            ))}
          </div>

          <div className="scoreboard">
            <h2>📊 Round Info</h2>
            <p>🔄 Current Side: {playerChoice.toUpperCase()}</p>
            <p>✅ Clicks: {correctClicks}</p>
            <p>🎯 Status: {message || 'Game in progress...'}</p>
            {winner && <p>🏆 Winner: {winner.toUpperCase()}</p>}
            <hr />
            <h3>🏅 Leaderboard</h3>
            <p>🍌 Banana Score: {bananaScore}</p>
            <p>🐔 Chicken Score: {chickenScore}</p>
            <button onClick={resetScores}>🔁 Reset Scores</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
