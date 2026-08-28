# ✨ CaterTrack Admin - Guía de Uso

## Para Usuarios (Sin conocimientos técnicos)

### 🎯 Objetivo
Crear y publicar productos en el catálogo sin editar código ni usar comandos.

### 📋 Antes de empezar
1. Tu equipo debe tener **Node.js** instalado (versión 16 o superior)
2. Git debe estar configurado con tus credenciales de GitHub

### 🚀 Iniciar el sistema (Opción 1: Terminal)

1. Abre una **terminal** o **cmd** en la carpeta del proyecto
2. Ejecuta:
   ```
   npm run dev
   ```
3. Espera a que aparezca el mensaje **"✅ Sistema listo"**
4. Abre tu navegador en: `http://localhost:3000/admin/`

### 🚀 Iniciar el sistema (Opción 2: Archivo ejecutable en Windows)

1. En la carpeta del proyecto, busca el archivo **`start-admin.bat`**
2. **Haz doble clic** en él
3. Se abrirá una ventana de terminal y luego el navegador
4. Sigue adelante con los pasos 5+

### 📝 Crear un producto

1. **Panel abierto**: Verás un formulario vacío en el centro
2. **Conectar carpeta** (solo la primera vez):
   - Haz clic en **"Abrir carpeta del proyecto"** (arriba a la derecha)
   - El navegador pedirá permiso. Haz clic en **"Permitir"**
   - Así se guardarán automáticamente las imágenes del producto

3. **Rellenar datos**:
   - **Nombre** *(obligatorio)*: "Cilindro hidráulico 320D"
   - **Referencia** (opcional): "CIL-320D-45"
   - **Categoría** *(obligatorio)*: Elige de la lista (ej: "Hidráulica")
   - **Subcategoría** *(obligatorio)*: Escribe o elige (ej: "Cilindros")
   - **Marca** *(obligatorio)*: "Caterpillar"
   - **Aplicación** *(obligatorio)*: "Excavadora 320D, 330D"
   - **Descripción** *(obligatorio)*: Describe el producto en 1-3 párrafos

4. **Subir imagen**:
   - Haz clic en **"Elegir archivo"** bajo "Imagen"
   - Selecciona una foto (JPG, PNG, WebP o SVG)
   - Verás una vista previa automática

5. **SEO automático**:
   - El sistema genera automáticamente:
     - **Slug** (URL limpia)
     - **Título SEO** (lo que Google mostrará)
     - **Meta description** (descripción en Google)
     - **Texto ALT** (descripción de imagen)
   - Puedes editarlos si lo necesitas

6. **Vista previa**:
   - Arriba a la derecha, elige **"Tarjeta"** o **"Página"**
   - Verás cómo se verá en el catálogo público
   - Si algo no te gusta, ajusta los datos

### 💾 Guardar producto

1. Haz clic en **"Guardar producto"** (abajo a la izquierda)
2. Verás el mensaje: **"Producto guardado localmente"**
3. El producto se guardará pero aún no será público

### 🌐 PUBLICAR PRODUCTO (El paso más importante)

1. Haz clic en **"PUBLICAR PRODUCTO"** (el botón azul grande, abajo a la derecha)
2. Verás una ventana con el progreso:
   - ✓ Generador ejecutado
   - ✓ Archivos modificados
   - ✓ Archivos validados
   - ✓ Cambios preparados
   - ✓ Commit creado
   - ✓ Cambios publicados en GitHub

3. Cuando termine:
   - Verás un link a tu producto publicado
   - El mensaje: **"Producto publicado exitosamente"**
   - Se publicará en el sitio web en 1-2 minutos

### ✅ Listo

Tu producto aparecerá en:
- La categoría correspondiente en `https://catertracksas.co/`
- Su propia página: `https://catertracksas.co/categoria/slug-producto/`
- En Google (después de 24-48 horas)

---

## 🆘 Solucionar problemas

### "El servicio local no está disponible"
- Cierra y abre nuevamente: `npm run dev`
- Espera el mensaje **"✅ Sistema listo"**
- Recarga el navegador (F5)

### "Error: no hay cambios para publicar"
- Significa que el producto es idéntico a uno anterior
- Modifica el nombre, descripción u otros datos
- Intenta publicar nuevamente

### "Error de conexión al publicar"
- Asegúrate de que la terminal muestra: **"📡 Servicio local escuchando en http://localhost:9999"**
- Si no aparece, reinicia: `npm run dev`

### "No veo mi producto publicado"
- Espera 1-2 minutos (GitHub Pages actualiza con retraso)
- Recarga la página con Ctrl+F5 (vaciando caché)
- Revisa que la URL sea correcta

### "Tengo una pregunta técnica"
- Contacta al equipo de desarrollo
- No intentes ejecutar comandos si no sabes qué hacen

---

## 🎓 Datos adicionales

**¿Qué es publicar?**
- Guardar: Almacena los datos en tu computadora
- Publicar: Sube los datos a GitHub y el sitio web los muestra al mundo

**¿Dónde se guardan las imágenes?**
- Carpeta: `assets/images/products/`
- Nombradas automáticamente por el slug del producto

**¿Puedo editar un producto ya publicado?**
- Sí, búscalo en el panel, modifica los datos y pulsa "PUBLICAR PRODUCTO" nuevamente
- Los cambios aparecerán en 1-2 minutos

**¿Y si me equivoco?**
- Puedes despublicar un producto haciendo clic en **"Despublicar"**
- Esto lo oculta del catálogo público

---

**¡Listo para crear tu primer producto! 🚀**
