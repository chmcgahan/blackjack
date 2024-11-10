import React, { useEffect, useState } from 'react';

const Deck = () => {
  const [deckState, setDeckState] = useState([]);
  const [error, setError] = useState(null);
  const [cardsLeft, setCardsLeft] = useState(0); // Track remaining cards from gameState

  // Fetch initial game state on component mount
  useEffect(() => {
    fetchGameState();
  }, []);

  // Function to fetch the entire game state
  const fetchGameState = () => {
    fetch('http://127.0.0.1:5000/get_deck')
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        setDeckState(data.deck);  // Update deck state
        setCardsLeft(data.deck.length); // Update cards left based on gameState
      })
      .catch(error => {
        console.error("Error fetching deck:", error);
        setError("Failed to load deck data.");
      });
  };

  // Function to draw a card and update game state
  const drawCard = () => {
    fetch('http://127.0.0.1:5000/player_draw', { method: 'POST' })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        setDeckState(data.player_hand);  // Update player hand state with the response
        setCardsLeft(data.cardsLeft);    // Update remaining cards
      })
      .catch(error => {
        console.error("Error drawing card:", error);
        setError("Failed to draw a card.");
      });
  };

  return (
    <div className="deck-column">
      <h2>Deck State</h2>
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          <ul>
            {deckState.map((card, index) => (
              <li key={index}>{card}</li>
            ))}
          </ul>
          <p>Total cards remaining: {cardsLeft}</p>
          <button onClick={drawCard}>Draw Card</button> {/* Button to draw a card */}
        </>
      )}
    </div>
  );
};

export default Deck;
