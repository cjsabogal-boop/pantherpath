# 🚀 Guía Completa de Configuración - Sistema de Pagos y Emails
## (Configuración 100% Remota - Sin instalación local)

## 📋 Resumen del Sistema

Este sistema automatiza completamente el flujo post-registro:
1. Usuario llena formulario → Datos van al CRM
2. **Email automático** con tabla de precios y botones de pago
3. Usuario hace clic y paga con Stripe/MercadoPago/PayPal
4. **Webhook** notifica al servidor del pago exitoso
5. **CRM se actualiza** automáticamente con estado "pagado"
6. **Email a nicole@pantherpath.co** con detalles del pago

---

## 🌐 Paso 1: Subir Código al Servidor (Ya está hecho ✅)

El código ya está en GitHub y se desplegará automáticamente en tu servidor.

---

## 📧 Paso 2: Configurar Email (Gmail)

### 2.1 Crear Contraseña de Aplicación en Gmail

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. **Seguridad** → **Verificación en dos pasos** (actívala si no está activa)
3. Busca **"Contraseñas de aplicaciones"**
4. Selecciona **"Correo"** y **"Otro (nombre personalizado)"**
5. Escribe **"Panther Path CRM"**
6. Copia la contraseña generada (16 caracteres, sin espacios)
   - Ejemplo: `abcd efgh ijkl mnop` → Guárdala como `abcdefghijklmnop`

### 2.2 Configurar en cPanel

1. **Accede a cPanel** de Namecheap
2. **File Manager** → Navega a `~/pantherpath/crm/`
3. **Busca o crea el archivo `.env`**
4. **Edita** y agrega estas líneas:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=nicole@pantherpath.co
EMAIL_PASSWORD=tu-contraseña-de-aplicacion-aqui
EMAIL_FROM="Panther Path <nicole@pantherpath.co>"
```

⚠️ **Importante:** Reemplaza `tu-contraseña-de-aplicacion-aqui` con la contraseña que copiaste.

---

## 💳 Paso 3: Configurar Stripe

### 3.1 Crear Cuenta en Stripe
1. Ve a https://dashboard.stripe.com/register
2. Completa el registro con tus datos
3. **Activa tu cuenta** (necesitarás info bancaria para recibir pagos reales)

### 3.2 Obtener API Keys
1. **Dashboard** → **Developers** → **API keys**
2. Copia la **Secret key**:
   - Para pruebas: `sk_test_...`
   - Para producción: `sk_live_...` (usa esta cuando estés lista)

### 3.3 Crear Productos y Payment Links

#### 📦 Producto 1: Sesión Piloto ($50)
1. **Dashboard** → **Products** → **Add product**
2. **Name:** `Sesión Piloto - Panther Path`
3. **Description:** `Una sesión de 60 minutos para conocernos y trabajar en tu reto más urgente`
4. **Pricing:** 
   - **One-time payment**
   - **Price:** `50` USD
5. **Save product**
6. Click en **"Create payment link"**
7. **Copia el link** (ejemplo: `https://buy.stripe.com/test_xxxxx`)

#### 📦 Producto 2: Acompañamiento Mensual ($80)
1. **Add product**
2. **Name:** `Acompañamiento Mensual - Panther Path`
3. **Description:** `2 sesiones al mes + acceso a comunidad privada + recursos exclusivos`
4. **Pricing:**
   - **Recurring**
   - **Billing period:** `Monthly`
   - **Price:** `80` USD
5. **Save** → **Create payment link**
6. **Copia el link**

#### 📦 Producto 3: Acompañamiento Premium ($110)
1. **Add product**
2. **Name:** `Acompañamiento Premium - Panther Path`
3. **Description:** `4 sesiones al mes + soporte directo vía WhatsApp + análisis de video personalizado`
4. **Pricing:**
   - **Recurring**
   - **Billing period:** `Monthly`
   - **Price:** `110` USD
5. **Save** → **Create payment link**
6. **Copia el link**

### 3.4 Configurar Webhook
1. **Dashboard** → **Developers** → **Webhooks**
2. **Add endpoint**
3. **Endpoint URL:** `https://pantherpath.co/api/webhooks/stripe`
4. **Events to send:**
   - Busca y selecciona: `checkout.session.completed`
   - Busca y selecciona: `payment_intent.succeeded`
5. **Add endpoint**
6. **Copia el Signing secret** (empieza con `whsec_...`)

### 3.5 Actualizar .env en cPanel
1. **cPanel** → **File Manager** → `~/pantherpath/crm/.env`
2. **Agrega estas líneas:**

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_tu_clave_secreta_aqui
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret_aqui
STRIPE_LINK_50=https://buy.stripe.com/tu-link-50
STRIPE_LINK_80=https://buy.stripe.com/tu-link-80
STRIPE_LINK_110=https://buy.stripe.com/tu-link-110
```

---

## 💰 Paso 4: Configurar MercadoPago

### 4.1 Crear Cuenta
1. Ve a https://www.mercadopago.com.co/developers
2. **Inicia sesión** o **crea una cuenta**
3. **Tus aplicaciones** → **Crear aplicación**
4. **Nombre:** `Panther Path`
5. **Crear aplicación**

### 4.2 Obtener Access Token
1. **Tu aplicación** → **Credenciales**
2. **Modo Producción** (cuando estés lista para pagos reales)
3. **Copia el Access Token** (empieza con `APP_USR-...`)

### 4.3 Crear Links de Pago
1. Ve a https://www.mercadopago.com.co/tools/create
2. **Crea 3 links de pago:**

#### Link 1: Sesión Piloto
- **Título:** Sesión Piloto - Panther Path
- **Precio:** 50 USD
- **Crear link** → Copia el link (ej: `https://mpago.la/xxxxx`)

#### Link 2: Acompañamiento Mensual
- **Título:** Acompañamiento Mensual
- **Precio:** 80 USD
- **Tipo:** Suscripción mensual
- **Crear link** → Copia el link

#### Link 3: Acompañamiento Premium
- **Título:** Acompañamiento Premium
- **Precio:** 110 USD
- **Tipo:** Suscripción mensual
- **Crear link** → Copia el link

### 4.4 Configurar Webhook
1. **Tu aplicación** → **Webhooks**
2. **URL:** `https://pantherpath.co/api/webhooks/mercadopago`
3. **Eventos:** Selecciona `payment`
4. **Guardar**

### 4.5 Actualizar .env en cPanel
```env
# MercadoPago Configuration
MERCADOPAGO_ACCESS_TOKEN=APP_USR-tu-access-token-aqui
MERCADOPAGO_LINK_50=https://mpago.la/tu-link-50
MERCADOPAGO_LINK_80=https://mpago.la/tu-link-80
MERCADOPAGO_LINK_110=https://mpago.la/tu-link-110
```

---

## 🅿️ Paso 5: Configurar PayPal

### 5.1 Crear Cuenta Business
1. Ve a https://www.paypal.com/bizsignup
2. Completa el registro
3. Verifica tu cuenta

### 5.2 Crear App en Developer Portal
1. https://developer.paypal.com/dashboard/applications
2. **Create App**
3. **App Name:** `Panther Path`
4. **App Type:** `Merchant`
5. **Create App**
6. **Copia:**
   - **Client ID**
   - **Secret** (click en "Show" para verlo)

### 5.3 Crear Botones de Pago
1. https://www.paypal.com/buttons/smart
2. **Crea 3 botones:**

#### Botón 1: Sesión Piloto
- **Tipo:** Buy Now
- **Precio:** 50 USD
- **Crear botón** → Copia el link

#### Botón 2: Acompañamiento Mensual
- **Tipo:** Subscribe
- **Precio:** 80 USD/mes
- **Crear botón** → Copia el link

#### Botón 3: Acompañamiento Premium
- **Tipo:** Subscribe
- **Precio:** 110 USD/mes
- **Crear botón** → Copia el link

### 5.4 Configurar Webhook
1. **Developer Dashboard** → **Webhooks**
2. **Add Webhook**
3. **URL:** `https://pantherpath.co/api/webhooks/paypal`
4. **Event types:** Selecciona `PAYMENT.CAPTURE.COMPLETED`
5. **Save**

### 5.5 Actualizar .env en cPanel
```env
# PayPal Configuration
PAYPAL_CLIENT_ID=tu-client-id-aqui
PAYPAL_CLIENT_SECRET=tu-client-secret-aqui
PAYPAL_MODE=live
PAYPAL_LINK_50=https://www.paypal.com/tu-link-50
PAYPAL_LINK_80=https://www.paypal.com/tu-link-80
PAYPAL_LINK_110=https://www.paypal.com/tu-link-110
```

---

## 🖥️ Paso 6: Desplegar en Servidor (cPanel)

### 6.1 Acceder a Terminal en cPanel
1. **cPanel** → **Terminal** (o **SSH Access**)
2. Navega al directorio del CRM:
```bash
cd ~/pantherpath/crm
```

### 6.2 Instalar Dependencias
```bash
npm install
```

Esto instalará automáticamente:
- nodemailer (emails)
- stripe (pagos Stripe)
- mercadopago (pagos MercadoPago)
- @paypal/checkout-server-sdk (pagos PayPal)

### 6.3 Verificar archivo .env
```bash
cat .env
```

Debe contener TODAS las credenciales que configuraste en los pasos anteriores.

### 6.4 Reiniciar el Servidor
```bash
# Si usas PM2
pm2 restart server

# O si usas node directamente
pkill node
node server.js &
```

### 6.5 Verificar que esté corriendo
```bash
pm2 status
# O
ps aux | grep node
```

Deberías ver el proceso corriendo en el puerto 3000.

---

## ✅ Paso 7: Probar el Sistema

### 7.1 Verificar que el servidor esté activo
Abre en tu navegador:
```
https://pantherpath.co/crm/api/health
```

Deberías ver:
```json
{"status":"ok","database":"connected"}
```

### 7.2 Probar Flujo Completo (Modo Prueba)

#### A. Registrar un contacto de prueba
1. Ve a tu sitio web: https://pantherpath.co
2. Llena el formulario de waitlist con **tu propio email**
3. Envía el formulario

#### B. Verificar email de bienvenida
1. Revisa tu bandeja de entrada
2. Deberías recibir un email con:
   - Mensaje de bienvenida personalizado
   - Tabla de precios con 3 planes
   - 9 botones de pago (3 por cada pasarela)

#### C. Probar un pago (Stripe en modo test)
1. Click en cualquier botón de Stripe
2. Usa esta tarjeta de prueba:
   - **Número:** `4242 4242 4242 4242`
   - **Fecha:** Cualquier fecha futura
   - **CVC:** `123`
   - **Email:** Tu email
3. Completa el pago

#### D. Verificar actualización del CRM
1. Ve a https://pantherpath.co/crm
2. Login con: `admin` / `admin123`
3. Busca tu contacto
4. Debería mostrar:
   - ✅ Payment Status: `paid`
   - ✅ Payment Method: `stripe`
   - ✅ Amount: `50.00` (o el monto que pagaste)
   - ✅ Transaction ID

#### E. Verificar email de notificación
1. Revisa el inbox de `nicole@pantherpath.co`
2. Deberías tener un email con:
   - Detalles del pago
   - Email del cliente
   - Monto y método de pago

---

## 🔐 Tarjetas de Prueba (Stripe)

```
✅ Pago exitoso:     4242 4242 4242 4242
❌ Pago rechazado:   4000 0000 0000 0002
💳 Requiere 3DS:     4000 0025 0000 3155

Fecha: Cualquier fecha futura (ej: 12/25)
CVC: Cualquier 3 dígitos (ej: 123)
```

---

## 🔄 Paso 8: Cambiar a Modo Producción

### Cuando estés lista para recibir pagos reales:

#### 8.1 Stripe
1. Dashboard → Developers → API keys
2. Copia las claves **LIVE** (empiezan con `sk_live_`)
3. Actualiza `.env`:
```env
STRIPE_SECRET_KEY=sk_live_tu_clave_real
```

#### 8.2 MercadoPago
1. Credenciales → Modo Producción
2. Copia el Access Token de producción
3. Actualiza `.env`

#### 8.3 PayPal
1. Cambia en `.env`:
```env
PAYPAL_MODE=live
```

#### 8.4 Reinicia el servidor
```bash
pm2 restart server
```

---

## 🆘 Solución de Problemas

### ❌ Email no se envía
**Síntomas:** El formulario se envía pero no llega email

**Solución:**
1. Verifica en cPanel Terminal:
```bash
cd ~/pantherpath/crm
pm2 logs server --lines 50
```

2. Busca errores relacionados con "email" o "SMTP"

3. Verifica que la contraseña de Gmail sea correcta:
```bash
cat .env | grep EMAIL_PASSWORD
```

4. Prueba manualmente desde cPanel Terminal:
```bash
curl -X POST https://pantherpath.co/crm/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"tu-email@test.com","nombre":"Test"}'
```

### ❌ Webhook no funciona
**Síntomas:** Pago exitoso pero CRM no se actualiza

**Solución:**
1. Verifica logs del servidor:
```bash
pm2 logs server | grep webhook
```

2. Verifica en el dashboard de cada plataforma:
   - Stripe: Developers → Webhooks → Ver eventos recientes
   - MercadoPago: Webhooks → Historial
   - PayPal: Developer → Webhooks → Events

3. Asegúrate de que la URL sea accesible:
```bash
curl https://pantherpath.co/api/webhooks/stripe
```

### ❌ Servidor no inicia
**Síntomas:** Error al hacer `npm install` o `pm2 restart`

**Solución:**
1. Verifica versión de Node.js:
```bash
node --version
```
Debe ser v14 o superior.

2. Reinstala dependencias:
```bash
rm -rf node_modules package-lock.json
npm install
```

3. Verifica permisos:
```bash
chmod +x server.js
```

---

## 📊 Monitoreo del Sistema

### Ver logs en tiempo real
```bash
pm2 logs server --lines 100
```

### Ver estado del servidor
```bash
pm2 status
```

### Reiniciar si hay problemas
```bash
pm2 restart server
```

### Ver estadísticas de uso
```bash
pm2 monit
```

---

## 🎉 ¡Sistema Listo!

Una vez completados todos los pasos, tu sistema estará 100% automatizado:

1. ✅ **Usuario se registra** → Email automático con precios
2. ✅ **Usuario paga** → Webhook notifica al servidor
3. ✅ **CRM se actualiza** → Estado cambia a "pagado"
4. ✅ **Recibes notificación** → Email a nicole@pantherpath.co

**Todo funciona automáticamente, sin intervención manual. 🚀**

---

## 📞 Checklist Final

Antes de marcar como "listo", verifica:

- [ ] Email de Gmail configurado con contraseña de aplicación
- [ ] Stripe: 3 productos creados + 3 payment links + webhook configurado
- [ ] MercadoPago: 3 links de pago + webhook configurado
- [ ] PayPal: 3 botones + webhook configurado
- [ ] Archivo `.env` completo en el servidor
- [ ] Dependencias instaladas (`npm install`)
- [ ] Servidor corriendo (`pm2 status`)
- [ ] Prueba exitosa: formulario → email → pago → CRM actualizado

---

## 🔗 URLs Importantes

- **CRM:** https://pantherpath.co/crm
- **Health Check:** https://pantherpath.co/crm/api/health
- **Stripe Dashboard:** https://dashboard.stripe.com
- **MercadoPago Dashboard:** https://www.mercadopago.com.co/developers
- **PayPal Dashboard:** https://developer.paypal.com/dashboard

---

**¿Necesitas ayuda?** Revisa los logs del servidor con `pm2 logs server` y busca el error específico.

## 📋 Resumen del Sistema

Este sistema automatiza completamente el flujo post-registro:
1. Usuario llena formulario → Datos van al CRM
2. **Email automático** con tabla de precios y botones de pago
3. Usuario hace clic y paga con Stripe/MercadoPago/PayPal
4. **Webhook** notifica al servidor del pago exitoso
5. **CRM se actualiza** automáticamente con estado "pagado"
6. **Email a nicole@pantherpath.co** con detalles del pago

---

## 🛠️ Paso 1: Instalar Dependencias

```bash
cd /Users/carlossabogal/Desktop/pantherpath/pantherpath/crm
npm install
```

Esto instalará:
- `nodemailer` - Envío de emails
- `stripe` - Pagos con Stripe
- `mercadopago` - Pagos con MercadoPago
- `@paypal/checkout-server-sdk` - Pagos con PayPal

---

## 📧 Paso 2: Configurar Email (Gmail)

### 2.1 Crear Contraseña de Aplicación en Gmail

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. Seguridad → Verificación en dos pasos (actívala si no está activa)
3. Contraseñas de aplicaciones
4. Selecciona "Correo" y "Otro (nombre personalizado)"
5. Escribe "Panther Path CRM"
6. Copia la contraseña generada (16 caracteres)

### 2.2 Actualizar .env

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=nicole@pantherpath.co
EMAIL_PASSWORD=tu-contraseña-de-aplicacion-aqui
EMAIL_FROM="Panther Path <nicole@pantherpath.co>"
```

---

## 💳 Paso 3: Configurar Stripe

### 3.1 Crear Cuenta en Stripe
1. Ve a https://dashboard.stripe.com/register
2. Completa el registro
3. Activa tu cuenta (necesitarás info bancaria para recibir pagos)

### 3.2 Obtener API Keys
1. Dashboard → Developers → API keys
2. Copia:
   - **Secret key** (sk_test_... para pruebas, sk_live_... para producción)
   - **Publishable key** (pk_test_... o pk_live_...)

### 3.3 Crear Productos y Payment Links

#### Producto 1: Sesión Piloto ($50)
1. Dashboard → Products → Add product
2. Nombre: "Sesión Piloto - Panther Path"
3. Precio: $50 USD (one-time)
4. Guardar
5. Click en "Create payment link"
6. Copia el link (ej: https://buy.stripe.com/test_xxxxx)

#### Producto 2: Acompañamiento Mensual ($80)
1. Repetir proceso
2. Nombre: "Acompañamiento Mensual"
3. Precio: $80 USD (recurring - monthly)
4. Create payment link

#### Producto 3: Acompañamiento Premium ($110)
1. Repetir proceso
2. Nombre: "Acompañamiento Premium"
3. Precio: $110 USD (recurring - monthly)
4. Create payment link

### 3.4 Configurar Webhook
1. Dashboard → Developers → Webhooks
2. Add endpoint
3. URL: `https://pantherpath.co/api/webhooks/stripe`
4. Eventos a escuchar:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
5. Copia el **Signing secret** (whsec_...)

### 3.5 Actualizar .env
```env
STRIPE_SECRET_KEY=sk_live_tu_clave_secreta
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret
STRIPE_LINK_50=https://buy.stripe.com/tu-link-50
STRIPE_LINK_80=https://buy.stripe.com/tu-link-80
STRIPE_LINK_110=https://buy.stripe.com/tu-link-110
```

---

## 💰 Paso 4: Configurar MercadoPago

### 4.1 Crear Cuenta
1. Ve a https://www.mercadopago.com.co/developers
2. Crea una aplicación

### 4.2 Obtener Access Token
1. Tu aplicación → Credenciales
2. Copia el **Access Token** (de producción)

### 4.3 Crear Links de Pago
1. Ve a https://www.mercadopago.com.co/tools/create
2. Crea 3 links de pago:
   - $50 USD - Sesión Piloto
   - $80 USD - Acompañamiento Mensual
   - $110 USD - Acompañamiento Premium

### 4.4 Configurar Webhook
1. Tu aplicación → Webhooks
2. URL: `https://pantherpath.co/api/webhooks/mercadopago`
3. Eventos: `payment`

### 4.5 Actualizar .env
```env
MERCADOPAGO_ACCESS_TOKEN=APP_USR-tu-access-token
MERCADOPAGO_LINK_50=https://mpago.la/tu-link-50
MERCADOPAGO_LINK_80=https://mpago.la/tu-link-80
MERCADOPAGO_LINK_110=https://mpago.la/tu-link-110
```

---

## 🅿️ Paso 5: Configurar PayPal

### 5.1 Crear Cuenta Business
1. Ve a https://www.paypal.com/bizsignup
2. Completa el registro

### 5.2 Crear App en Developer Portal
1. https://developer.paypal.com/dashboard/applications
2. Create App
3. Copia:
   - Client ID
   - Secret

### 5.3 Crear Botones de Pago
1. https://www.paypal.com/buttons/smart
2. Crea 3 botones:
   - $50 USD
   - $80 USD (subscription)
   - $110 USD (subscription)

### 5.4 Configurar Webhook
1. Developer Dashboard → Webhooks
2. URL: `https://pantherpath.co/api/webhooks/paypal`
3. Eventos: `PAYMENT.CAPTURE.COMPLETED`

### 5.5 Actualizar .env
```env
PAYPAL_CLIENT_ID=tu-client-id
PAYPAL_CLIENT_SECRET=tu-client-secret
PAYPAL_MODE=live
PAYPAL_LINK_50=https://www.paypal.com/tu-link-50
PAYPAL_LINK_80=https://www.paypal.com/tu-link-80
PAYPAL_LINK_110=https://www.paypal.com/tu-link-110
```

---

## 🗄️ Paso 6: Actualizar Base de Datos

El servidor actualizará automáticamente la base de datos al iniciar, agregando las columnas:
- `payment_status`
- `payment_method`
- `payment_amount`
- `payment_currency`
- `transaction_id`
- `payment_date`

---

## 🚀 Paso 7: Desplegar en Servidor

### 7.1 Subir Archivos
```bash
# Desde tu máquina local
cd /Users/carlossabogal/Desktop/pantherpath/pantherpath
git add .
git commit -m "Add payment system and email automation"
git push origin main
```

### 7.2 En el Servidor (cPanel)
1. Terminal → `cd ~/pantherpath/crm`
2. `npm install`
3. Crear archivo `.env` con todas las credenciales
4. `pm2 restart server` (o `node server.js`)

---

## ✅ Paso 8: Probar el Sistema

### 8.1 Probar Email de Bienvenida
```bash
# Desde Postman o curl
curl -X POST https://pantherpath.co/crm/api/test-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{"email": "tu-email@test.com", "nombre": "Test User"}'
```

### 8.2 Probar Flujo Completo
1. Llena el formulario de waitlist en la web
2. Verifica que llegue el email con los botones de pago
3. Haz un pago de prueba (usa tarjetas de test de Stripe)
4. Verifica que:
   - El CRM se actualice con el pago
   - Te llegue email a nicole@pantherpath.co

---

## 🔐 Tarjetas de Prueba (Stripe)

```
Éxito: 4242 4242 4242 4242
Fallo: 4000 0000 0000 0002
Fecha: Cualquier fecha futura
CVC: Cualquier 3 dígitos
```

---

## 📊 Verificar en el CRM

El CRM ahora mostrará:
- Estado de pago (pending/paid)
- Método de pago usado
- Monto pagado
- ID de transacción
- Fecha de pago

---

## 🆘 Solución de Problemas

### Email no se envía
- Verifica que la contraseña de aplicación de Gmail sea correcta
- Revisa los logs del servidor: `pm2 logs`
- Prueba con el endpoint `/api/test-email`

### Webhook no funciona
- Verifica que la URL sea accesible públicamente
- Revisa que el webhook secret sea correcto
- Checa los logs en el dashboard de cada plataforma

### Pago no actualiza el CRM
- Verifica que el email del pagador coincida con el del contacto
- Revisa los logs del servidor
- Asegúrate de que los webhooks estén configurados correctamente

---

## 📞 Contacto

Si necesitas ayuda, revisa los logs del servidor:
```bash
pm2 logs server
```

O contacta al desarrollador con los detalles del error.

---

## 🎉 ¡Listo!

Tu sistema de pagos y emails está completamente configurado. Cada vez que alguien se registre:
1. ✅ Recibirá un email hermoso con opciones de pago
2. ✅ Podrá pagar con Stripe, MercadoPago o PayPal
3. ✅ El CRM se actualizará automáticamente
4. ✅ Recibirás una notificación del pago

**¡Automatización completa! 🚀**
