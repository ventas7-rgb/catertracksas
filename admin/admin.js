const state = { products: [], categories: [], selected: -1, imageData: "", imageName: "", directory: null, serviceReady: false };
const $ = (id) => document.getElementById(id);
const fields = ["name", "reference", "category", "subcategory", "brand", "application", "description", "slug", "seoTitle", "metaDescription", "alt"];
const slugify = (value) => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;", "'":"&#39;"}[char]));
const toast = (message) => { $("toast").textContent = message; $("toast").classList.add("is-visible"); setTimeout(() => $("toast").classList.remove("is-visible"), 2600); };

async function checkLocalService() {
  try {
    const response = await fetch("http://localhost:9999/", { method: "OPTIONS", signal: AbortSignal.timeout(1500) });
    state.serviceReady = true;
    $("service-status").textContent = "✓ Servicio local conectado";
    $("service-status").className = "service-status is-ready";
    $("publish-product").disabled = false;
  } catch {
    state.serviceReady = false;
    $("service-status").textContent = "✗ Servicio local no disponible";
    $("service-status").className = "service-status";
    $("publish-product").disabled = true;
  }
}

async function loadData() {
  try {
    const [products, categories] = await Promise.all([fetch("../data/products.json").then((response) => response.json()), fetch("../data/categories.json").then((response) => response.json())]);
    state.products = products; state.categories = categories; renderCategoryOptions(); renderList(); newProduct();
  } catch { toast("Abre el panel desde un servidor local, por ejemplo con: npx serve ."); }
}
function renderCategoryOptions() { $("category").innerHTML = state.categories.map((category) => `<option value="${escapeHtml(category.slug)}">${escapeHtml(category.name)}</option>`).join(""); }
function renderSubcategories() { const category = state.categories.find((item) => item.slug === $("category").value); $("subcategory-options").innerHTML = (category?.subcategories || []).map((item) => `<option value="${escapeHtml(item)}">`).join(""); }
function renderList() { const query = $("product-search").value.toLowerCase(); $("product-list-items").innerHTML = state.products.map((product, index) => ({ product, index })).filter(({ product }) => product.name.toLowerCase().includes(query) || product.slug.includes(query)).map(({ product, index }) => `<button class="product-list-item ${index === state.selected ? "is-active" : ""}" data-index="${index}">${escapeHtml(product.name)}<small>${product.published ? "Publicado" : "Borrador"} · ${escapeHtml(product.category)}</small></button>`).join("") || `<p class="hint">No hay coincidencias.</p>`; document.querySelectorAll(".product-list-item").forEach((button) => button.addEventListener("click", () => selectProduct(Number(button.dataset.index)))); }
function formProduct() { const product = Object.fromEntries(fields.map((field) => [field, $(field).value.trim()])); product.relatedProducts = [...$("relatedProducts").selectedOptions].map((option) => option.value); product.published = state.selected >= 0 ? Boolean(state.products[state.selected].published) : false; product.image = state.imageData || (state.selected >= 0 ? state.products[state.selected].image : ""); return product; }
function fillForm(product) { fields.forEach((field) => { $(field).value = product[field] || ""; }); state.imageData = product.image || ""; state.imageName = product.image?.split("/").pop() || ""; $("image-name").textContent = state.imageName || "No se ha seleccionado una imagen."; renderSubcategories(); $("relatedProducts").innerHTML = state.products.filter((item) => item.slug !== product.slug).map((item) => `<option value="${escapeHtml(item.slug)}" ${(product.relatedProducts || []).includes(item.slug) ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join(""); previewImage(state.imageData); updatePreview(); }
function newProduct() { state.selected = -1; $("form-title").textContent = "Nuevo producto"; fillForm({ category: state.categories[0]?.slug || "", published: false, relatedProducts: [] }); renderList(); }
function selectProduct(index) { state.selected = index; $("form-title").textContent = "Editar producto"; fillForm(state.products[index]); renderList(); }
function generateFields() { const name = $("name").value; if (!$("slug").dataset.edited) $("slug").value = slugify(name); if (!$("seoTitle").dataset.edited) $("seoTitle").value = name ? `${name} | CaterTrack` : ""; if (!$("alt").dataset.edited) $("alt").value = name; if (!$("metaDescription").dataset.edited) { const application = $("application").value; const description = $("description").value; $("metaDescription").value = name ? `${name}${application ? ` para ${application}` : ""}. ${description}`.slice(0, 160) : ""; } updatePreview(); }
function validate(product) { const errors = fields.filter((field) => !product[field] && ["reference"].indexOf(field) < 0).map((field) => `Falta ${field}`); const duplicate = state.products.some((item, index) => item.slug === product.slug && index !== state.selected); if (duplicate) errors.push("El slug ya existe"); if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(product.slug)) errors.push("El slug solo puede usar minúsculas, números y guiones"); return errors; }
function warnings(product) { const messages = []; if (product.description.length < 50) messages.push("La descripción es muy corta para aportar contexto."); if (product.metaDescription.length > 160) messages.push("La meta description supera 160 caracteres."); if (product.seoTitle.length > 60) messages.push("El título SEO supera 60 caracteres."); if (!product.image) messages.push("No hay imagen cargada."); $("warnings").innerHTML = messages.map((message) => `<p>${escapeHtml(message)}</p>`).join(""); }
function updatePreview() { const product = formProduct(); warnings(product); const image = state.imageData || "../assets/images/products/placeholder.svg"; const html = $("preview-mode").value === "card" ? `<article class="preview-card"><img src="${escapeHtml(image)}" alt="${escapeHtml(product.alt)}"><div><small>${escapeHtml(product.subcategory)}</small><h3>${escapeHtml(product.name || "Nombre del producto")}</h3><p>${escapeHtml(product.description || "Descripción del producto")}</p><strong>${escapeHtml(product.application || "Aplicación")}</strong></div></article>` : `<article class="preview-page"><small>CaterTrack / ${escapeHtml(product.category)} / ${escapeHtml(product.slug)}</small><h1>${escapeHtml(product.name || "Nombre del producto")}</h1><img class="image-preview is-visible" src="${escapeHtml(image)}" alt="${escapeHtml(product.alt)}"><p>${escapeHtml(product.description || "Descripción del producto")}</p><p><b>Marca:</b> ${escapeHtml(product.brand || "Por confirmar")}<br><b>Aplicación:</b> ${escapeHtml(product.application || "Por confirmar")}</p></article>`; $("preview-content").innerHTML = html; }
function saveProduct(publish = false) { const product = formProduct(); const errors = validate(product); if (errors.length) { toast(errors.join(". ")); return false; } product.published = publish; if (state.selected < 0) { state.products.push(product); state.selected = state.products.length - 1; } else state.products[state.selected] = product; $("status").textContent = publish ? "Publicado localmente" : "Guardado"; renderList(); fillForm(product); toast(publish ? "Producto listo para generar" : "Producto guardado"); return true; }
async function writeFile(handle, name, content) { const file = await handle.getFileHandle(name, { create: true }); const writable = await file.createWritable(); await writable.write(content); await writable.close(); }
async function writeImage(product) { if (!state.directory || !state.imageData?.startsWith("data:image/")) return; const match = state.imageData.match(/^data:image\/(jpeg|png|webp|svg\+xml);base64,(.+)$/); if (!match) return; const extension = match[1] === "jpeg" ? "jpg" : match[1].replace("+xml", ""); const bytes = Uint8Array.from(atob(match[2]), (character) => character.charCodeAt(0)); const assets = await state.directory.getDirectoryHandle("assets", { create: true }); const images = await assets.getDirectoryHandle("images", { create: true }); const products = await images.getDirectoryHandle("products", { create: true }); await writeFile(products, `${product.slug}.${extension}`, bytes); product.image = `../assets/images/products/${product.slug}.${extension}`; state.imageData = product.image; }
async function exportData() { const content = JSON.stringify(state.products, null, 2) + "\n"; if (state.directory) { await writeImage(state.products[state.selected]); await writeFile(await state.directory.getDirectoryHandle("data", { create: true }), "products.json", JSON.stringify(state.products, null, 2) + "\n"); toast("Producto guardado localmente."); return; } const blob = new Blob([content], { type: "application/json" }); const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "products.json"; link.click(); URL.revokeObjectURL(link.href); toast("Descarga products.json"); }
async function publishProduct() {
  if (!state.serviceReady) { toast("El servicio local no está disponible. Por favor, inicia CaterTrack Admin nuevamente."); return; }
  const product = formProduct(); const errors = validate(product); if (errors.length) { toast(errors.join(". ")); return; }
  product.published = true; if (state.selected < 0) { state.products.push(product); state.selected = state.products.length - 1; } else state.products[state.selected] = product;
  
  // Save product and image locally first
  $("status").textContent = "Guardando producto..."; $("publish-product").disabled = true;
  await exportData(); fillForm(product); renderList();
  
  // Show publishing dialog
  const dialogContent = `<div class="publish-dialog"><h3>Publicando producto...</h3><div id="publish-steps" class="publish-steps"></div><p id="publish-result"></p></div>`;
  const existingDialog = document.querySelector(".publish-dialog"); if (existingDialog) existingDialog.remove();
  const dialogDiv = document.createElement("div"); dialogDiv.innerHTML = dialogContent; dialogDiv.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;padding:2rem;border-radius:8px;box-shadow:0 20px 60px #10233f20;z-index:10000;max-width:500px;max-height:90vh;overflow-y:auto;font-family:DM Sans,sans-serif";
  document.body.appendChild(dialogDiv); const stepsDiv = $("publish-steps") || dialogDiv.querySelector("#publish-steps");
  
  try {
    const response = await fetch("http://localhost:9999/", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ command: "publish" }), signal: AbortSignal.timeout(60000)
    });
    
    const result = await response.json();
    
    if (result.noChanges) {
      const resultDiv = dialogDiv.querySelector("#publish-result") || dialogDiv.appendChild(Object.assign(document.createElement("p"), { id: "publish-result" }));
      resultDiv.innerHTML = `<strong>⚠️ Sin cambios nuevos</strong><br>${escapeHtml(result.details)}`;
      $("publish-product").disabled = false;
      return;
    }
    
    if (result.success) {
      (result.steps || []).forEach((s) => { const step = document.createElement("div"); step.style.cssText = "padding:.6rem;margin:.4rem 0;background:#f0f4f8;border-left:3px solid #f2b600;border-radius:3px"; step.innerHTML = `${escapeHtml(s.step)} <strong>${escapeHtml(s.status)}</strong>`; stepsDiv.appendChild(step); });
      const resultDiv = dialogDiv.querySelector("#publish-result") || dialogDiv.appendChild(Object.assign(document.createElement("p"), { id: "publish-result" }));
      resultDiv.innerHTML = `<strong style="color:#195da8">✓ Producto publicado exitosamente</strong><br>URL: <a href="${escapeHtml(result.productUrl)}" target="_blank" style="color:#195da8;text-decoration:underline">${escapeHtml(result.productUrl)}</a><br>Se publicará en GitHub en 1-2 minutos.`;
      $("status").textContent = "Publicado"; $("publish-product").disabled = false;
      setTimeout(() => { dialogDiv.remove(); }, 5000);
    } else {
      (result.steps || []).forEach((s) => { const step = document.createElement("div"); step.style.cssText = "padding:.6rem;margin:.4rem 0;background:#f0f4f8;border-left:3px solid #195da8;border-radius:3px"; step.innerHTML = `${escapeHtml(s.step)} <strong>${escapeHtml(s.status)}</strong>`; stepsDiv.appendChild(step); });
      const resultDiv = dialogDiv.querySelector("#publish-result") || dialogDiv.appendChild(Object.assign(document.createElement("p"), { id: "publish-result" }));
      resultDiv.innerHTML = `<strong style="color:#a72f2f">✗ Error: ${escapeHtml(result.error)}</strong><br>${result.details ? `<small>${escapeHtml(result.details)}</small>` : ""}`;
      $("publish-product").disabled = false;
    }
  } catch (err) {
    const resultDiv = dialogDiv.querySelector("#publish-result") || dialogDiv.appendChild(Object.assign(document.createElement("p"), { id: "publish-result" }));
    resultDiv.innerHTML = `<strong style="color:#a72f2f">✗ Error de conexión</strong><br>${err.name === "AbortError" ? "Timeout: la operación tardó demasiado." : escapeHtml(err.message)}`;
    $("publish-product").disabled = false;
  }
}
async function openFolder() { if (!window.showDirectoryPicker) { toast("Este navegador no permite guardar directamente. Usa la descarga de products.json."); return; } state.directory = await window.showDirectoryPicker({ mode: "readwrite" }); toast("Carpeta conectada. Guarda tus cambios desde el panel."); }
function previewImage(source) { const preview = $("image-preview"); if (source) { preview.src = source; preview.classList.add("is-visible"); } else { preview.removeAttribute("src"); preview.classList.remove("is-visible"); } }
$("product-form").addEventListener("input", (event) => { if (["slug", "seoTitle", "metaDescription", "alt"].includes(event.target.id)) event.target.dataset.edited = "true"; generateFields(); });
$("category").addEventListener("change", renderSubcategories); $("product-search").addEventListener("input", renderList); $("preview-mode").addEventListener("change", updatePreview); $("new-product").addEventListener("click", newProduct); $("open-folder").addEventListener("click", openFolder); $("save-product").addEventListener("click", () => saveProduct(false) && exportData()); $("publish-product").addEventListener("click", publishProduct); $("delete-product").addEventListener("click", () => { if (state.selected >= 0) { state.products[state.selected].published = false; fillForm(state.products[state.selected]); renderList(); toast("Producto despublicado"); } }); $("duplicate-product").addEventListener("click", () => { const product = formProduct(); product.name = `${product.name} (copia)`; product.slug = `${product.slug}-copia`; product.published = false; state.products.push(product); selectProduct(state.products.length - 1); });
$("image-file").addEventListener("change", () => { const file = $("image-file").files[0]; if (!file) return; if (!file.type.match(/^image\/(jpeg|png|webp|svg\+xml)$/)) { toast("Formato no permitido"); return; } const reader = new FileReader(); reader.onload = () => { state.imageData = reader.result; state.imageName = file.name; $("image-name").textContent = file.name; previewImage(state.imageData); updatePreview(); }; reader.readAsDataURL(file); });
loadData(); checkLocalService(); setInterval(checkLocalService, 5000);
