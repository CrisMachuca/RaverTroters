from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from .config import Config
from flask_cors import CORS
import cloudinary
import cloudinary.uploader
import cloudinary.api

# Configuración de Cloudinary
cloudinary.config(
  cloud_name = "dpgju6aj2",  
  api_key = "182768845167919",        
  api_secret = "UzhOlxQhJ8Z9NQxW8iVGxqy66Jg"   
)

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    from .routes import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app
