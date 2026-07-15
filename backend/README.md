# Sistema de Farmacia — Backend (API REST)

Node.js + Express + Sequelize (MySQL), arquitectura **MVC**.

## Requisitos
- Node.js 22 o superior
- MySQL 8.x

## Instalación

```bash
npm install
cp .env.example .env   # ya viene una copia; ajusta credenciales de MySQL
```

Edita `.env` con los datos de tu base de datos:

```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=farmacia_db
DB_USER=root
DB_PASSWORD=tu_password
JWT_SECRET=un_secreto_seguro
```

## Base de datos

Ejecuta el script de la carpeta `../database/farmacia_db.sql` en MySQL:

```bash
mysql -u root -p < ../database/farmacia_db.sql
```

Incluye datos de prueba y un usuario administrador:
- **usuario:** `admin`
- **contraseña:** `admin123`

## Ejecutar

```bash
npm run dev     # con recarga automática (node --watch)
npm start       # producción
```

El servidor queda en `http://localhost:3000`.

## Estructura (MVC)

```
src/
├── config/database.js         # conexión Sequelize
├── models/                    # MODELOS (11 entidades + index con asociaciones 1:M)
├── controllers/               # CONTROLADORES (CRUD + auth + venta transaccional)
├── routes/                    # rutas REST por entidad
├── middlewares/               # JWT + manejo de errores
└── utils/crudController.js    # fábrica CRUD reutilizable
```

## Endpoints principales

Todos bajo el prefijo `/api`. Salvo `/auth/login`, requieren header
`Authorization: Bearer <token>`.

| Método | Ruta                       | Descripción                    |
|--------|----------------------------|--------------------------------|
| POST   | `/auth/login`              | Login, devuelve JWT            |
| GET    | `/auth/me`                 | Usuario autenticado            |
| CRUD   | `/roles`                   | Roles                          |
| CRUD   | `/presentaciones`          | Presentaciones                 |
| CRUD   | `/metodos-pago`            | Métodos de pago                |
| CRUD   | `/proveedores`             | Proveedores                    |
| CRUD   | `/clientes`                | Clientes                       |
| CRUD   | `/usuarios`                | Usuarios (password hasheado)   |
| CRUD   | `/medicamentos`            | Medicamentos                   |
| CRUD   | `/detalle-proveedores`     | Detalle de proveedores         |
| CRUD   | `/detalle-metodo-pago`     | Detalle de método de pago      |
| CRUD   | `/detalle-ventas`          | Detalle de ventas              |
| GET/POST/DELETE | `/ventas`         | Ventas (creación transaccional)|

### Crear una venta

```json
POST /api/ventas
{
  "id_usuario": 1,
  "id_cliente": 1,
  "id_metodo_pago": 1,
  "detalles": [
    { "id_medicamento": 1, "cantidad_detalle_venta": 2 },
    { "id_medicamento": 3, "cantidad_detalle_venta": 1 }
  ]
}
```

El backend calcula subtotales y total desde `precio_venta`, descuenta la
existencia de cada medicamento y registra el método de pago, todo en una
transacción.
