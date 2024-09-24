import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'postgresql://ravertroter:debajodelpuente@localhost/ravertroters'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'super-secret-key')  # Cambia esto por una clave segura
