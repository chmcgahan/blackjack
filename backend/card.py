class Card:

    def __init__(self, value, suit):
        self.value = value
        self.suit = suit
        self.image = f"/img/{value}{suit}.png"

        def __repr__(self):
            return f"{self.value}{self.suit}"