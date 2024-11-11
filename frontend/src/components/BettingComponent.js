// BettingComponent.js
import { useState } from 'react';

function BettingComponent({ bankBalance, onBetPlaced }) {
    const [betAmount, setBetAmount] = useState(1);

    const handleBet = async () => {
        // Call the backend to place the bet
        const response = await fetch('/place_bet', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bet: betAmount })
        });
        const result = await response.json();
        
        if (result.success) {
            onBetPlaced(betAmount);  // Update state to show cards and proceed with the round
        } else {
            alert("Invalid bet. Please enter a valid amount.");
        }
    };

    return (
        <div>
            <h3>Place your bet!</h3>
            <input
                type="number"
                value={betAmount}
                min="1"
                max={bankBalance}
                onChange={(e) => setBetAmount(Number(e.target.value))}
            />
            <button onClick={handleBet}>Place Bet</button>
        </div>
    );
}

export default BettingComponent;
