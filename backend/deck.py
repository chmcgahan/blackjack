import random
from card import Card

class Deck:
    def __init__(self):
        self.cards = []
        self.build_deck()

    def build_deck(self):
        values = list(range(1,11)) + [10,10,10]
        suits = ['H', 'S', 'C', 'D']
        self.cards = [Card(value, suit) for suit in suits for value in values]
        random.shuffle(self.cards)

    def shuffle(self):
        random.shuffle(self.cards)

    def draw_card(self):
        return self.cards.pop() if self.cards else None
    
    def remaining_cards(self):
        return len(self.cards)
    
    def sum_values(self, hand):
        return sum(card.value for card in hand)
    
    def __repr__(self):
        return f"Deck({self.cards})"