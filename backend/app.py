# app.py
from flask import Flask, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize the deck and hands
deck = []
player_hand = []
dealer_hand = []

def shuffle_deck():
    global deck
    deck = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10] * 4  # 52 cards
    random.shuffle(deck)

def draw_card():
    if len(deck) == 0:
        shuffle_deck()  # Reshuffle if the deck is empty
    return deck.pop()

@app.route('/start_game', methods=['POST'])
def start_game():
    global player_hand, dealer_hand
    player_hand = [draw_card(), draw_card()]
    dealer_hand = [draw_card(), draw_card()]
    return jsonify({
        "message": "Game started",
        "player_hand": player_hand,
        "dealer_hand": [dealer_hand[0], "Hidden"]  # Show only one dealer card initially
    })

@app.route('/player_draw', methods=['POST'])
def player_draw():
    global player_hand
    player_hand.append(draw_card())
    total = sum(player_hand)
    return jsonify({
        "player_hand": player_hand,
        "total": total,
        "message": "Player drew a card."
    })

@app.route('/dealer_draw', methods=['POST'])
def dealer_draw():
    global dealer_hand
    while sum(dealer_hand) < 17:
        dealer_hand.append(draw_card())
    total = sum(dealer_hand)
    return jsonify({
        "dealer_hand": dealer_hand,
        "total": total,
        "message": "Dealer drew cards until reaching 17 or more."
    })

@app.route('/end_game', methods=['POST'])
def end_game():
    player_total = sum(player_hand)
    dealer_total = sum(dealer_hand)
    if player_total > 21:
        result = "Player busts! Dealer wins."
    elif dealer_total > 21 or player_total > dealer_total:
        result = "Player wins!"
    elif dealer_total == player_total:
        result = "It's a draw!"
    else:
        result = "Dealer wins!"
    return jsonify({
        "message": result,
        "player_hand": player_hand,
        "dealer_hand": dealer_hand
    })

if __name__ == "__main__":
    shuffle_deck()  # Initialize and shuffle the deck
    app.run(host="127.0.0.1", port=5000, debug=True)
