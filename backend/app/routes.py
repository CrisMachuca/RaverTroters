from flask import Blueprint, jsonify, request
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from .models import User, Product, Cart, Category, Review, Offer, Banner, Wishlist
from . import db
import cloudinary
import cloudinary.uploader
import cloudinary.api
  

main = Blueprint('main', __name__)


@main.route('/')
def index():
    return "Bienvenido a la API de RaverTroters", 200

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
    print(f"User ID: {user_id}")  # Log para verificar si se obtiene el token
    user = User.query.get(user_id)

    if user:
        return jsonify({
            'username': user.username,
            'email': user.email,
            'is_admin': user.is_admin,
        }), 200
    else: 
        return jsonify({"message": "User not found"}), 404

# Products
@main.route('/products', methods=['GET'])
def get_products():
    search = request.args.get('search', '')
    category_id = request.args.get('category_id')
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    is_featured = request.args.get('is_featured', type=bool)


    query = Product.query

    if search:
        query = query.filter(Product.name.ilike(f'%{search}%') | Product.description.ilike(f'%{search}%'))

    if category_id:
        query = query.filter_by(category_id=category_id)
    
    if min_price is not None and max_price is not None:
        query = query.filter(Product.price >= min_price, Product.price <= max_price)
    elif min_price is not None:  # Si solo se define min_price
        query = query.filter(Product.price >= min_price)
    elif max_price is not None:  # Si solo se define max_price
        query = query.filter(Product.price <= max_price)
        
        
    if is_featured:
        query = query.filter_by(is_featured=True)

    products = query.all()

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

@main.route('/product-suggestions', methods=['GET'])
def get_product_suggestions():
    search = request.args.get('search', '')
    if not search:
        return jsonify([])

    # Buscar productos que coincidan parcialmente con el nombre o la descripción
    suggestions = Product.query.filter(Product.name.ilike(f'%{search}%') | Product.description.ilike(f'%{search}%')).limit(5).all()

    return jsonify([{
        'id': product.id,
        'name': product.name
    } for product in suggestions])

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

# ADMIN - OFFERS

# Admin listar ofertas
@main.route('/admin/offers', methods=['GET'])
@admin_required
def get_offers():
    offers = Offer.query.all()
    return jsonify([{
        'id': offer.id,
        'description': offer.description,
        'discount_percentage': offer.discount_percentage,
        'min_purchase_amount': offer.min_purchase_amount,
        'offer_type': offer.offer_type,
        'applicable_to_product_id': offer.applicable_to_product_id,
        'start_date': offer.start_date,
        'end_date': offer.end_date
    } for offer in offers])

# Admin crear ofertas
@main.route('/admin/offers', methods=['POST'])
@admin_required
def add_offer():
    data = request.get_json()
    new_offer = Offer(
        description=data['description'],
        discount_percentage=data['discount_percentage'],
        min_purchase_amount=data.get('min_purchase_amount'),
        offer_type=data['offer_type'],
        applicable_to_product_id=data.get('applicable_to_product_id'),
        start_date=data['start_date'],
        end_date=data['end_date']
    )
    db.session.add(new_offer)
    db.session.commit()
    return jsonify({"messsge": "Offer added successfully"}), 201

# Admin eliminar oferta
@main.route('/admin/offers/<int:offer_id>', methods=['DELETE'])
@admin_required
def delete_offer(offer_id):
    offer = Offer.query.get_or_404(offer_id)
    db.session.delete(offer)
    db.session.commit()
    return jsonify({"message": "Offer deleted successfully"}), 200

from datetime import datetime

# Admin editar oferta
@main.route('/admin/offers/<int:offer_id>', methods=['PUT'])
@admin_required
def update_offer(offer_id):
    data = request.get_json()
    offer = Offer.query.get_or_404(offer_id)
    
    offer.description = data.get('description', offer.description)
    offer.discount_percentage = data.get('discount_percentage', offer.discount_percentage)
    offer.min_purchase_amount = data.get('min_purchase_amount', offer.min_purchase_amount)
    offer.offer_type = data.get('offer_type', offer.offer_type)
    offer.start_date = data.get('start_date', offer.start_date)
    offer.end_date = data.get('end_date', offer.end_date)

    db.session.commit()
    return jsonify({"message": "Offer updated successfully"}), 200


# obtener ofertas activas
@main.route('/offers', methods=['GET'])
def get_active_offers():
    current_date = datetime.now()
    offers = Offer.query.filter(Offer.start_date <= current_date, Offer.end_date >= current_date).all()
    return jsonify([{
        'id': offer.id,
        'description': offer.description,
        'discount_percentage': offer.discount_percentage,
        'min_purchase_amount': offer.min_purchase_amount,
        'start_date': offer.start_date,
        'end_date': offer.end_date
    } for offer in offers])


@main.route('/cart', methods=['POST'])
@jwt_required()
def add_to_cart():
    user_id = get_jwt_identity()
    data = request.get_json()
    product_id = data.get('product_id')
    
    if not product_id:
        return jsonify({"message": "Product ID is required"}), 400
    
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"message": "Product not found"}), 404

    cart_item = Cart.query.filter_by(user_id=user_id, product_id=product_id).first()
    
    if cart_item:
        # Incrementar la cantidad si el producto ya está en el carrito
        cart_item.quantity += 1
    else:
        # Si no está en el carrito, agregarlo
        cart_item = Cart(user_id=user_id, product_id=product_id, quantity=1)
        db.session.add(cart_item)
    
    db.session.commit()
    return jsonify({"message": "Product added to cart"}), 201

@main.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
    user_id = get_jwt_identity()
    cart_items = Cart.query.filter_by(user_id=user_id).all()

    if not cart_items:
        return jsonify({"message": "Cart is empty"}), 200

    cart_list = [{
        'product_id': item.product.id,
        'product_name': item.product.name,
        'price': item.product.price,
        'quantity': item.quantity
    } for item in cart_items]

    return jsonify(cart_list), 200

@main.route('/cart', methods=['PUT'])
@jwt_required()
def update_cart_item():
    user_id = get_jwt_identity()
    data = request.get_json()
    product_id = data.get('product_id')
    new_quantity = data.get('quantity')

    if not product_id or new_quantity is None:
        return jsonify({"message": "Product ID and new quantity are required"}), 400

    cart_item = Cart.query.filter_by(user_id=user_id, product_id=product_id).first()
    
    if not cart_item:
        return jsonify({"message": "Product not found in cart"}), 404

    if new_quantity < 1:
        db.session.delete(cart_item)
    else:
        cart_item.quantity = new_quantity

    db.session.commit()
    return jsonify({"message": "Cart updated successfully"}), 200

@main.route('/cart/<int:product_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(product_id):
    user_id = get_jwt_identity()
    
    # Buscar el producto en el carrito del usuario
    cart_item = Cart.query.filter_by(user_id=user_id, product_id=product_id).first()

    if not cart_item:
        return jsonify({"message": "Product not found in cart"}), 404

    # Eliminar el producto del carrito
    db.session.delete(cart_item)
    db.session.commit()
    
    return jsonify({"message": "Product removed from cart"}), 200


# LISTAS DE DESEOS

# Obtener lista de deseos
@main.route('/wishlist', methods=['GET'])
@jwt_required()
def get_wishlist():
    user_id = get_jwt_identity()
    wishlist = wishlist.query.filter.by(user_id=user_id).all()
    return jsonify([{
        'id': item.id,
        'product_id': item.product.id,
        'product_name': item.product.price,
    } for item in wishlist]), 200

# Agregar producto a la lista de deseos
@main.route('/wishlist', methods=['POST'])
@jwt_required()
def add_to_wishlist():
    user_id = get_jwt_identity()
    product_id = request.json.get('product_id')

    # Verificar si el producto está en la lista de deseos
    if Wishlist.query.filter_by(user_id=user_id, product_id=product_id).first():
        return jsonify({"message": "Product already in wishlist"}), 400
    # Agregar producto a la lista de deseos
    wishlist_item = Wishlist(user_id=user_id, product_id=product_id)
    db.session.add(wishlist_item)
    db.session.commit()
    return jsonify({"message": "Product added to wishlist"}), 200

# Ruta para eliminar un producto de la lista de deseos
@main.route('/wishlist/<int:product_id>', methods=['DETETE'])
@jwt_required()
def remove_from_wishlist(product_id):
    user_id = get_jwt_identity()
    wishlist_item = Wishlist.query.filter_by(user_id=user_id, product_id=product_id).firs()
    if wishlist_item:
        db.session.delete(wishlist_item)
        db.session.commit()
        return jsonify({"message": "Product removed from wishlist"}), 200
    return jsonify({"message": "Product not in wishlist"}), 404


# RESEÑAS

# OBTENER RESEÑAS
@main.route('/products/<int:product_id>/reviews', methods=['GET'])
def get_reviews(product_id):
    product = Product.query.get_or_404(product_id)
    reviews = Review.query.filter_by(product_id=product_id).all()
    
    review_list = [{
        'id': review.id,
        'rating': review.rating,
        'comment': review.comment,
        'created_at': review.created_at,
        'user': {
                'username': review.user.username  # Incluyendo el nombre de usuario del autor de la reseña
            }
    } for review in reviews]
    return jsonify(review_list), 200

# CREAR NUEVA RESEÑA
@main.route('/products/<int:product_id>/reviews', methods=['POST'])
@jwt_required()
def create_review(product_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validar que el usuario no haya dejado ya una reseña para este producto
    existing_review = Review.query.filter_by(product_id=product_id, user_id=user_id).first()
    if existing_review:
        return jsonify({"message": "You have already reviewed this product."}), 400

    new_review = Review(
        rating=data['rating'],
        comment=data.get('comment', ''),
        product_id=product_id,
        user_id=user_id
    )
    db.session.add(new_review)
    db.session.commit()
    return jsonify({"message": "Review added successfully"}), 201


# ADMINISTRAR BANNERS

@main.route('/admin/banners', methods=['POST'])
@admin_required
def create_banner():
    data = request.form
    image = request.files.get('image')

    # Subir imagen a Cloudinary (si se provee)
    image_url = None
    if image:
        upload_result = cloudinary.uploader.upload(image)
        image_url = upload_result.get('secure_url')

    # Verificar si offer_id está vacío o no
    offer_id = data.get('offer_id')
    if not offer_id or offer_id == 'null':  # Si es una cadena vacía o 'null', establecer como None
        offer_id = None

    new_banner = Banner(
        type_of_offer=data['type_of_offer'],
        text=data['text'],
        background_color=data['background_color'],
        image_url=image_url,
        position=data['position'],
        offer_id=offer_id  
    )
    db.session.add(new_banner)
    db.session.commit()
    return jsonify({"message": "Banner created successfully"}), 201

@main.route('/admin/banners/<int:banner_id>', methods=['PUT'])
@admin_required
def update_banner(banner_id):
    banner = Banner.query.get_or_404(banner_id)
    data = request.form
    image = request.files.get('image')

    # Actualizar los campos solo si están presentes en el formulario
    if 'type_of_offer' in data:
        banner.type_of_offer = data['type_of_offer']
    if 'text' in data:
        banner.text = data['text']
    if 'background_color' in data:
        banner.background_color = data['background_color']
    if 'position' in data:
        banner.position = data['position']
    if 'offer_id' in data and data['offer_id']:
        banner.offer_id = data['offer_id']

    # Subir nueva imagen solo si se proporciona una
    if image:
        upload_result = cloudinary.uploader.upload(image)
        banner.image_url = upload_result.get('secure_url')

    db.session.commit()
    return jsonify({"message": "Banner updated successfully"}), 200

@main.route('/admin/banners/<int:banner_id>', methods=['DELETE'])
@admin_required
def delete_banner(banner_id):
    banner = Banner.query.get_or_404(banner_id)
    db.session.delete(banner)
    db.session.commit()
    return jsonify({"message": "Banner deleted successfully"}), 200

# visualizar Banner

@main.route('/banners', methods=['GET'])
def get_banners():
    banners = Banner.query.all()  # Aquí obtienes todos los banners
    return jsonify([{
        'id': banner.id,
        'type_of_offer': banner.type_of_offer,
        'text': banner.text,
        'background_color': banner.background_color,
        'image_url': banner.image_url,
        'position': banner.position,
        'offer_id': banner.offer_id
    } for banner in banners])