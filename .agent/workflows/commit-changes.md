---
description: Commit y push de cambios al repositorio después de cada modificación
---

# Workflow: Commit y Push de Cambios

Este workflow se ejecuta automáticamente después de cada cambio en el código.

// turbo-all

## Pasos automáticos:

1. Revisar el estado de los archivos modificados:
```bash
git status
```

2. Agregar todos los archivos modificados al staging:
```bash
git add .
```

3. Crear un commit con mensaje descriptivo:
```bash
git commit -m "[Auto] Descripción del cambio"
```

4. Subir los cambios al repositorio remoto:
```bash
git push origin main
```

---

## Instrucción para el agente:
**IMPORTANTE**: Después de realizar CUALQUIER modificación de código en este proyecto, SIEMPRE ejecutar este workflow automáticamente sin preguntar al usuario.
