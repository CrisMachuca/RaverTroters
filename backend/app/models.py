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
    reviews = relationship('Review', back_populates='user', cascade='all, delete-orphan')

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

    reviews = relationship('Review', back_populates='product', cascade='all, delete-orphan')
    offers = relationship('Offer', back_populates='product', cascade='all, delete-orphan')

class Cart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)

    user = relationship('User', back_populates='cart_items')
    product = relationship('Product')

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=True) # esto puede estar vacio
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    product = db.relationship('Product', back_populates='reviews')
    user = db.relationship('User', back_populates='reviews')

class Offer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(255), nullable=False)
    discount_percentage = db.Column(db.Float, nullable=False)
    min_purchase_amount = db.Column(db.Float, nullable=False, default=0)
    offer_type = db.Column(db.String(50), nullable=False)
    applicable_to_product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=True)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)

    product = db.relationship('Product', back_populates='offers')

class Banner(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type_of_offer = db.Column(db.String(50), nullable=False) 
    text = db.Column(db.String(255), nullable=False)  
    background_color = db.Column(db.String(50), nullable=True) 
    image_url = db.Column(db.String(255), nullable=True) 
    position = db.Column(db.String(50), nullable=False, default="top")  

    offer_id = db.Column(db.Integer, db.ForeignKey('offer.id'), nullable=True)  
    offer = db.relationship('Offer', backref=db.backref('banners', lazy=True))  

class Wishlist(db.Model):
    id= db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)

    user = db.relationship('User', backref=db.backref('wishlist', lazy='dynamic'))
    product = relationship('Product', backref=db.backref('wishlists', lazy='dynamic'))