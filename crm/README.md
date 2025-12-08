# Panther Path CRM Backend

Sistema de gestión de contactos (CRM) para Panther Path con autenticación y seguimiento de leads.

## 🚀 Instalación

### 1. Instalar Node.js
Si no tienes Node.js instalado, descárgalo desde: https://nodejs.org/

### 2. Instalar dependencias
```bash
cd crm-backend
npm install
```

### 3. Iniciar el servidor
```bash
npm start
```

El servidor se iniciará en: **http://localhost:3000**

## 🔐 Acceso al CRM

### Credenciales por defecto:
- **Usuario**: `admin`
- **Contraseña**: `admin123`

**⚠️ IMPORTANTE**: Cambia la contraseña después del primer login.

## 📊 Funcionalidades

### Dashboard
- **Estadísticas en tiempo real**: Total de contactos, nuevos, contactados, en proceso, convertidos
- **Tabla de contactos**: Vista completa de todos los leads
- **Filtros**: Por estado (nuevo, contactado, en proceso, convertido, no interesado)

### Gestión de Contactos
- **Ver detalles completos**: Toda la información del formulario
- **Cambiar estado**: Seguimiento del proceso de cada contacto
- **Agregar notas**: Sistema de notas para hacer seguimiento
- **Historial**: Todas las notas con fecha y usuario

### Estados disponibles:
1. **Nuevo**: Contacto recién llegado
2. **Contactado**: Ya se hizo el primer contacto
3. **En Proceso**: En conversación activa
4. **Convertido**: Cliente confirmado
5. **No Interesado**: No continuó el proceso

## 🔗 Integración con el Formulario

### Actualizar el formulario para enviar al CRM:

En `script.js`, actualiza la función `submitToWaitlist`:

```javascript
async function submitToWaitlist(data) {
    try {
        const response = await fetch('http://localhost:3000/api/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('Contacto guardado en CRM');
            return true;
        }
    } catch (error) {
        console.error('Error enviando al CRM:', error);
        // Fallback a localStorage
        saveToLocalStorage(data);
    }
}
```

## 📁 Estructura de Datos

Los contactos se guardan en: `crm-backend/data/contacts.json`

Cada contacto incluye:
- Información personal (nombre, email, país, teléfono)
- Experiencia ecuestre
- Disciplina
- Retos identificados
- Objetivos
- Motivación
- Historial de coaching
- Proceso ideal deseado
- Comentarios adicionales
- Estado actual
- Notas de seguimiento
- Fechas de creación y actualización

## 🛠️ Desarrollo

### Modo desarrollo (con auto-reload):
```bash
npm run dev
```

### Estructura del proyecto:
```
crm-backend/
├── server.js           # Servidor Express
├── package.json        # Dependencias
├── data/              # Base de datos JSON
│   ├── users.json     # Usuarios del sistema
│   └── contacts.json  # Contactos del waitlist
└── public/            # Frontend del CRM
    ├── index.html     # Dashboard
    └── dashboard.js   # Lógica del dashboard
```

## 🔒 Seguridad

- Autenticación con JWT
- Contraseñas hasheadas con bcrypt
- Tokens con expiración de 24 horas
- Rutas protegidas con middleware de autenticación

## 📝 Notas Importantes

1. **Producción**: Cambiar `SECRET_KEY` en `server.js`
2. **CORS**: Configurado para desarrollo, ajustar para producción
3. **Base de datos**: Actualmente usa archivos JSON, migrar a MongoDB/PostgreSQL para producción
4. **Backup**: Los datos están en `data/contacts.json` - hacer backups regulares

## 🆘 Solución de Problemas

### El servidor no inicia:
- Verifica que el puerto 3000 esté libre
- Ejecuta `npm install` nuevamente

### No puedo hacer login:
- Verifica que el archivo `data/users.json` existe
- Credenciales: admin / admin123

### Los contactos no se guardan:
- Verifica que la carpeta `data/` tenga permisos de escritura
- Revisa la consola del servidor para errores

## 📞 Soporte

Para cualquier duda o problema, revisa los logs del servidor en la terminal donde ejecutaste `npm start`.
