class Card:

    def __init__(self, value, suit):
        self.value = value
        self.suit = suit
        self.image = self.get_image_path()

    def get_image_path(self): 
        value_str = {11:"J", 12: "Q", 13: "K"}.get(self.value, str(self.value))
        return f"/img/{value_str}{self.suit}.png"

    def __repr__(self):
        return f"{self.value}{self.suit}"