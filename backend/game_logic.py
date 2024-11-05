import random

# Deck with simplified values (e.g., Ace = 1, Face cards = 10)
deck = [1,2,3,4,5,6,7,8,9,10,10,10,10] * 4  # Adjust as needed

def shuffle_deck():
    global deck
    deck = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10] * 4  # Refill the deck
    random.shuffle(deck)

def draw_card():
    if len(deck) == 0:
        shuffle_deck()
    return deck.pop()

def calculate_hand_total(hand):
    total = sum(hand)
    # Check for Aces and adjust total if possible
    if 1 in hand and total + 10 <= 21:
        return total + 10
    return total

def determine_winner(player_hand, dealer_hand):
    player_total = calculate_hand_total(player_hand)
    dealer_total = calculate_hand_total(dealer_hand)
    
    if player_total > 21:
        return "Dealer wins!"
    elif dealer_total > 21 or player_total > dealer_total:
        return "Player wins!"
    elif dealer_total == player_total:
        return "Draw!"
    else:
        return "Dealer wins!"

