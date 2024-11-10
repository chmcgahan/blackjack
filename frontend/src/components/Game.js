import React, { useEffect, useState } from 'react';

const getCardImage = (imagePath) => {
  return imagePath;
};

const Game = () => {
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [message, setMessage] = useState("");
  const [cardsLeft, setCardsLeft] = useState(52);
  const [bankBalance, setBankBalance] = useState(1000);
  const [bestMove, setBestMove] = useState("Hit");

  const handleNewGame = () => {
    fetch('http://127.0.0.1:5000/new_game', { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        setPlayerHand(data.player_hand);
        setDealerHand(data.dealer_hand);
        setMessage(data.message);
        setCardsLeft(data.cardsLeft);
        setBankBalance(data.bankBalance);
        setBestMove(data.bestMove);
      })
      .catch(error => console.error("Error starting new game:", error));
  };

  const handleNextHand = () => {
    fetch('http://127.0.0.1:5000/next_hand', { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        setPlayerHand(data.player_hand);
        setDealerHand(data.dealer_hand);
        setMessage(data.message);
        setCardsLeft(data.cardsLeft);
        setBestMove(data.bestMove);
        setBankBalance(data.bankBalance);
      })
      .catch(error => console.error("Error starting round:", error));
  };

  const handlePlayerDraw = () => {
    fetch('http://127.0.0.1:5000/player_draw', { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        setPlayerHand(data.player_hand);
        setMessage(data.message);
        setCardsLeft(data.cardsLeft);
        setBestMove(data.bestMove);
        setBankBalance(data.bankBalance);
      })
      .catch(error => console.error("Error drawing card:", error));
  };

  const handleDealerDraw = () => {
    fetch('http://127.0.0.1:5000/dealer_draw', { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        setDealerHand(data.dealer_hand);
        setMessage(data.message);
        setCardsLeft(data.cardsLeft);
        setBestMove(data.bestMove);
        setBankBalance(data.bankBalance);
      })
      .catch(error => console.error("Error with dealer draw:", error));
  };

  return (
    <div className="game-container">
      <h1>Blackjack Game</h1>

      <div className="controls">
        <button onClick={handleNewGame} style={{ fontSize: '18px', padding: '10px 20px' }}>New Game</button>
        <button onClick={handleNextHand}>Next Hand</button>
        <button onClick={handlePlayerDraw}>Draw Card</button>
        <button onClick={handleDealerDraw}>Dealer Draw</button>
      </div>

      <div className="hand-container">
        <h2>Player Hand:</h2>
        <div className="card-hand">
          {playerHand.map((cardImage, index) => (
            <img
              key={index}
              src={getCardImage(cardImage)}
              alt={`Player Card ${index + 1}`}
              className="card-image"
            />
          ))}
        </div>
      </div>

      <div className="hand-container">
        <h2>Dealer Hand:</h2>
        <div className="card-hand">
          {dealerHand.map((cardImage, index) => (
            <img
              key={index}
              src={getCardImage(cardImage)}
              alt={`Dealer Card ${index + 1}`}
              className="card-image"
            />
          ))}
        </div>
      </div>

      <div className="message-box">
        <h3>{message}</h3>
      </div>

      <div className="info-box">
        <p>Cards Left: {cardsLeft}</p>
      </div>

      <div className="bank-balance-box">
        <p>Bank Balance: ${bankBalance}</p>
      </div>

      <div className="best-move">
        <p>Best Move: {bestMove}</p>
      </div>
    </div>
  );
};

export default Game;
