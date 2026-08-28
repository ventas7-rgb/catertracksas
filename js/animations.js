document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const backToTop = document.querySelector(".back-to-top");
  header
    ?.querySelector('.header__menu a[href*="#inicio"]')
    ?.closest("li")
    ?.remove();
  const categories = [
    ["tren-de-rodaje", "Tren de rodaje"],
    ["repuestos-ipd", "Motor IPD"],
    ["repuestos-kmp", "Motor KMP"],
    ["herramientas-de-corte", "Herramientas de corte"],
    ["inyeccion", "Inyección"],
    ["tren-de-fuerza", "Tren de fuerza"],
    ["partes-hidraulicas", "Hidráulica"],
    ["ajuste", "Ajuste"],
    ["lubricantes", "Lubricantes"],
    ["monitores", "Monitores"],
    ["llantas", "Llantas"],
    ["miscelaneos", "Misceláneos"],
  ];
  const catalogData = {
    "repuestos-ipd": [
      "Repuestos IPD",
      "Anillos de motor",
      "Camisas de cilindro",
      "Pistones de motor",
      ["Motor", "Empaques", "Otros"],
    ],
    "repuestos-kmp": [
      "Repuestos KMP",
      "Kit de sellos",
      "Bomba de agua",
      "Juego de empaques",
      ["Motor", "Sellos", "Otros"],
    ],
    "herramientas-de-corte": [
      "Herramientas de corte",
      "Cuchillas",
      "Puntas de excavadora",
      "Adaptadores de diente",
      ["Cuchillas", "Puntas", "Adaptadores"],
    ],
    inyeccion: [
      "Inyección",
      "Inyector diésel",
      "Bomba de inyección",
      "Boquillas de inyección",
      ["Inyectores", "Bombas", "Boquillas"],
    ],
    "tren-de-fuerza": [
      "Tren de fuerza",
      "Discos de transmisión",
      "Convertidor de torque",
      "Engranajes de mando final",
      ["Transmisión", "Convertidores", "Mando final"],
    ],
    "partes-hidraulicas": [
      "Partes hidráulicas",
      "Bomba hidráulica",
      "Mangueras hidráulicas",
      "Válvula de control",
      ["Bombas", "Mangueras", "Válvulas"],
    ],
    ajuste: [
      "Ajuste",
      "Kit de tornillos",
      "Bujes de desgaste",
      "Pasadores de maquinaria",
      ["Tornillos", "Bujes", "Pasadores"],
    ],
    lubricantes: [
      "Lubricantes",
      "Aceite para motor diésel",
      "Filtro de aceite",
      "Grasa multipropósito",
      ["Aceites", "Filtros", "Grasas"],
    ],
    monitores: [
      "Monitores",
      "Monitor de maquinaria",
      "Módulo electrónico",
      "Alternador industrial",
      ["Monitores", "Módulos", "Alternadores"],
    ],
    llantas: [
      "Llantas",
      "Llanta para cargador",
      "Neumático OTR",
      "Cámara para maquinaria",
      ["Llantas", "Neumáticos", "Cámaras"],
    ],
    miscelaneos: [
      "Misceláneos",
      "Espejos para maquinaria",
      "Luces de trabajo LED",
      "Accesorios de cabina",
      ["Cabina", "Iluminación", "Accesorios"],
      "Asientos para operador",
      "Alarmas de retroceso",
      "Escaleras de acceso",
    ],
  };

  const updateHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  backToTop?.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const productCards = [...document.querySelectorAll(".product-card")];
  const subcategoryFilters = [
    ...document.querySelectorAll(".subcategory-filter"),
  ];
  const catalogResult = document.querySelector(".catalog-result");

  const filterProducts = (subcategory) => {
    const visibleProducts = productCards.filter(
      (card) =>
        subcategory === "all" || card.dataset.subcategory === subcategory,
    );
    productCards.forEach((card) =>
      card.toggleAttribute("hidden", !visibleProducts.includes(card)),
    );
    if (catalogResult) {
      catalogResult.textContent = `${visibleProducts.length} ${visibleProducts.length === 1 ? "producto disponible" : "productos disponibles"}`;
    }
  };

  subcategoryFilters.forEach((filter) => {
    filter.addEventListener("click", () => {
      subcategoryFilters.forEach((item) => item.classList.remove("is-active"));
      filter.classList.add("is-active");
      filterProducts(filter.dataset.subcategory);
    });
  });

  if (subcategoryFilters.length) {
    filterProducts("all");
  }

  const catalogPage = document.querySelector("main[data-category]");
  const pageData = catalogData[catalogPage?.dataset.category];
  if (catalogPage && pageData && !catalogPage.querySelector(".product-card")) {
    const [title, firstProduct, secondProduct, thirdProduct, subcategories] =
      pageData;
    catalogPage.innerHTML = `<section class="catalog-hero"><div class="container"><span class="catalog-hero__eyebrow">Catálogo de repuestos</span><h1>${title}</h1><p>Encuentra repuestos para maquinaria pesada, con opciones para diferentes aplicaciones y modelos. Esta página está preparada para ampliar el inventario.</p></div></section><section class="catalog-products" aria-labelledby="products-title"><div class="container"><div class="catalog-section-heading"><div><span class="catalog-hero__eyebrow">Explora por componente</span><h2 id="products-title">Encuentra el repuesto que necesitas</h2></div><span class="catalog-result" aria-live="polite"></span></div><div class="subcategory-filters" role="group" aria-label="Filtrar por subcategoría"><button class="subcategory-filter is-active" type="button" data-subcategory="all">Todos</button>${subcategories.map((subcategory) => `<button class="subcategory-filter" type="button" data-subcategory="${subcategory.toLowerCase()}">${subcategory}</button>`).join("")}</div><div class="product-grid">${[firstProduct, secondProduct, thirdProduct].map((product, index) => `<article class="product-card" data-subcategory="${subcategories[index].toLowerCase()}"><div class="product-card__visual"><i class="fa-solid ${["fa-gears", "fa-screwdriver-wrench", "fa-box-open"][index]}" aria-hidden="true"></i><span>Imagen próximamente</span></div><div class="product-card__content"><span class="product-card__category">${subcategories[index]}</span><h3>${product}</h3><dl class="product-card__details"><div><dt>Referencia</dt><dd>Por confirmar</dd></div><div><dt>Marca</dt><dd>Por confirmar</dd></div><div><dt>Aplicación</dt><dd>Por confirmar</dd></div></dl><p>Producto de ejemplo para reemplazar con la información real del inventario.</p><a class="product-card__cta" href="https://wa.me/573132416739?text=Hola%20CaterTrack%2C%20quiero%20cotizar%20${encodeURIComponent(product)}" target="_blank" rel="noopener noreferrer">Solicitar cotización <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a></div></article>`).join("")}</div></div></section>`;
    catalogPage.querySelector(".catalog-hero")?.remove();
    const productGrid = catalogPage.querySelector(".product-grid");
    const additionalProducts = pageData.slice(5);
    additionalProducts.forEach((product, index) => {
      const subcategoryIndex = (index + 3) % subcategories.length;
      const card = document.createElement("article");
      card.className = "product-card";
      card.dataset.subcategory = subcategories[subcategoryIndex].toLowerCase();
      card.innerHTML = `<div class="product-card__visual"><i class="fa-solid ${["fa-chair", "fa-triangle-exclamation", "fa-stairs"][index]}" aria-hidden="true"></i><span>Imagen próximamente</span></div><div class="product-card__content"><span class="product-card__category">${subcategories[subcategoryIndex]}</span><h3>${product}</h3><dl class="product-card__details"><div><dt>Referencia</dt><dd>Por confirmar</dd></div><div><dt>Marca</dt><dd>Por confirmar</dd></div><div><dt>Aplicación</dt><dd>Por confirmar</dd></div></dl><p>Producto de ejemplo para reemplazar con la información real del inventario.</p><a class="product-card__cta" href="https://wa.me/573132416739?text=Hola%20CaterTrack%2C%20quiero%20cotizar%20${encodeURIComponent(product)}" target="_blank" rel="noopener noreferrer">Solicitar cotización <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a></div>`;
      productGrid?.append(card);
    });
    const generatedFilters = [
      ...catalogPage.querySelectorAll(".subcategory-filter"),
    ];
    const generatedCards = [...catalogPage.querySelectorAll(".product-card")];
    const generatedResult = catalogPage.querySelector(".catalog-result");
    const updateGeneratedCatalog = (subcategory) => {
      const visibleCards = generatedCards.filter(
        (card) =>
          subcategory === "all" || card.dataset.subcategory === subcategory,
      );
      generatedCards.forEach((card) =>
        card.toggleAttribute("hidden", !visibleCards.includes(card)),
      );
      generatedResult.textContent = `${visibleCards.length} ${visibleCards.length === 1 ? "producto disponible" : "productos disponibles"}`;
    };
    generatedFilters.forEach((filter) =>
      filter.addEventListener("click", () => {
        generatedFilters.forEach((item) => item.classList.remove("is-active"));
        filter.classList.add("is-active");
        updateGeneratedCatalog(filter.dataset.subcategory);
      }),
    );
    updateGeneratedCatalog("all");
  }

  if (header && !document.querySelector(".catalog-navigation")) {
    const pageCategory = document.body.dataset.category || "";
    const categoryNavigation = document.createElement("nav");
    categoryNavigation.className = "catalog-navigation";
    categoryNavigation.setAttribute("aria-label", "Categorías de repuestos");
    categoryNavigation.innerHTML = `<div class="container"><ul>${categories.map(([slug, label]) => `<li><a href="${pageCategory ? "../" : ""}${slug}/index.html"${slug === pageCategory ? ' aria-current="page"' : ""}>${label}</a></li>`).join("")}</ul></div>`;
    header.insertAdjacentElement("afterend", categoryNavigation);
  }
});
