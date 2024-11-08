import React, { useEffect, useState } from 'react';
import Deck from './Deck';

const getCardImage = (imagePath) => {
  return imagePath; // Just return the path provided by the backend
};

const Game = () => {
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [message, setMessage] = useState("");
  const [deck, setDeck] = useState([]);

  const handleStartGame = () => {
    fetch('http://127.0.0.1:5000/start_game', { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        setPlayerHand(data.player_hand);
        setDealerHand(data.dealer_hand);
        setMessage(data.message || "Game started!");
      })
      .catch(error => console.error("Error starting game:", error));
  };

  const handlePlayerDraw = () => {
    fetch('http://127.0.0.1:5000/player_draw', { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        setPlayerHand(data.player_hand);
        setMessage(data.message);
      })
      .catch(error => console.error("Error drawing card:", error));
  };

  const handleDealerDraw = () => {
    fetch('http://127.0.0.1:5000/dealer_draw', { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        setDealerHand(data.dealer_hand);
        setMessage(data.message);
      })
      .catch(error => console.error("Error with dealer draw:", error));
  };

  return (
<div className="game-container">
  <h1>Card Game</h1>

  <div className="controls">
    <button onClick={handleStartGame}>Start Game</button>
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

  {/* <Deck deck={deck} /> */}
</div>
  );
};

export default Game;
