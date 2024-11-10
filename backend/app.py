from flask import Flask, jsonify
from flask_cors import CORS
from deck import Deck
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
app = Flask(__name__)
CORS(app)

deck = Deck()

gameState = {
    "player_hand": [],
    "dealer_hand": [],
    "remaining_cards": deck.remaining_cards(),
    "bank_balance": 1000,
    "message": "",
    "best_move": "Hit"
}

@app.route('/get_deck', methods=['GET'])
def get_deck():
    return jsonify(deck=[str(card) for card in deck.cards])

@app.route('/new_game', methods=['POST'])
def new_game():
    global gameState

    deck.build_deck()
    gameState = {
        "player_hand": [],
        "dealer_hand": [],
        "remaining_cards": deck.remaining_cards(),
        "bank_balance": 1000,
        "message": "New game started! Good luck!",
        "best_move": "Hit"
    }

    return next_hand()

@app.route('/next_hand', methods=['POST'])
def next_hand():
    global gameState

    if deck.remaining_cards() < 10:
        deck.build_deck()
        logging.info("Deck reshuffled as it had fewer than 10 cards")

    gameState["player_hand"] = [deck.draw_card(), deck.draw_card()]
    gameState["dealer_hand"] = [deck.draw_card(), deck.draw_card()]
    gameState["remaining_cards"] = deck.remaining_cards()
    gameState["message"] = "New hand started"
    gameState["best_move"] = "Hit"  # TODO: Implement best move logic
    gameState["bank_balance"] = 1000 # TODO: implement money logic

    return jsonify({
        "message": gameState["message"],
        "player_hand": [card.image for card in gameState["player_hand"]],
        "dealer_hand": [gameState["dealer_hand"][0].image, "Hidden"],
        "cardsLeft": gameState["remaining_cards"],
        "bestMove": gameState["best_move"],
        "bank_balance": gameState["bank_balance"]
    })

@app.route('/player_draw', methods=['POST'])
def player_draw():
    global gameState

    total = deck.sum_values(gameState["player_hand"])
    if total >= 21:
        return end_game()

    gameState["player_hand"].append(deck.draw_card())
    gameState["remaining_cards"] = deck.remaining_cards()
    total = deck.sum_values(gameState["player_hand"])

    if total >= 21:
        return end_game()

    return jsonify({
        "player_hand": [card.image for card in gameState["player_hand"]],
        "total": total,
        "cardsLeft": gameState["remaining_cards"],
        "bestMove": gameState["best_move"],
        "bank_balance": gameState["bank_balance"]
    })

@app.route('/player_stops_drawing', methods=['POST'])
def player_stops_drawing():
    return dealer_draw()

@app.route('/dealer_draw', methods=['POST'])
def dealer_draw():
    global gameState

    while deck.sum_values(gameState["dealer_hand"]) < 17:
        gameState["dealer_hand"].append(deck.draw_card())

    gameState["remaining_cards"] = deck.remaining_cards()
    return end_game()

@app.route('/end_game', methods=['POST'])
def end_game():
    global gameState

    player_total = deck.sum_values(gameState["player_hand"])
    dealer_total = deck.sum_values(gameState["dealer_hand"])

    if player_total > 21:
        gameState["message"] = "Player busts! Dealer wins."
    elif dealer_total > 21:
        gameState["message"] = "Dealer busts. Player wins!"
    elif player_total > dealer_total:
        gameState["message"] = "Player wins!"
    elif dealer_total == player_total:
        gameState["message"] = "It's a draw!"
    else:
        gameState["message"] = "Dealer wins!"

    return jsonify({
        "message": gameState["message"],
        "player_hand": [card.image for card in gameState["player_hand"]],
        "dealer_hand": [card.image for card in gameState["dealer_hand"]],
        "cardsLeft": gameState["remaining_cards"],
        "bestMove": gameState["best_move"],
        "bank_balance": gameState["bank_balance"]
    })

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
