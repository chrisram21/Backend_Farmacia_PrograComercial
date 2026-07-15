-- =============================================================
--  SISTEMA DE FARMACIA - Script completo de base de datos MySQL
--  Motor: MySQL 8.x  |  Charset: utf8mb4
--  Modelo relacional normalizado - Cardinalidad únicamente 1:M
-- =============================================================
--  Orden de creación respetando dependencias de llaves foráneas:
--    rol, presentacion, metodos_pago, proveedores, cliente
--    -> usuario (rol)
--    -> medicamento (presentacion)
--    -> detalle_proveedores (proveedores, medicamento)
--    -> detalle_metodo_pago (metodos_pago)
--    -> venta (usuario, cliente, detalle_metodo_pago)
--    -> detalle_venta (venta, medicamento)
-- =============================================================

DROP DATABASE IF EXISTS farmacia_db;
CREATE DATABASE farmacia_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE farmacia_db;

-- -------------------------------------------------------------
-- Tablas "padre" (sin dependencias)
-- -------------------------------------------------------------

CREATE TABLE rol (
  id_rol       INT AUTO_INCREMENT PRIMARY KEY,
  nombre_rol   VARCHAR(255) NOT NULL,
  estado_rol   BOOLEAN NOT NULL DEFAULT TRUE,
  `timestamp`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE presentacion (
  id_presentacion     INT AUTO_INCREMENT PRIMARY KEY,
  nombre_presentacion VARCHAR(255) NOT NULL,
  estado_presentacion BOOLEAN NOT NULL DEFAULT TRUE,
  `timestamp`         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE metodos_pago (
  id_metodo_pago      INT AUTO_INCREMENT PRIMARY KEY,
  nombre_metodo_pago  VARCHAR(255) NOT NULL,
  estado_metodo_pago  BOOLEAN NOT NULL DEFAULT TRUE,
  `timestamp`         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE proveedores (
  id_proveedor        INT AUTO_INCREMENT PRIMARY KEY,
  nombre_proveedor    VARCHAR(255) NOT NULL,
  nit_proveedor       VARCHAR(255),
  telefono_proveedor  VARCHAR(255),
  estado_proveedor    BOOLEAN NOT NULL DEFAULT TRUE,
  `timestamp`         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE cliente (
  id_cliente    INT AUTO_INCREMENT PRIMARY KEY,
  nombre_cliente VARCHAR(255) NOT NULL,
  nit_cliente   VARCHAR(255),
  `timestamp`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- Tablas "hijas" nivel 1
-- -------------------------------------------------------------

-- rol (1) -> (M) usuario
CREATE TABLE usuario (
  id_usuario      INT AUTO_INCREMENT PRIMARY KEY,
  `user`          VARCHAR(255) NOT NULL UNIQUE,
  `password`      VARCHAR(255) NOT NULL,
  nombre_usuario  VARCHAR(255) NOT NULL,
  telefono_usuario VARCHAR(255),
  correo_usuario  VARCHAR(255),
  dpi_usuario     VARCHAR(255),
  estado_usuario  BOOLEAN NOT NULL DEFAULT TRUE,
  id_rol          INT NOT NULL,
  `timestamp`     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_usuario_rol
    FOREIGN KEY (id_rol) REFERENCES rol(id_rol)
) ENGINE=InnoDB;

-- presentacion (1) -> (M) medicamento
CREATE TABLE medicamento (
  id_medicamento            INT AUTO_INCREMENT PRIMARY KEY,
  codigo_medicamento        VARCHAR(255) NOT NULL,
  nombre_medicamento        VARCHAR(255) NOT NULL,
  cantidad_por_presentacion INT NOT NULL DEFAULT 1,
  precio_mayorista          DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  precio_minimo             DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  precio_venta              DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  componente                VARCHAR(255),
  estado_medicamento        ENUM('disponible','agotado','vencido') NOT NULL DEFAULT 'disponible',
  venta_libre               BOOLEAN NOT NULL DEFAULT TRUE,
  existencia_total          INT NOT NULL DEFAULT 0,
  id_presentacion           INT NOT NULL,
  `timestamp`               TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_medicamento_presentacion
    FOREIGN KEY (id_presentacion) REFERENCES presentacion(id_presentacion)
) ENGINE=InnoDB;

-- proveedores (1) -> (M) detalle_proveedores  |  medicamento (1) -> (M) detalle_proveedores
CREATE TABLE detalle_proveedores (
  id_detalle_proveedor      INT AUTO_INCREMENT PRIMARY KEY,
  id_proveedor              INT NOT NULL,
  id_medicamento            INT NOT NULL,
  precio_compra             DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  estado_detalle_proveedor  BOOLEAN NOT NULL DEFAULT TRUE,
  `timestamp`               TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_detprov_proveedor
    FOREIGN KEY (id_proveedor) REFERENCES proveedores(id_proveedor),
  CONSTRAINT fk_detprov_medicamento
    FOREIGN KEY (id_medicamento) REFERENCES medicamento(id_medicamento)
) ENGINE=InnoDB;

-- metodos_pago (1) -> (M) detalle_metodo_pago
CREATE TABLE detalle_metodo_pago (
  id_detalle_metodo_pago       INT AUTO_INCREMENT PRIMARY KEY,
  id_metodo_pago               INT NOT NULL,
  cantidad_detalle_metodo_pago DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  estado_detalle_metodo_pago   BOOLEAN NOT NULL DEFAULT TRUE,
  `timestamp`                  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_detmetodo_metodo
    FOREIGN KEY (id_metodo_pago) REFERENCES metodos_pago(id_metodo_pago)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- Tablas "hijas" nivel 2
-- -------------------------------------------------------------

-- usuario (1) -> (M) venta | cliente (1) -> (M) venta | detalle_metodo_pago (1) -> (M) venta
CREATE TABLE venta (
  id_venta                INT AUTO_INCREMENT PRIMARY KEY,
  fecha_venta             DATE NOT NULL,
  estado_venta            BOOLEAN NOT NULL DEFAULT TRUE,
  total_venta             DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  id_usuario              INT NOT NULL,
  id_detalle_metodo_pago  INT NOT NULL,
  id_cliente              INT NOT NULL,
  `timestamp`             TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_venta_usuario
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
  CONSTRAINT fk_venta_cliente
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
  CONSTRAINT fk_venta_detalle_metodo
    FOREIGN KEY (id_detalle_metodo_pago) REFERENCES detalle_metodo_pago(id_detalle_metodo_pago)
) ENGINE=InnoDB;

-- venta (1) -> (M) detalle_venta | medicamento (1) -> (M) detalle_venta
CREATE TABLE detalle_venta (
  id_detalle_venta        INT AUTO_INCREMENT PRIMARY KEY,
  id_venta                INT NOT NULL,
  id_medicamento          INT NOT NULL,
  cantidad_detalle_venta  INT NOT NULL DEFAULT 1,
  subtotal_venta          DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  estado_detalle_venta    BOOLEAN NOT NULL DEFAULT TRUE,
  `timestamp`             TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_detventa_venta
    FOREIGN KEY (id_venta) REFERENCES venta(id_venta),
  CONSTRAINT fk_detventa_medicamento
    FOREIGN KEY (id_medicamento) REFERENCES medicamento(id_medicamento)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- Índices auxiliares para las llaves foráneas más consultadas
-- -------------------------------------------------------------
CREATE INDEX idx_usuario_rol            ON usuario(id_rol);
CREATE INDEX idx_medicamento_present    ON medicamento(id_presentacion);
CREATE INDEX idx_detprov_prov           ON detalle_proveedores(id_proveedor);
CREATE INDEX idx_detprov_med            ON detalle_proveedores(id_medicamento);
CREATE INDEX idx_detmetodo_metodo       ON detalle_metodo_pago(id_metodo_pago);
CREATE INDEX idx_venta_usuario          ON venta(id_usuario);
CREATE INDEX idx_venta_cliente          ON venta(id_cliente);
CREATE INDEX idx_venta_detmetodo        ON venta(id_detalle_metodo_pago);
CREATE INDEX idx_detventa_venta         ON detalle_venta(id_venta);
CREATE INDEX idx_detventa_med           ON detalle_venta(id_medicamento);

-- =============================================================
--  DATOS DE PRUEBA (seed)
--  El password de ejemplo corresponde al texto plano "admin123"
--  hasheado con bcrypt (10 rounds). Úsalo para el primer login.
-- =============================================================

INSERT INTO rol (nombre_rol, estado_rol) VALUES
  ('Administrador', TRUE),
  ('Vendedor', TRUE),
  ('Bodeguero', TRUE);

INSERT INTO presentacion (nombre_presentacion) VALUES
  ('Tabletas'), ('Jarabe'), ('Cápsulas'), ('Inyectable'), ('Crema');

INSERT INTO metodos_pago (nombre_metodo_pago) VALUES
  ('Efectivo'), ('Tarjeta'), ('Transferencia');

INSERT INTO proveedores (nombre_proveedor, nit_proveedor, telefono_proveedor) VALUES
  ('Distribuidora Farma S.A.', '1234567-8', '2222-3333'),
  ('MediSupply Guatemala',     '8765432-1', '4444-5555');

INSERT INTO cliente (nombre_cliente, nit_cliente) VALUES
  ('Consumidor Final', 'CF'),
  ('Juan Pérez', '5556667-7');

-- Usuario admin (password en texto plano: admin123)
INSERT INTO usuario
  (`user`, `password`, nombre_usuario, telefono_usuario, correo_usuario, dpi_usuario, estado_usuario, id_rol)
VALUES
  ('admin',
   '$2a$10$LLA8xaxVSFMAp4kErOokpOjCoE0FmbxOZhnpNRYeMxx43p.PL0/2S',
   'Administrador del Sistema', '5555-0000', 'admin@farmacia.com', '1234567890101', TRUE, 1);

INSERT INTO medicamento
  (codigo_medicamento, nombre_medicamento, cantidad_por_presentacion,
   precio_mayorista, precio_minimo, precio_venta, componente,
   estado_medicamento, venta_libre, existencia_total, id_presentacion)
VALUES
  ('MED-001', 'Acetaminofén 500mg', 100, 0.50, 0.75, 1.00, 'Paracetamol', 'disponible', TRUE, 500, 1),
  ('MED-002', 'Amoxicilina 500mg',  50,  1.20, 1.80, 2.50, 'Amoxicilina', 'disponible', FALSE, 200, 3),
  ('MED-003', 'Jarabe para la tos', 30,  2.00, 3.00, 4.00, 'Dextrometorfano', 'disponible', TRUE, 80, 2);

INSERT INTO detalle_proveedores (id_proveedor, id_medicamento, precio_compra) VALUES
  (1, 1, 0.45), (1, 2, 1.10), (2, 3, 1.90);

-- =============================================================
--  Fin del script
-- =============================================================
