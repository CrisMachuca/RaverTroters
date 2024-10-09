from . import db
from sqlalchemy.orm import relationship

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    products = relationship('Product', back_populates='category', cascade='all, delete-orphan')


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    cart_items = relationship('Cart', back_populates='user', cascade='all, delete-orphan')

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)  # Clave foránea
    category = relationship('Category', back_populates='products')  # Relación con Category
    is_featured = db.Column(db.Boolean, default=False)
    views = db.Column(db.Integer, default=0)
    sales = db.Column(db.Integer, default=0)
    image_url = db.Column(db.String(255))
    composition = db.Column(db.String(255)) 

class Cart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)

    user = relationship('User', back_populates='cart_items')
    product = relationship('Product')