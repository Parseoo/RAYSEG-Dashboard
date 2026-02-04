# 🔍 DEBUG - Error 401 en Login

## Error Actual
```
401 (Unauthorized) - Las credenciales son rechazadas por Django
```

## ✅ Pasos para Diagnosticar

### 1. Verifica la Consola del Navegador
Ahora verás logs detallados:
```javascript
📤 Enviando petición de login: { url, data }
🔧 LoginApi - Enviando a: http://localhost:8001/api/auth/login
🔧 LoginApi - Datos: { email, password }
📋 Detalles del error: { status, data, headers }
```

### 2. Prueba el Endpoint Manualmente

Abre tu terminal y ejecuta:

```bash
# Prueba 1: Ver si el endpoint existe
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "tu-email@ejemplo.com", "password": "tu-password"}'
```

**Respuesta Esperada (200):**
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "tu-email@ejemplo.com",
    "name": "Usuario"
  }
}
```

**Si obtienes 401:**
```json
{
  "message": "Credenciales incorrectas",
  "error": "Invalid credentials"
}
```

### 3. Causas Comunes del Error 401

#### A) Las credenciales son incorrectas
- ❌ El email o password no coinciden con ningún usuario registrado
- ✅ Verifica que el usuario existe en Django Admin
- ✅ Verifica que la contraseña sea correcta

#### B) Django espera un formato diferente
Algunas APIs Django usan diferentes nombres de campo:

**Opción 1 (actual):**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Opción 2 (algunos Django usan):**
```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

**Opción 3 (otros Django usan):**
```json
{
  "identifier": "user@example.com",
  "password": "password123"
}
```

#### C) CORS está bloqueando la petición
Verifica en Django que CORS esté configurado correctamente:

```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

CORS_ALLOW_CREDENTIALS = True
```

#### D) El endpoint es diferente
Verifica las URLs de Django:
- ✅ `/api/auth/login` (actual)
- ❌ `/api/login`
- ❌ `/auth/login`
- ❌ `/api/token`

### 4. Verifica la Configuración de Django

Pregunta al desarrollador de Django:

**1. ¿Cuál es el endpoint correcto de login?**
```
Ejemplo: /api/auth/login, /api/token, etc.
```

**2. ¿Qué campos espera en el body?**
```json
{
  "email": "...",     // o "username"?
  "password": "..."
}
```

**3. ¿Qué devuelve cuando el login es exitoso?**
```json
{
  "token": "...",     // o "access_token", "jwt"?
  "user": { ... }     // o "user_data", "profile"?
}
```

**4. ¿Está usando Django Rest Framework Token o JWT?**
- DRF Token: `Token abc123...`
- JWT: `eyJhbGc...`

### 5. Prueba con Postman o Insomnia

1. Abre Postman
2. Crea una petición POST a `http://localhost:8001/api/auth/login`
3. En Headers: `Content-Type: application/json`
4. En Body (raw JSON):
```json
{
  "email": "admin@ejemplo.com",
  "password": "admin123"
}
```
5. Envía y verifica la respuesta

### 6. Verifica que el Usuario Existe

Entra al Django Admin:
```
http://localhost:8001/admin
```

Y verifica:
- ✅ El usuario existe
- ✅ El email es correcto
- ✅ El usuario está activo (`is_active = True`)
- ✅ La contraseña es la que estás usando

### 7. Crea un Usuario de Prueba en Django

Si no tienes usuario, créalo:

```bash
# En tu proyecto Django
python manage.py createsuperuser
```

Usa esas credenciales para probar el login.

---

## 🔧 Soluciones Rápidas

### Si Django espera "username" en vez de "email":

Actualiza `/lib/@type.ts`:
```typescript
export interface LoginForm {
  username: string  // En vez de "email"
  password: string
}
```

Y el login page:
```typescript
const response = await LoginApi({
  username: email,  // Envía el email como "username"
  password: password
});
```

### Si el endpoint es diferente:

Actualiza `/lib/api/auth/auth-api.ts`:
```typescript
export async function LoginApi(data: LoginForm) {
    return await axios.post('/api/token', data);  // o el endpoint correcto
}
```

---

## 📞 Información Necesaria del Backend

Contacta al desarrollador Django y pregunta:

1. ✅ Endpoint exacto de login
2. ✅ Campos que espera en el body
3. ✅ Formato del token que devuelve
4. ✅ Estructura del objeto user
5. ✅ ¿Está corriendo en `http://localhost:8001`?
6. ✅ ¿CORS está configurado para `http://localhost:3000`?
7. ✅ Credenciales de un usuario de prueba
