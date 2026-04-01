# Backend Django para productos y fincas

Este directorio contiene un backend Django nuevo para administrar productos y fincas.

## Instrucciones rápidas

1. Crear un entorno virtual:

   ```bash
   cd backend_django
   python3 -m venv env
   source env/bin/activate
   pip install -r requirements.txt
   ```

2. Crear migraciones y aplicar la base de datos:

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

3. Iniciar el servidor:

   ```bash
   python manage.py runserver
   ```

## Endpoints disponibles

- `GET /api/farms/`
- `POST /api/farms/`
- `GET /api/farms/<id>/`
- `PUT/PATCH /api/farms/<id>/`
- `DELETE /api/farms/<id>/`
- `GET /api/products/`
- `POST /api/products/`
- `GET /api/products/<id>/`
- `PUT/PATCH /api/products/<id>/`
- `DELETE /api/products/<id>/`

## Modelo

- `Farm`: nombre, dirección, descripción
- `Product`: nombre, tipo, peso, unidad, precio, descuento, foto, finca, stock, envío, descripción, activo
