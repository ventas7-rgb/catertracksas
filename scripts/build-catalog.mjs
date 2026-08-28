import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const baseUrl = "https://catertracksas.co";
const productsFile = path.join(root, "data/products.json");
const categoriesFile = path.join(root, "data/categories.json");
const productTemplateFile = path.join(root, "templates/product.html");
const categoryTemplateFile = path.join(root, "templates/category.html");

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;").replaceAll("'", "&#39;");
const jsonForHtml = (value) => JSON.stringify(value).replaceAll("</", "<\\/");
const slugify = (value) => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const valueOrPending = (value) => value?.trim() || "Por confirmar";
const assetPath = (image, prefix) => `${prefix}${String(image || "../assets/images/products/placeholder.svg").replace(/^\.\.\//, "")}`;
const args = new Set(process.argv.slice(2));
const requestedSlug = process.argv.find((arg) => arg.startsWith("--product="))?.split("=")[1];

const [products, categories, productTemplate, categoryTemplate] = await Promise.all([
  fs.readFile(productsFile, "utf8").then(JSON.parse),
  fs.readFile(categoriesFile, "utf8").then(JSON.parse),
  fs.readFile(productTemplateFile, "utf8"),
  fs.readFile(categoryTemplateFile, "utf8"),
]);

const errors = [];
const categoryMap = new Map(categories.map((category) => [category.slug, category]));
const slugs = new Set();
for (const product of products) {
  if (!product.name?.trim()) errors.push("Producto sin nombre");
  if (!product.slug?.trim()) errors.push(`${product.name || "Producto"}: falta slug`);
  if (slugs.has(product.slug)) errors.push(`${product.name}: slug duplicado (${product.slug})`);
  slugs.add(product.slug);
  if (!categoryMap.has(product.category)) errors.push(`${product.name}: categoría inexistente (${product.category})`);
  if (!product.subcategory?.trim()) errors.push(`${product.name}: falta subcategoría`);
  if (!product.description?.trim()) errors.push(`${product.name}: falta descripción`);
}
if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}
if (args.has("--validate")) {
  console.log(`Validación correcta: ${products.length} productos, ${categories.length} categorías.`);
  process.exit(0);
}

const published = products.filter((product) => product.published);
const selected = requestedSlug ? published.filter((product) => product.slug === requestedSlug) : published;
if (requestedSlug && selected.length === 0) throw new Error(`No existe un producto publicado con slug: ${requestedSlug}`);

const renderCard = (product, prefix = "") => categoryTemplate
  .replaceAll("{{subcategorySlug}}", slugify(product.subcategory))
  .replaceAll("{{productUrl}}", `${prefix}${product.category}/${product.slug}/`)
  .replaceAll("{{image}}", escapeHtml(assetPath(product.image, prefix || "../")))
  .replaceAll("{{alt}}", escapeHtml(product.alt || product.name))
  .replaceAll("{{subcategory}}", escapeHtml(product.subcategory))
  .replaceAll("{{name}}", escapeHtml(product.name))
  .replaceAll("{{reference}}", escapeHtml(valueOrPending(product.reference)))
  .replaceAll("{{brand}}", escapeHtml(valueOrPending(product.brand)))
  .replaceAll("{{application}}", escapeHtml(valueOrPending(product.application)))
  .replaceAll("{{description}}", escapeHtml(product.description))
  .replaceAll("{{whatsappName}}", encodeURIComponent(product.name));

const renderProduct = (product) => {
  const category = categoryMap.get(product.category);
  const canonical = `${baseUrl}/${product.category}/${product.slug}/`;
  const seoTitle = product.seoTitle?.trim() || `${product.name} | CaterTrack`;
  const metaDescription = product.metaDescription?.trim() || `${product.name}${product.application ? ` para ${product.application}` : ""}. ${product.description}`;
  const image = assetPath(product.image, "../../");
  const productSchema = {
    "@context": "https://schema.org", "@type": "Product", name: product.name,
    description: product.description, image: `${baseUrl}/${image.replace(/^\.\.\//, "")}`,
    category: category.name, ...(product.reference ? { sku: product.reference } : {}),
    brand: { "@type": "Brand", name: valueOrPending(product.brand) },
  };
  const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: `${baseUrl}/` },
    { "@type": "ListItem", position: 2, name: category.name, item: `${baseUrl}/${category.slug}/` },
    { "@type": "ListItem", position: 3, name: product.name, item: canonical },
  ]};
  const related = products.filter((candidate) => product.relatedProducts?.includes(candidate.slug) && candidate.published);
  const relatedProducts = related.length ? `<section class="catalog-products" aria-labelledby="related-title"><h2 id="related-title">Productos relacionados</h2><div class="product-grid">${related.map((item) => renderCard(item, "../../")).join("")}</div></section>` : "";
  return productTemplate.replaceAll("{{seoTitle}}", escapeHtml(seoTitle)).replaceAll("{{metaDescription}}", escapeHtml(metaDescription))
    .replaceAll("{{canonical}}", canonical).replaceAll("{{productSchema}}", jsonForHtml(productSchema))
    .replaceAll("{{breadcrumbSchema}}", jsonForHtml(breadcrumbSchema)).replaceAll("{{categorySlug}}", category.slug)
    .replaceAll("{{categoryName}}", escapeHtml(category.name)).replaceAll("{{subcategory}}", escapeHtml(product.subcategory))
    .replaceAll("{{name}}", escapeHtml(product.name)).replaceAll("{{image}}", escapeHtml(image))
    .replaceAll("{{alt}}", escapeHtml(product.alt || product.name)).replaceAll("{{description}}", escapeHtml(product.description))
    .replaceAll("{{reference}}", escapeHtml(valueOrPending(product.reference))).replaceAll("{{brand}}", escapeHtml(valueOrPending(product.brand)))
    .replaceAll("{{application}}", escapeHtml(valueOrPending(product.application))).replaceAll("{{whatsappName}}", encodeURIComponent(product.name))
    .replaceAll("{{relatedProducts}}", relatedProducts);
};

const outputDir = path.join(root, "generated");
await fs.mkdir(path.join(outputDir, "catalog-cards"), { recursive: true });
for (const product of selected) {
  const target = path.join(root, product.category, product.slug, "index.html");
  await fs.writeFile(path.join(outputDir, "catalog-cards", `${product.category}-${product.slug}.html`), renderCard(product));
  try { await fs.access(target); console.warn(`Omitido por existir: ${path.relative(root, target)}`); continue; } catch {}
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, renderProduct(product));
}

const catalogData = `window.caterTrackCatalog = ${JSON.stringify({ categories, products }, null, 2)};\n`;
await fs.writeFile(path.join(outputDir, "catalog-data.js"), catalogData);
const sitemapUrls = [`${baseUrl}/`, ...categories.map((category) => `${baseUrl}/${category.slug}/`), ...published.map((product) => `${baseUrl}/${product.category}/${product.slug}/`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...new Set(sitemapUrls)].map((url) => `  <url><loc>${url}</loc></url>`).join("\n")}\n</urlset>\n`;
await fs.writeFile(path.join(outputDir, "sitemap.xml"), sitemap);
console.log(`Generados: ${selected.length} producto(s), ${published.length} publicado(s).`);
console.log("Salida auxiliar: generated/catalog-data.js, generated/catalog-cards/ y generated/sitemap.xml");
