from flask import Blueprint, jsonify, request
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from .models import User, Product, Cart, Category
from . import db
import cloudinary
import cloudinary.uploader
import cloudinary.api

main = Blueprint('main', __name__)

# Admin - Check if user is admin
def admin_required(fn):    
    @wraps(fn)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "User not found"}), 404
        if not user.is_admin:
            return jsonify({"message": "Unauthorized: Admin access only"}), 403
        return fn(*args, **kwargs)
    return decorated_function

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
        'category': product.category.name if product.category else None,
        'is_featured': product.is_featured,
        'views': product.views,
        'sales': product.sales,
        'image_url': product.image_url,
        'composition': product.composition
    } for product in products])

# Obtener productos destacados
@main.route('/featured-products', methods=['GET'])
def get_featured_products():
    category_id = request.args.get('category')  # Opción para filtrar por categoría si se proporciona
    if category_id:
        products = Product.query.filter_by(is_featured=True, category_id=category_id).all()
    else:
        products = Product.query.filter_by(is_featured=True).all()

    return jsonify([{
        'id': product.id,
        'name': product.name,
        'description': product.description,
        'price': product.price,
        'category': product.category.name if product.category else None,
        'is_featured': product.is_featured,
        'views': product.views,
        'sales': product.sales,
        'image_url': product.image_url
    } for product in products])


# Admin - add products
@main.route('/admin/products', methods=['POST'])
@admin_required
def add_product():
    data = request.form
    image = request.files.get('image')

    # Subir imagen a Cloudinary
    if image:
        upload_result = cloudinary.uploader.upload(image)
        image_url = upload_result.get('secure_url')
    else:
        image_url = None

    # Convertir el valor de is_featured a booleano
    is_featured_value = data.get('is_featured', 'false').lower() == 'true'

    new_product = Product(
        name=data['name'],
        description=data['description'],
        price=float(data['price']),  # Convertir el precio a float
        category_id=int(data['category_id']),  # Convertir el ID de categoría a entero
        is_featured=is_featured_value,  # Usar el valor booleano correcto
        image_url=image_url
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify({"message": "Product added successfully"}), 201

@main.route('/admin/products/<int:product_id>', methods=['PUT'])
@admin_required
def edit_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"message": "Product not found"}), 404
    
    data = request.form
    image = request.files.get('image')

    if image:
        print(f"Image received: {image.filename}")  # Agrega este log para verificar si se recibe la imagen
        upload_result = cloudinary.uploader.upload(image)
        product.image_url = upload_result.get('secure_url')

    # Validar otros campos
    if not data.get('name') or not data.get('description') or not data.get('price'):
        return jsonify({"message": "Missing required fields"}), 400

    # Convertir is_featured a booleano si es string
    is_featured_value = data.get('is_featured', 'false').lower() == 'true'

    # Actualizar los campos
    product.name = data['name']
    product.description = data['description']
    product.price = float(data['price'])
    product.is_featured = is_featured_value

    if 'category_id' in data and data['category_id']:
        product.category_id = int(data['category_id'])

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

# CATEGORIES

@main.route('/admin/categories', methods=['GET'])
@admin_required
def get_categories():
    categories = Category.query.all()
    return jsonify([{'id': category.id, 'name': category.name} for category in categories])

# Add new category
@main.route('/admin/categories', methods=['POST'])
@admin_required
def add_category():
    data = request.get_json()
    new_category = Category(name=data['name'])
    db.session.add(new_category)
    db.session.commit()
    return jsonify({'message': 'Category added successfully'}), 201

# Delete category
@main.route('/admin/categories/<int:category_id>', methods=['DELETE'])
@admin_required
def delete_category(category_id):
    category = Category.query.get(category_id)
    if not category:
        return jsonify({"message": "Category not found"}), 404

    db.session.delete(category)
    db.session.commit()
    return jsonify({'message': 'Category deleted successfully'}), 200


# Obtener un producto por su ID
@main.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify({
        'id': product.id,
        'name': product.name,
        'description': product.description,
        'price': product.price,
        'category_id': product.category_id,
        'is_featured': product.is_featured,
        'image_url': product.image_url,
        'composition': product.composition  # Asegúrate de tener este campo en el modelo
    })

