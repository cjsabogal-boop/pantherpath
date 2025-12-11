# 🚀 Guía Completa de Configuración - Sistema de Pagos y Emails

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
