# Lista de compras - API REST

Trabajo práctico integrador del Bootcamp 5.0 Devlights (módulo Node.js).
Autor: Almua Valentin

## De qué trata

Es una API para manejar la lista de compras del supermercado de una familia. Cualquier integrante puede cargar lo que falta en casa, y la persona que hace la compra (el encargado) es la única que puede marcar los productos como comprados y eliminarlos.

## Tecnologías

- Node.js con TypeScript
- Express
- PostgreSQL (yo usé Supabase) con Sequelize
- bcryptjs para encriptar las contraseñas
- jsonwebtoken (JWT) para el login
- dotenv para las variables de entorno

## Cómo correrlo

Necesitás tener Node.js instalado y una base de datos PostgreSQL, ya sea local o en la nube.

1. Clonar el repositorio e instalar las dependencias:

```bash
git clone https://github.com/almuavalentin/lista-compras-api
cd lista-compras-api
npm install
```

2. Copiar el archivo `.env.example` como `.env` y completar los valores:

```
PORT=3000
DATABASE_URL=la cadena de conexión de tu base
DB_SSL=true o false
JWT_SECRET=un texto largo y difícil de adivinar
```

`DB_SSL` va en `true` si la base está en la nube (como Supabase) y en `false` si es local. Si usás Supabase, la cadena de conexión tiene que ser la del Session pooler. Si falta `JWT_SECRET` o `DATABASE_URL`, el servidor no arranca y avisa cuál falta.

3. Iniciar el servidor:

```bash
npm run dev
```

La primera vez, las tablas se crean solas. El servidor queda en `http://localhost:3000`.

## Cómo está organizado

El código está separado en capas para que cada archivo tenga una sola responsabilidad. Hay un componente por cada entidad (`product` y `user`) y cada uno tiene:

- `*.routes.ts`: define las rutas.
- `*.controller.ts`: recibe el pedido y devuelve la respuesta (con try/catch).
- `*.service.ts`: tiene las validaciones y las reglas de negocio.
- `*.repository.ts`: es el único que habla con la base de datos.
- `*.model.ts`: describe cómo es la tabla.

Además:

- `middlewares/auth.middleware.ts`: verifica el token JWT (`authenticate`) y el rol del usuario (`requireRole`).
- `middlewares/logger.middleware.ts`: muestra en consola el método y la URL de cada petición.
- `components/associations.ts`: relación entre usuarios y productos.
- `config/`: conexión a la base y lectura de `JWT_SECRET`.
- `utils/httpError.ts`: errores con su código de estado.

## Usuarios y roles

| Rol | Qué puede hacer |
|---|---|
| member (integrante) | Ver la lista, agregar productos y modificarlos (menos el campo `purchased`) |
| shopper (encargado) | Todo lo anterior, más marcar productos como comprados y eliminarlos |

Cada producto guarda quién lo agregó (`userId`), y al consultarlo se muestra el nombre en `addedBy`.

## Autenticación

1. Registrarse con `POST /api/auth/register`.
2. Iniciar sesión con `POST /api/auth/login`, que devuelve un `token`.
3. En las rutas protegidas, mandar el token en el header:

```
Authorization: Bearer <token>
```

Las contraseñas se guardan encriptadas con bcrypt (nunca en texto plano). El token se firma con `JWT_SECRET`, vence a la hora y lleva solo el id y el rol del usuario, sin datos sensibles.

## Datos de un producto

| Campo | Qué es | Reglas |
|---|---|---|
| name | nombre del producto | obligatorio |
| quantity | cantidad | entero mayor a 0, por defecto 1 |
| category | categoría | una de: frutas_verduras, carnes, lacteos, panaderia, bebidas, limpieza, almacen, otros |
| notes | comentario | opcional, hasta 200 caracteres |
| purchased | si ya se compró | true o false, por defecto false. Solo el encargado puede cambiarlo |

## Endpoints

### Usuarios

| Método | Ruta | Qué hace | Códigos |
|---|---|---|---|
| POST | /api/auth/register | registra un usuario | 201, 400, 409, 500 |
| POST | /api/auth/login | inicia sesión y devuelve el token | 200, 400, 401, 500 |

Body de register (`role` es opcional y por defecto es `member`):

```json
{
  "name": "Ana",
  "email": "ana@mail.com",
  "password": "123456",
  "role": "member"
}
```

Body de login:

```json
{
  "email": "ana@mail.com",
  "password": "123456"
}
```

### Productos

| Método | Ruta | Qué hace | Quién puede | Códigos |
|---|---|---|---|---|
| GET | /api/products | devuelve todos los productos (acepta filtros) | cualquiera | 200, 400, 500 |
| GET | /api/products/:id | devuelve un producto | cualquiera | 200, 400, 404, 500 |
| POST | /api/products | crea un producto | usuario logueado | 201, 400, 401, 500 |
| PUT | /api/products/:id | modifica un producto | usuario logueado (para `purchased`, solo el encargado) | 200, 400, 401, 403, 404, 500 |
| DELETE | /api/products/:id | elimina un producto | solo el encargado | 200, 400, 401, 403, 404, 500 |

Filtros opcionales en `GET /api/products`:

- `?category=lacteos` devuelve solo los de esa categoría.
- `?purchased=false` devuelve solo los que faltan comprar (`true` para los ya comprados).
- Se pueden combinar: `?category=lacteos&purchased=false`.

Ejemplo de body para POST y PUT:

```json
{
  "name": "Leche",
  "quantity": 2,
  "category": "lacteos",
  "notes": "Proteica",
  "purchased": false
}
```

El PUT reemplaza todos los campos del producto, así que hay que mandarlos todos.

Cuando algo falla, la respuesta trae un mensaje, por ejemplo:

```json
{ "error": "La cantidad debe ser un número entero mayor a 0" }
```

Códigos de estado que uso:

- 200: todo bien / 201: creado
- 400: datos inválidos
- 401: falta el token, es inválido o venció, o el login es incorrecto
- 403: el usuario no tiene el rol necesario
- 404: no se encontró el producto
- 409: el email ya está registrado
- 500: error interno

## Pruebas

Las pruebas las hice con Thunder Client, incluyendo los casos de error (400, 401, 403 y 404). La colección exportada está en el archivo `thunder-tests.json`.

Para verlas y correrlas:

1. Instalar la extensión **Thunder Client** en VS Code.
2. Tener el servidor corriendo con `npm run dev`.
3. Abrir Thunder Client, ir a la pestaña **Collections**, hacer clic en el menú de los tres puntos y elegir **Import**.
4. Seleccionar el archivo `thunder-tests.json`.
5. Aparece la colección con todas las pruebas. Se ejecutan una por una con el botón **Send**.

Para las pruebas de rutas protegidas hay que registrar los usuarios, hacer login y pegar el token en la pestaña **Auth → Bearer** de cada request. Los tokens vencen a la hora, así que si aparece un 401 hay que volver a hacer login. Además, las pruebas que usan un id tienen un número fijo en la URL: si ese producto no existe en tu base, hay que cambiarlo por el id de uno que sí exista.

## Extras que hice

- Filtros con `req.query` (categoría y comprado).
- Roles: solo el encargado puede eliminar y marcar como comprado.
- Relación entre modelos: cada producto guarda qué usuario lo agregó.
- Middleware de logging.

## Cosas que se podrían mejorar

- Ahora cualquiera puede registrarse como encargado eligiendo el rol. En una app real el rol lo asignaría alguien con permisos.
- No hay una forma de que los usuarios pertenezcan a "una familia" distinta: hay una sola lista para todos.
- `sync({ alter: true })` es cómodo para desarrollo, pero en producción se usarían migraciones.
