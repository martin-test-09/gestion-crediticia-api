# Credit API

API REST para **Gestión Crediticia**. Administra usuarios, clientes, presupuestos de crédito automotor y consultas BCRA con arquitectura por capas: rutas, controladores, servicios y repositorios.

## Quick path

1. Instalá dependencias: `pnpm install`.
2. Copiá `.env.example` a `.env` y completá las variables.
3. Iniciá MongoDB o configurá Atlas.
4. Ejecutá `pnpm seed` para crear el usuario de prueba.
5. Iniciá la API con `pnpm dev`.

## Variables de entorno

| Variable | Uso | Ejemplo |
|---|---|---|
| `PORT` | Puerto HTTP | `3000` |
| `MONGODB_URI` | Conexión a MongoDB | `<mongodb-uri>` |
| `JWT_SECRET` | Firma de JWT | `<jwt-secret-largo>` |
| `GMAIL_USERNAME` | Cuenta remitente | `<gmail-username>` |
| `GMAIL_PASSWORD` | App password de Gmail | `<gmail-app-password>` |
| `URL_FRONTEND` | Origen CORS y link de verificación, sin barra final ni `*` | `http://localhost:5173` |
| `BCRA_MODE` | `real` o `demo` | `demo` |

> Para Gmail se recomienda activar 2FA y crear una contraseña de aplicación.

## Scripts

| Comando | Descripción |
|---|---|
| `pnpm dev` | Inicia Express con nodemon |
| `pnpm start` | Inicia Express con Node |
| `pnpm seed` | Crea usuario verificado y counter |
| `pnpm seed -- --with-demo` | Además crea clientes y presupuestos demo |

Usuario seed: `test@test.com` / `Test1234`.

## Respuestas

Todas las respuestas usan:

```json
{ "ok": true, "status": 200, "message": "Mensaje", "data": {} }
```

En error:

```json
{ "ok": false, "status": 400, "message": "Detalle del error" }
```

## Endpoints

Base URL local: `http://localhost:3000/api`.

| Método | Ruta | Auth | Body | Éxito | Errores principales |
|---|---|---:|---|---|---|
| GET | `/health` | No | — | 200 estado de API y MongoDB conectado | 503 MongoDB desconectado |
| POST | `/auth/register` | No | `nombre`, `email`, `password` | 201 usuario no verificado + email | 400, 409 |
| GET | `/auth/verify-email?verification_token=` | No | — | 200 email verificado | 400, 401, 404 |
| POST | `/auth/resend-verification` | No | `email` | 200 email reenviado o ya verificado | 400, 404, 503 si falla el envío de email |
| POST | `/auth/login` | No | `email`, `password` | 200 `data.access_token` | 401, 403 |
| GET | `/clientes` | Sí | — | 200 clientes activos | 401 |
| GET | `/clientes/:id` | Sí | — | 200 cliente | 400, 401, 404 |
| POST | `/clientes` | Sí | `nombre`, `email`, `cuit`, `telefono` | 201 cliente creado o reactivado | 400, 401, 409 |
| PUT | `/clientes/:id` | Sí | `nombre`, `email`, `cuit`, `telefono` | 200 cliente actualizado | 400, 401, 404, 409 |
| DELETE | `/clientes/:id` | Sí | — | 200 baja lógica | 400, 401, 404 |
| GET | `/presupuestos` | Sí | — | 200 presupuestos activos con cliente poblado | 401 |
| GET | `/presupuestos/:id` | Sí | — | 200 presupuesto | 400, 401, 404 |
| POST | `/presupuestos` | Sí | `cliente`, `vehiculo`, `anticipo`, `tasa`, `plazo`, `gastos`, `seguro`, `vigencia` | 201 presupuesto calculado | 400, 401, 404, 503 |
| PUT | `/presupuestos/:id` | Sí | Campos financieros y vehículo completos | 200 recalcula cuota | 400, 401, 404 |
| PATCH | `/presupuestos/:id/estado` | Sí | `estado: aprobado|rechazado` | 200 resuelve pendiente | 400, 401, 404, 409 |
| DELETE | `/presupuestos/:id` | Sí | — | 200 baja lógica | 400, 401, 404 |
| GET | `/bcra/:cuit` | Sí | — | 200 resultado normalizado | 400, 401, 503 |

## Reglas de negocio clave

| Tema | Regla |
|---|---|
| Clientes | CUIT de 11 dígitos; las listas excluyen `activo:false`; POST reactiva un cliente eliminado con el mismo CUIT |
| Presupuestos | `numero` se genera como `P-00001` con counter atómico |
| Edición | `cliente` y `cuit` de un presupuesto son inmutables |
| Cálculo | `monto_financiado = precio - anticipo`; `anticipo >= precio` devuelve 400 |
| Cuota | Sistema francés con TNA porcentual: `i = (TNA/100)/12` |
| BCRA | El estado se calcula con la peor situación informada |
| Baja lógica | Operaciones por ID sobre registros inactivos devuelven 404 |

## CUITs demo BCRA

Con `BCRA_MODE=demo`:

| CUIT | Resultado |
|---|---|
| `20000000001` | Situación 1 → aprobado |
| `20000000002` | Situación 2 → pendiente |
| `20000000003` | Situación 3 + refinanciaciones → pendiente |
| `20000000004` | Situación 4 → rechazado |
| `20000000005` | Situación 5 + proceso judicial → rechazado |
| `20000000006` | Entidades `[1, 3]`, peor 3 → pendiente |
| `20000000007` | Sin registros → aprobado |
| Cualquier otro CUIT válido | Sin registros → aprobado |

## Deploy

- Backend sugerido: Render Web Service.
- Base de datos: MongoDB Atlas M0.
- Configurar `URL_FRONTEND` con la URL exacta del deploy frontend, sin barra final y nunca con `*`.
- En evaluación se recomienda `BCRA_MODE=demo` para una demo determinística.
- Antes de la demo, abrir `GET /api/health` para calentar el servicio.
