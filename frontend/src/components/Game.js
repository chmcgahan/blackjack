// src/components/Game.js
import React, { useState } from "react";
import { startGame, playerDraw, dealerDraw, endGame } from "../api";
import Deck from './Deck'

const getCardImage = (card) => {
  // return `/cards/${card}.svg`; // Assumes images are in the /public/cards directory
  return `/img/${card}H.png`;
};

const Game = () => {
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [message, setMessage] = useState("");
  const [deck, setDeck] = useState(['Card1', 'Card2', /* initial deck state */]);

  const handleStartGame = async () => {
    const data = await startGame();
    if (data) {
      setPlayerHand(data.player_hand || []);
      setDealerHand(data.dealer_hand || []);
      setMessage(data.message || "No message received");
    }
  };

  const handlePlayerDraw = async () => {
    const data = await playerDraw();
    if (data) {
      setPlayerHand(data.player_hand || []);
      setMessage(data.message || "");
    }
  };

  const handleDealerDraw = async () => {
    const data = await dealerDraw();
    if (data) {
      setDealerHand(data.dealer_hand || []);
      setMessage(data.message || "");
    }
  };

  const handleEndGame = async () => {
    const data = await endGame();
    if (data) {
      setPlayerHand(data.player_hand || []);
      setDealerHand(data.dealer_hand || []);
      setMessage(data.message || "");
    }
  };

  return (
    <div className="game-container">
      <h1>Card Game</h1>
      <button onClick={handleStartGame}>Start Game</button>
      <button onClick={handlePlayerDraw}>Draw Card</button>
      <button onClick={handleDealerDraw}>Dealer Draw</button>
      {/* <button onClick={handleEndGame}>End Game</button> */}
  
      <div className="hand-container">
        <h2>Player Hand:</h2>
        <div className="card-hand">
          {playerHand.map((card, index) => (
            <img
              key={index}
              src={getCardImage(card)}
              alt={`Card ${card}`}
              className="card-image"
            />
          ))}
        </div>
      </div>
  
      <div className="hand-container">
        <h2>Dealer Hand:</h2>
        <div className="card-hand">
          {dealerHand.map((card, index) => (
            <img
              key={index}
              src={getCardImage(card)}
              alt={`Card ${card}`}
              className="card-image"
            />
          ))}
        </div>
      </div>
  
      <h3>{message}</h3>
      <Deck deck={deck} />
    </div>
  );
};

export default Game;
