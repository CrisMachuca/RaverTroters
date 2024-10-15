
# RaverTroters

RaverTroters es una tienda online para la compra de ropa y accesorios para festivales de música electrónica. Los usuarios pueden navegar por productos, agregarlos
al carrito y realizar compras de manera segura. También pueden dejar reseñas sobre los productos que han adquirido. El proyecto está desarrollado con un enfoque full stack, 
utilizando React en el frontend y Flask en el backend.


## Características

- Autenticación de usuarios (registro e inicio de sesión).
- Carrito de compras persistente (asociado al usuario).
- Administración de productos con categorías y opciones destacadas.
- Sistema de reseñas con calificación por estrellas.
- Productos relacionados.
- Dashboard de administrador para gestionar productos y categorías.
- Integración con Stripe para pagos.


## Documentation

### Pasos para la instalación

#### Clonar el repositorio

git clone https://github.com/tuusuario/ravertroters.git

cd ravertroters

### Ejecutar back
cd backend
venv\Scripts\activate
flask run

### Ejecutar front
cd front
npm run dev

### Requisitos previos

- Node.js (>=14.x)
- Python (>=3.8)
- PostgreSQL

### Configurar las variables de entorno 
en .env (crear un archivo .env en la carpeta backend):

FLASK_APP=app
FLASK_ENV=development
SECRET_KEY=your_secret_key
DATABASE_URL=postgresql://username:password@localhost/ravertroters_db
STRIPE_SECRET_KEY=your_stripe_secret_key
CLOUDINARY_URL=cloudinary://your_cloudinary_credentials

### Crear las tablas en la base de datos:
flask db migrate -m "creo la tabla x"

flask db upgrade




## Uso

- Usuarios
Los usuarios pueden registrarse y acceder a su cuenta.
Pueden buscar productos, ver los detalles de los productos y agregar productos a su carrito.
Pueden escribir reseñas de productos, valorando con estrellas.
El sistema de pago está integrado mediante Stripe, lo que permite realizar pagos de manera segura.
- Administradores
Los administradores pueden agregar, editar o eliminar productos desde el dashboard.
Los administradores pueden gestionar categorías y ver estadísticas de ventas.




## 🛠 Skills
### Frontend

- **React** (Vite)
- **Tailwind CSS** para el diseño responsive.
- **React Router** para la navegación en la aplicación.
- **Axios** para realizar peticiones al backend.
- **Context API** para el manejo del estado global (carrito de compras).

### Backend

- **Flask** (Python) como framework web.
- **Flask-JWT-Extended** para la autenticación basada en tokens JWT.
- **SQLAlchemy** como ORM.
- **PostgreSQL** como base de datos relacional.
- **Cloudinary** para la gestión de imágenes.
- **Stripe** para la integración de pagos.


## 🚀 Sobre mí
Soy full stack developer enfocada a resultados, sin miedo a los retos. Valoro y cuido mucho la experiencia de usuario, presto atención a cada detalle y me mantengo en aprendizaje constante.


## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://cristinamachuca.vercel.app/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/cristina-machuca-martinez/)


