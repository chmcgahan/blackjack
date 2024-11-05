import os
DATABASE_URI = os.getenv("DATABASE_URI", "postgresql://odoo:odoo@localhost/card_game_db")
