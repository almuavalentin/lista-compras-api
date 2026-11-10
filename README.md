# Lista de compras - API REST

Trabajo práctico integrador del Bootcamp 5.0 Devlights (módulo Node.js).
Autor: Almua Valentin

## De qué trata

Es una API para manejar la lista de compras del supermercado de una familia. La idea es que cualquier integrante pueda cargar lo que falta en casa y que la persona que hace la compra pueda marcar cada producto como comprado.

Por ahora está hecho el CRUD de productos. Todavía falta el registro y login de usuarios, los roles y la protección de rutas, que lo voy a agregar en la segunda semana.

## Tecnologías

- Node.js con TypeScript
- Express
- PostgreSQL (yo usé Supabase) con Sequelize
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
JWT_SECRET=un texto cualquiera (todavía no se usa)
```

`DB_SSL` va en `true` si la base está en la nube (como Supabase) y en `false` si es local. Si usás Supabase, la cadena de conexión tiene que ser la del Session pooler.

3. Iniciar el servidor:

```bash
npm run dev
```

La primera vez, las tablas se crean solas. El servidor queda en `http://localhost:3000`.

## Cómo está organizado

El código está separado en capas para que cada archivo tenga una sola responsabilidad:

- `product.routes.ts`: define las rutas.
- `product.controller.ts`: recibe el pedido y devuelve la respuesta.
- `product.service.ts`: tiene las validaciones y las reglas.
- `product.repository.ts`: es el único que habla con la base de datos.
- `product.model.ts`: describe cómo es un producto.

Además hay un archivo `database.ts` con la conexión y `httpError.ts` para manejar los errores con su código de estado.

## Datos de un producto

| Campo | Qué es | Reglas |
|---|---|---|
| name | nombre del producto | obligatorio |
| quantity | cantidad | entero mayor a 0, por defecto 1 |
| category | categoría | una de: frutas_verduras, carnes, lacteos, panaderia, bebidas, limpieza, almacen, otros |
| notes | comentario | opcional, hasta 200 caracteres |
| purchased | si ya se compró | true o false, por defecto false |

## Endpoints

| Método | Ruta | Qué hace | Códigos |
|---|---|---|---|
| GET | /api/products | devuelve todos los productos | 200, 500 |
| GET | /api/products/:id | devuelve un producto | 200, 400, 404, 500 |
| POST | /api/products | crea un producto | 201, 400, 500 |
| PUT | /api/products/:id | modifica un producto | 200, 400, 404, 500 |
| DELETE | /api/products/:id | elimina un producto | 200, 400, 404, 500 |

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

Cuando algo falla, la respuesta trae un mensaje, por ejemplo:

```json
{ "error": "La cantidad debe ser un número entero mayor a 0" }
```

## Pruebas

Las pruebas las hice con Thunder Client, incluyendo los casos de error (400 y 404). La colección exportada está en el archivo `thunder-tests.json`.

Para verlas y correrlas:

1. Instalar la extensión **Thunder Client** en VS Code.
2. Tener el servidor corriendo con `npm run dev`.
3. Abrir Thunder Client, ir a la pestaña **Collections**, hacer clic en el menú de los tres puntos y elegir **Import**.
4. Seleccionar el archivo `thunder-tests.json`.
5. Aparece la colección con todas las pruebas. Se ejecutan una por una con el botón **Send**.

Las pruebas que usan un id (obtener, modificar o eliminar un producto) tienen un número de id fijo en la URL. Si ese producto no existe en tu base, hay que cambiarlo por el id de un producto que sí exista (se ve en la respuesta del POST o en la respuesta del GET de todos los productos).

## Lo que falta

- Registro y login con Bcrypt y JWT
- Middleware para proteger las rutas que crean, modifican o eliminan
- Roles (miembro y encargado) y guardar quién agregó cada producto
- Pruebas del caso 401
