import React, { useEffect, useState } from 'react';

const Deck = () => {
  const [deck, setDeck] = useState([]);
  const [error, setError] = useState(null);

  // Fetch initial deck state on component mount
  useEffect(() => {
    fetchDeck();
  }, []);

  // Function to fetch the deck
  const fetchDeck = () => {
    fetch('http://127.0.0.1:5000/get_deck')
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        setDeck(data.deck);  // Update deck state
      })
      .catch(error => {
        console.error("Error fetching deck:", error);
        setError("Failed to load deck data.");
      });
  };

  // Function to draw a card and update the deck
  const drawCard = () => {
    fetch('http://127.0.0.1:5000/player_draw', { method: 'POST' })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        setDeck(data.deck);  // Update deck state with the response
        // Additional logic for player hand, total, message, etc., can go here
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
            {deck.map((card, index) => (
              <li key={index}>{card}</li>
            ))}
          </ul>
          <p>Total cards remaining: {deck.length}</p>
          <button onClick={drawCard}>Draw Card</button> {/* Button to draw a card */}
        </>
      )}
    </div>
  );
};

export default Deck;
