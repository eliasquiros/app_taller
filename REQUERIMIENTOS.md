# App del Taller – Requerimientos y Decisiones de Diseño

App web sencilla para gestionar un taller competitivo por **parejas o grupos de 3**. Los equipos acumulan puntos y los organizadores/jueces los suman o restan durante la competencia.

---

## 1. Decisiones técnicas

| Tema | Decisión |
|---|---|
| Framework | **Next.js** (App Router) |
| Lenguaje | **JavaScript** |
| Idioma de la interfaz | **Español** |
| Base de datos | **Supabase** (PostgreSQL) |
| Autenticación | **Supabase Auth** con usuario + contraseña (el usuario se convierte internamente a un correo ficticio, ej. `usuario@taller.local`) |
| Tiempo real | **Supabase Realtime** (la tabla de puntuación se actualiza sola) |
| Estilos / UI | **Tailwind CSS**, diseño **responsive mobile-first**, tema claro |
| Despliegue | **Vercel** (plan gratuito) + Supabase en la nube |

---

## 2. Usuarios y acceso

- Hay **un solo rol**: organizador/juez. Los participantes **no** inician sesión.
- Las cuentas se **crean manualmente desde Supabase**; no existe pantalla de registro.
- **Toda la app requiere sesión iniciada** (tabla de puntuación, lista de grupos, buscador, etc.). Sin sesión solo se ve el login.
- Inicio de sesión con **usuario y contraseña**.

---

## 3. Modelo de datos (PostgreSQL)

### `integrantes`
| Campo | Tipo | Notas |
|---|---|---|
| `id` | PK | |
| `nombre` | texto | obligatorio |
| `apellido` | texto | obligatorio |
| `equipo_id` | FK → `equipos.id` | **nullable** (null = integrante sin equipo) |

> Un integrante **solo puede pertenecer a un equipo** (garantizado al ser una única FK en el integrante).

### `equipos`
| Campo | Tipo | Notas |
|---|---|---|
| `id` | PK | |
| `nombre` | texto | obligatorio, único |
| `puntos` | entero | por defecto **3**, restricción `puntos >= 0` |

### `historial_puntos`
| Campo | Tipo | Notas |
|---|---|---|
| `id` | PK | |
| `usuario` | texto / FK a `auth.users` | quién hizo el cambio |
| `equipo_id` | FK → `equipos.id` | equipo afectado |
| `cantidad` | entero | positivo = suma, negativo = resta (valor ingresado por el usuario) |
| `fecha` | timestamptz (fecha y hora) | por defecto `now()`; se muestra con **día y hora hasta el minuto** y es el criterio de orden del historial |

---

## 4. Requerimientos funcionales

### RF-01 Inicio de sesión
- Formulario de usuario y contraseña; cierre de sesión disponible.
- Redirigir al login si no hay sesión.

### RF-02 Tabla de puntuación
- Muestra **todos los equipos** con **posición**, **nombre del equipo** y **puntos**.
- Orden por puntos de mayor a menor.
- **Empates:** equipos con los mismos puntos muestran **el mismo puesto**.
- Se actualiza en **tiempo real**.

### RF-03 Gestión de integrantes
- Crear integrantes con **nombre** y **apellido**.
- Los integrantes se crean **antes** e independientemente de los equipos.
- Poder editar y eliminar integrantes.

### RF-04 Registro de equipos
- Opción separada: **Crear equipo**.
- Se indica el **nombre del equipo** y se **seleccionan integrantes ya existentes** que **no tengan equipo asignado**.
- El equipo debe tener **2 o 3 integrantes** (validar).
- Un integrante **no puede estar en más de un equipo**.
- El equipo inicia con **3 puntos**.

### RF-05 Editar / eliminar equipos
- Editar nombre y cambiar integrantes (respetando 2–3 integrantes).
- Eliminar equipo (con confirmación). Sus integrantes **no se borran**: quedan sin equipo y disponibles para reasignarse.

### RF-06 Lista de grupos e integrantes
- Vista con todos los equipos y los nombres y apellidos de sus integrantes.

### RF-07 Búsqueda de grupo
- Un buscador por **nombre o apellido** de cualquier integrante.
- Devuelve el/los equipo(s) a los que pertenece(n) los integrantes coincidentes.
- Búsqueda parcial y sin distinguir mayúsculas/minúsculas ni tildes.

### RF-08 Sumar / restar puntos
- Seleccionar un equipo e ingresar una **cantidad entera** definida por el usuario.
- Acciones **sumar** o **restar**.
- Antes de confirmar se muestra la **cantidad actual** y la **nueva cantidad**.
- **Regla:** solo enteros y los puntos **nunca pueden ser menores a 0**. Si una resta dejaría el total por debajo de 0, el total **queda en 0** (no se rechaza). La pantalla de confirmación ya muestra 0 como nueva cantidad.
- La operación debe ser **atómica** en la base de datos (función RPC), para evitar errores si dos jueces modifican a la vez.

### RF-09 Historial de puntos (pestaña aparte)
- Pestaña independiente que lista cada cambio con: **usuario**, **cantidad**, **equipo** y **fecha y hora**.
- Se ordena del más reciente al más antiguo (por fecha y hora).
- Se registra automáticamente en cada suma/resta.

---

## 5. Pantallas / navegación

1. **Login**
2. **Tabla de puntuación** (inicio)
3. **Equipos** (lista de grupos e integrantes + buscador + modificar puntos + editar/eliminar)
4. **Integrantes** (crear/editar/eliminar integrantes)
5. **Crear equipo**
6. **Historial** (pestaña aparte)

---

## 6. Requerimientos no funcionales

- **Mobile-first**: pensada para usarse principalmente desde el celular.
- **Seguridad:** Row Level Security (RLS) en Supabase, solo usuarios autenticados pueden leer/escribir; las claves secretas nunca se exponen al cliente.
- **Simplicidad:** sin librerías pesadas; solo Next.js, Tailwind y el cliente de Supabase.
- **Variables de entorno:** `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

---

## 7. Supuestos pendientes de confirmar

Estos puntos no quedaron definidos explícitamente; tomé una decisión por defecto, pero puedes cambiarla:

1. **Numeración de puestos con empate:** estilo competencia (1, 1, 3) en vez de continuo (1, 1, 2).
2. **Orden dentro de un empate:** alfabético por nombre del equipo.
3. **Nombre de equipo:** obligatorio y único.
4. **Historial:** además de usuario, cantidad y equipo, se guarda la **fecha y hora (datetime con zona horaria)**, mostrada hasta el minuto. La `cantidad` registrada es la ingresada por el usuario, aunque el total se haya limitado a 0.
5. **Eliminar un equipo** libera a sus integrantes (no los borra). Si un equipo se elimina, sus registros de historial se conservan.
6. **Eliminar un integrante** que pertenece a un equipo con solo 2 integrantes no está permitido (dejaría al equipo con menos del mínimo).

---

## 8. Fuera de alcance (por ahora)

- Registro de usuarios desde la app.
- Roles diferenciados (admin/juez).
- Acceso público o de participantes.
- Modo oscuro.
- Puntos decimales o negativos.
- Motivo/comentario en el historial de puntos.
