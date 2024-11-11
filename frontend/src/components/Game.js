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
  const [handsWon, setHandsWon] = useState(0);
  const [handsLost, setHandsLost] = useState(0);

  // New states for betting feature
  const [isBettingPhase, setIsBettingPhase] = useState(true);
  const [betAmount, setBetAmount] = useState(1);
  const [currentBet, setCurrentBet] = useState(0);

  const handleNewGame = () => {
    fetch('http://127.0.0.1:5000/new_game', { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        setPlayerHand([]);
        setDealerHand([]);
        setMessage(data.message);
        setCardsLeft(data.cardsLeft);
        setBankBalance(data.bank_balance);
        setBestMove(data.bestMove);
        setHandsWon(0);
        setHandsLost(0);
        setIsBettingPhase(true); // Start with betting phase
      })
      .catch(error => console.error("Error starting new game:", error));
  };

  const handleNextHand = () => {
    setIsBettingPhase(true); // Enter betting phase for the next hand
    setPlayerHand([]);
    setDealerHand([]);
    setMessage("");
    setBestMove("");
    // Reset current bet
    setCurrentBet(0);
  };

  // New function to handle placing a bet
  const handlePlaceBet = () => {
    if (betAmount < 1 || betAmount > bankBalance) {
      alert("Invalid bet amount. Please enter a value between 1 and your bank balance.");
      return;
    }

    setCurrentBet(betAmount);
    setBankBalance(prevBalance => prevBalance - betAmount);
    setIsBettingPhase(false); // Exit betting phase

    // Fetch the initial hands after placing a bet
    fetch('http://127.0.0.1:5000/next_hand', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bet_amount: betAmount })
    })
      .then(response => response.json())
      .then(data => {
        setPlayerHand(data.player_hand);
        setDealerHand(data.dealer_hand);
        setMessage(data.message);
        setCardsLeft(data.cardsLeft);
        setBestMove(data.bestMove);
      })
      .catch(error => console.error("Error starting hand:", error));
  };

  const handlePlayerDraw = () => {
    fetch('http://127.0.0.1:5000/player_draw', { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        setPlayerHand(data.player_hand);
        setMessage(data.message);
        setCardsLeft(data.cardsLeft);
        setBestMove(data.bestMove);

        if (data.round_over) {
          handleRoundEnd(data.result);
        }
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

        if (data.round_over) {
          handleRoundEnd(data.result);
        }
      })
      .catch(error => console.error("Error with dealer draw:", error));
  };

  // New function to handle the end of a round
  const handleRoundEnd = (result) => {
    if (result === 'win') {
      setBankBalance(prevBalance => prevBalance + currentBet * 2);
      setHandsWon(prev => prev + 1);
      setMessage("You won the round!");
    } else if (result === 'lose') {
      setHandsLost(prev => prev + 1);
      setMessage("You lost the round.");
    } else if (result === 'tie') {
      setBankBalance(prevBalance => prevBalance + currentBet);
      setMessage("It's a tie!");
    }
    setCurrentBet(0);
    setIsBettingPhase(true); // Return to betting phase for next hand
  };

  const handleEndGame = () => {
    fetch('http://127.0.0.1:5000/end_game', { method: 'POST'})
      .then(response => response.json())
      .then(data => {
        setMessage(data.message);
        setPlayerHand([]);
        setDealerHand([]);
        setCardsLeft(data.cardsLeft);
        setBankBalance(data.bank_balance);
        setHandsWon(data.hands_won);
        setHandsLost(data.hands_lost);
        setIsBettingPhase(true);
        setCurrentBet(0);
      })
      .catch(error => console.error("Error ending game:", error));
  };

  return (
    <div className="game-container">
      <h1>Blackjack Game</h1>

      <div className="controls">
        <button onClick={handleNewGame}>New Game</button>
        <button onClick={handleNextHand}>Next Hand</button>
        <button onClick={handleEndGame}>End Game</button>
      </div>

      {isBettingPhase ? (
        // Betting phase UI
        <div className="betting-phase">
          <h3>Place Your Bet</h3>
          <input
            type="number"
            value={betAmount}
            min="1"
            max={bankBalance}
            onChange={(e) => setBetAmount(Number(e.target.value))}
          />
          <button onClick={handlePlaceBet}>Place Bet</button>
        </div>
      ) : (
        // Main game UI
        <>
          <div className="game-actions">
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

          <div className="best-move">
            <p>Best Move: {bestMove}</p>
          </div>
        </>
      )}

      <div className="info-box">
        <p>Cards Left: {cardsLeft}</p>
      </div>

      <div className="bank-balance-box">
        <p>Bank Balance: ${bankBalance}</p>
        {currentBet > 0 && <p>Current Bet: ${currentBet}</p>}
      </div>

      <div className="counters">
        <p>Hands Won: {handsWon}</p>
        <p>Hands Lost: {handsLost}</p>
      </div>
    </div>
  );
};

export default Game;
