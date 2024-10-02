from flask import Blueprint, jsonify, request
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from .models import User, Product, Cart
from . import db

main = Blueprint('main', __name__)

# Registro de usuarios
@main.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')

    new_user = User(username=data['username'], email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 201

# Inicio de sesión de usuarios
@main.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()

    if user and check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

# Ruta protegida
@main.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

# Account
@main.route('/account', methods=['GET'])
@jwt_required()
def get_account():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    return jsonify({
        'username': user.username,
        'email': user.email,
        'is_admin': user.is_admin,
    }), 200

# Products
@main.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([{
        'id': product.id,
        'name': product.name,
        'description': product.description,
        'price': product.price,
        'category': product.category,
        'views': product.views,
        'sales': product.sales
    } for product in products])
# Products - featured
@main.route('/featured-products', methods=['GET'])
def get_featured_products():
    products = Product.query.filter_by(is_featured=True).all()
    return jsonify([{
        'id': product.id,
        'name': product.name,
        'description': product.description,
        'price': product.price,
        'category': product.category,
        'is_featured': product.is_featured
    } for product in products])

# Cart
@main.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
    user_id = get_jwt_identity()
    cart_items = Cart.query.filter_by(user_id=user_id).all()

    cart_data = []
    for item in cart_items:
        cart_data.append({
            'id': item.product.id,
            'name': item.product.name,
            'price': item.product.price,
            'quantity': item.quantity
        })

    return jsonify(cart_data), 200

# Cart - Add products
@main.route('/cart', methods=['POST'])
@jwt_required()
def add_to_cart():
    user_id = get_jwt_identity()
    data = request.get_json()

    product_id = data['product_id']
    quantity = data.get('quantity', 1)

    cart_item = Cart.query.filter_by(user_id=user_id, product_id=product_id).first()

    if cart_item:
        cart_item.quantity += quantity
    else:
        new_cart_item = Cart(user_id=user_id, product_id=product_id, quantity=quantity)
        db.session.add(new_cart_item)

    db.session.commit()

    return jsonify({"message": "Product added to cart"}), 201

# Cart - Delete products
@main.route('/cart/<int:product_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(product_id):
    user_id = get_jwt_identity()
    cart_item = Cart.query.filter_by(user_id=user_id, product_id=product_id).first()

    if cart_item:
        db.session.delete(cart_item)
        db.session.commit()
        return jsonify({"message": "Product removed from cart"}), 200

    return jsonify({"message": "Product not found in cart"}), 404

# Cart - update quantity
@main.route('/cart', methods=['PUT'])
@jwt_required()
def update_cart():
    user_id = get_jwt_identity()
    data = request.get_json()

    product_id = data['product_id']
    quantity = data['quantity']

    cart_item = Cart.query.filter_by(user_id=user_id, product_id=product_id).first()

    if cart_item:
        cart_item.quantity = quantity
        db.session.commit()
        return jsonify({"message": "Cart updated"}), 200

    return jsonify({"message": "Product not found in cart"}), 404

# Ruta para registrar una venta
@main.route('/checkout', methods=['POST'])
@jwt_required()
def checkout():
    user_id = get_jwt_identity()
    data = request.get_json()

    # Suponiendo que data contiene una lista de productos comprados
    for item in data['products']:
        product = Product.query.get(item['product_id'])
        product.sales += item['quantity']  # Incrementar las ventas por la cantidad comprada

    db.session.commit()
    return jsonify({"message": "Compra realizada con éxito"}), 200


# Admin - Check if user is admin
def admin_required(fn):    
    @wraps(fn)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or not user.is_admin:
            return jsonify({"message": "Unauthorized"}), 403
        return fn(*args, **kwargs)
    return decorated_function

# Admin - Dashboard
@main.route('/admin/dashboard', methods=['GET'])
@admin_required
def admin_dashboard():
    # Aqui se agregan las estadisticas del dashboard
    return jsonify({"message": "Welcome to the admin dashboard"}), 200

#Admin - add products
@main.route('/admin/products', methods=['POST'])
@admin_required
def add_product():
    data = request.get_json()
    new_product = Product(
        name=data['name'],
        description=data['description'],
        price=data['price'],
        category=data['category'],
        is_featured=data.get('is_featured', False)
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify({"message": "Product added successfully"}), 201

# Admin - edit product
@main.route('/admin/products/<int:product_id>', methods=['PUT'])
@admin_required
def edit_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"message": "Product not found"}), 404
    
    data = request.get_json()
    product.name = data['name']
    product.description = data['description']
    product.price = data['price']
    product.category = data['category']
    product.is_featured = data.get('is_featured', product.is_featured)

    db.session.commit()
    return jsonify({"message": "Product updated successfully"}), 200

# Admin - Delete product
@main.route('/admin/products/<int:product_id>', methods=['DELETE'])
@admin_required
def delete_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"message": "Product not found"}), 404
    
    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Product deleted successfully"}), 200

# Admin - get stats
@main.route('/admin/product-stats', methods=['GET'])
@admin_required
def get_product_stats():
    products = Product.query.all()
    product_stats = [{
        'id': product.id,
        'name': product.name,
        'views': product.views,
        'sales': product.sales
    } for product in products]
    
    return jsonify(product_stats), 200