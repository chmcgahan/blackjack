# app.py
from flask import Flask, jsonify
from flask_cors import CORS
from deck import Deck
import random
import logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
app = Flask(__name__)
CORS(app)

deck = Deck()
player_hand = []
dealer_hand = []

def shuffle_deck():
    global deck
    values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10]
    hearts = [str(value) + "h" for value in values]
    spades = [str(value) + "s" for value in values]
    clubs = [str(value) + "c" for value in values]
    diamonds = [str(value) + "d" for value in values]
    deck = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10] * 4  # 52 cards
    random.shuffle(deck)
    logging.info("Deck shuffled.")

def draw_card():
    logging.info(f"Remaining deck size: {len(deck)}")
    if len(deck) == 0:
        shuffle_deck()
    return deck.pop()

@app.route('/get_deck', methods=['GET'])
def get_deck():
    if not deck:
        shuffle_deck()
    return jsonify(deck=deck)

@app.route('/start_game', methods=['POST'])
def start_game():
    global player_hand, dealer_hand
    player_hand = [draw_card(), draw_card()]
    dealer_hand = [draw_card(), draw_card()]
    return jsonify({
        "message": "Game started",
        "player_hand": player_hand,
        "dealer_hand": [dealer_hand[0], "Hidden"]
    })

@app.route('/player_draw', methods=['POST'])
def player_draw():
    global player_hand
    if len(deck) == 0:
        shuffle_deck()
    if sum(player_hand) > 21:
        return end_game()
    
    card = draw_card()
    player_hand.append(card)
    total = sum(player_hand)
    message = "Player drew a card."
    if total > 21:
        return end_game()
    
    return jsonify({
        "player_hand": player_hand,
        "total": total,
        "message": message,
        "deck": deck
    })

@app.route('/player_stops_drawing', methods=['POST'])
def player_stops_drawing():
    pass

@app.route('/dealer_draw', methods=['POST'])
def dealer_draw():
    global dealer_hand
    while sum(dealer_hand) < 17:
        dealer_hand.append(draw_card())
    total = sum(dealer_hand)
    return end_game()

@app.route('/end_game', methods=['POST'])
def end_game():
    player_total = sum(player_hand)
    dealer_total = sum(dealer_hand)
    if player_total > 21:
        result = "Player busts! Dealer wins."
    elif dealer_total > 21:
        result = "Dealer busts. Player wins!"
    elif player_total > dealer_total:
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
    shuffle_deck()
    app.run(host="127.0.0.1", port=5000, debug=True)
