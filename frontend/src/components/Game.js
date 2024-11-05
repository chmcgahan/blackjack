// src/components/Game.js
import React, { useState } from "react";
import { startGame, playerDraw, dealerDraw, endGame } from "../api";

const Game = () => {
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [message, setMessage] = useState("");

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
    <div>
      <h1>Card Game</h1>
      <button onClick={handleStartGame}>Start Game</button>
      <button onClick={handlePlayerDraw}>Draw Card</button>
      <button onClick={handleDealerDraw}>Dealer Draw</button>
      <button onClick={handleEndGame}>End Game</button>

      <h2>Player Hand: {playerHand.join(", ")}</h2>
      <h2>Dealer Hand: {dealerHand.join(", ")}</h2>
      <h3>{message}</h3>
    </div>
  );
};

export default Game;
