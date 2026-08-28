# Guia Manual De Productos

Esta guia sirve para agregar productos sin panel, servidor ni generador automatico.

## Estructura De Rutas

Cada producto tiene dos piezas que deben usar el mismo nombre de carpeta:

```text
tren-de-rodaje/
  index.html                         <- pagina de categoria con tarjetas
  segmento-oruga-prueba/
    index.html                       <- ficha individual del producto
```

La tarjeta de `tren-de-rodaje/index.html` enlaza a la ficha asi:

```html
<a href="segmento-oruga-prueba/">Ver ficha del producto</a>
```

Desde la ficha individual:

```html
<a href="../../index.html">Inicio</a>
<a href="../index.html">Volver a la categoria</a>
```

`../../` sube desde `categoria/producto/` hasta la raiz del sitio. `../` sube solo desde `categoria/producto/` hasta la categoria.

## Crear Una Tarjeta

1. Copia un bloque completo `<article class="product-card">` de la pagina de categoria.
2. Cambia `data-subcategory` para que coincida con el filtro.
3. Cambia todos los enlaces `href="nombre-del-producto/"` por el nombre de la carpeta nueva.
4. Cambia imagen, texto alternativo, titulo, marca, aplicacion y descripcion.
5. Actualiza solamente el numero dentro de `<strong>` para la disponibilidad.

```html
<span class="product-card__availability">Disponibilidad: <strong>0</strong></span>
```

## Crear La Ficha Individual

1. Duplica una carpeta de producto de ejemplo, como `tren-de-rodaje/segmento-oruga-prueba/`.
2. Renombra la carpeta usando minusculas y guiones: `mi-producto/`.
3. Edita su `index.html`.
4. En el bloque SEO actualiza `title`, `meta name="description"` y `link rel="canonical"`.
5. El valor de `canonical` debe coincidir exactamente con la nueva URL:

```html
<link rel="canonical" href="https://catertracksas.co/tren-de-rodaje/mi-producto/">
```

6. Edita el `h1`, el texto de categoria, imagen, especificaciones, disponibilidad y enlace de WhatsApp.

## SEO Basico Necesario

Cada ficha individual debe conservar:

- Un solo `<h1>` con el nombre del producto.
- Un `<title>` descriptivo y unico.
- Una meta description unica.
- Una URL canonical con la ruta real.
- Texto `alt` descriptivo en la imagen.
- El bloque JSON-LD `Product` con nombre y marca actualizados.

## Sitemap

Para que Google encuentre una nueva ficha, agrega su URL a `sitemap.xml` antes de `</urlset>`:

```xml
<url><loc>https://catertracksas.co/tren-de-rodaje/mi-producto/</loc></url>
```

Despues publica los archivos nuevos mediante tu flujo normal de GitHub Pages.
