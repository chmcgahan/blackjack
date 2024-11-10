from flask import Flask, jsonify
from flask_cors import CORS
from deck import Deck
import logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
app = Flask(__name__)
CORS(app)

deck = Deck()
player_hand = []
dealer_hand = []

@app.route('/get_deck', methods=['GET'])
def get_deck():
    return jsonify(deck=[str(card) for card in deck.cards])

@app.route('/start_game', methods=['POST'])
def start_game():
    global player_hand, dealer_hand

    if deck.remaining_cards() < 10:
        deck.build_deck()
        logging.info("Deck reshuffled as it had fewer than 10 cards")

    player_hand = [deck.draw_card(), deck.draw_card()]
    dealer_hand = [deck.draw_card(), deck.draw_card()]
    cards_left = deck.remaining_cards()
    best_move = "Hit" #to implement
    return jsonify({
        "message": "Game started",
        "player_hand": [card.image for card in player_hand],
        "dealer_hand": [dealer_hand[0].image, "Hidden"],
        "cardsLeft": cards_left,
        "bestMove": best_move
    })

@app.route('/player_draw', methods=['POST'])
def player_draw():
    global player_hand
    total =deck.sum_values(player_hand)
    if total >= 21:
        return end_game()
    
    player_hand.append(deck.draw_card())
    total =deck.sum_values(player_hand)
    if total >= 21:
        return end_game()
    
    return jsonify({
        "player_hand": [card.image for card in player_hand],
        "total": total
    })


@app.route('/player_stops_drawing', methods=['POST'])
def player_stops_drawing():
    pass

@app.route('/dealer_draw', methods=['POST'])
def dealer_draw():
    global dealer_hand
    while deck.sum_values(dealer_hand) < 17:
        dealer_hand.append(deck.draw_card())
    return end_game()

@app.route('/end_game', methods=['POST'])
def end_game():
    player_total = deck.sum_values(player_hand)
    dealer_total = deck.sum_values(dealer_hand)

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
        "player_hand": [card.image for card in player_hand],
        "dealer_hand": [card.image for card in dealer_hand]
    })

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
