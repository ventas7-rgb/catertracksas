document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const backToTop = document.querySelector(".back-to-top");
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
  const legacyProductDescriptions = {
    "Anillos de motor": "Anillos de motor para maquinaria pesada y motores diésel, ideales para mantenimiento y reparación de motores Caterpillar.",
    "Camisas de cilindro": "Camisas de cilindro para motores de maquinaria pesada, fabricadas para recuperar el rendimiento y la compresión del motor.",
    "Pistones de motor": "Pistones de motor para maquinaria pesada y motores diésel, disponibles para reparación de diferentes aplicaciones industriales.",
    "Kit de sellos": "Kit de sellos para maquinaria pesada, diseñado para reparar cilindros y componentes hidráulicos con un ajuste confiable.",
    "Bomba de agua": "Bomba de agua para motor diésel de maquinaria pesada, esencial para el sistema de enfriamiento y la operación continua.",
    "Juego de empaques": "Juego de empaques para motores y maquinaria pesada, una solución práctica para mantenimiento y reparación de componentes.",
    "Cuchillas": "Cuchillas para maquinaria pesada y motoniveladoras, ideales para trabajos de nivelación, excavación y movimiento de tierra.",
    "Puntas de excavadora": "Puntas de excavadora para trabajo pesado, diseñadas para mejorar la penetración y el rendimiento del cucharón en diferentes terrenos.",
    "Adaptadores de diente": "Adaptadores de diente para excavadora y cargador, piezas de desgaste para instalar puntas y proteger el cucharón.",
    "Inyector diésel": "Inyector diésel para maquinaria pesada, componente de precisión para mejorar la combustión y el funcionamiento del motor.",
    "Bomba de inyección": "Bomba de inyección para motores diésel de maquinaria pesada, encargada de entregar combustible con la presión adecuada.",
    "Boquillas de inyección": "Boquillas de inyección diésel para motores de maquinaria pesada, ideales para mantenimiento del sistema de combustible.",
    "Discos de transmisión": "Discos de transmisión para maquinaria pesada, repuestos para el sistema de transmisión y aplicaciones de trabajo exigente.",
    "Convertidor de torque": "Convertidor de torque para maquinaria pesada, componente del tren de fuerza que transmite potencia de forma eficiente.",
    "Engranajes de mando final": "Engranajes de mando final para maquinaria pesada, repuestos para transmitir fuerza a las orugas y ruedas motrices.",
    "Bomba hidráulica": "Bomba hidráulica para maquinaria pesada, repuesto para recuperar la presión y el rendimiento del sistema hidráulico.",
    "Mangueras hidráulicas": "Mangueras hidráulicas para maquinaria pesada, fabricadas para conducir aceite a presión en sistemas y cilindros hidráulicos.",
    "Válvula de control": "Válvula de control hidráulico para maquinaria pesada, utilizada para regular el flujo y el movimiento de los implementos.",
    "Kit de tornillos": "Kit de tornillos para maquinaria pesada, solución para montaje y mantenimiento de componentes sometidos a trabajo exigente.",
    "Bujes de desgaste": "Bujes de desgaste para maquinaria pesada, repuestos para reducir la fricción y proteger articulaciones y puntos de giro.",
    "Pasadores de maquinaria": "Pasadores para maquinaria pesada, piezas de reemplazo para uniones, brazos, cucharones y componentes articulados.",
    "Aceite para motor diésel": "Aceite para motor diésel de maquinaria pesada, formulado para proteger y mantener el rendimiento del motor en trabajo continuo.",
    "Filtro de aceite": "Filtro de aceite para motor diésel y maquinaria pesada, ayuda a mantener limpio el lubricante y proteger los componentes internos.",
    "Grasa multipropósito": "Grasa multipropósito para maquinaria pesada, ideal para lubricar rodamientos, bujes, articulaciones y puntos de engrase.",
    "Monitor de maquinaria": "Monitor para maquinaria pesada, repuesto para visualizar parámetros y controlar el funcionamiento del equipo.",
    "Módulo electrónico": "Módulo electrónico para maquinaria pesada, componente de control para sistemas eléctricos y funciones del equipo.",
    "Alternador industrial": "Alternador industrial para maquinaria pesada, encargado de generar energía y mantener cargado el sistema eléctrico.",
    "Llanta para cargador": "Llanta para cargador y maquinaria pesada, diseñada para soportar carga, terrenos exigentes y operación continua.",
    "Neumático OTR": "Neumático OTR para maquinaria pesada, recomendado para equipos que trabajan en construcción, minería y terrenos difíciles.",
    "Cámara para maquinaria": "Cámara para llanta de maquinaria pesada, repuesto para mantener la presión y el funcionamiento seguro del neumático.",
    "Espejos para maquinaria": "Espejos para maquinaria pesada, accesorios para mejorar la visibilidad y seguridad del operador durante el trabajo.",
    "Luces de trabajo LED": "Luces de trabajo LED para maquinaria pesada, iluminación auxiliar para operar con mayor visibilidad en zonas oscuras.",
    "Accesorios de cabina": "Accesorios de cabina para maquinaria pesada, complementos para mejorar la comodidad y funcionalidad del operador.",
    "Asientos para operador": "Asientos para operador de maquinaria pesada, diseñados para brindar soporte y comodidad durante jornadas de trabajo prolongadas.",
    "Alarmas de retroceso": "Alarmas de retroceso para maquinaria pesada, dispositivo de seguridad que advierte el movimiento de reversa del equipo.",
    "Escaleras de acceso": "Escaleras de acceso para maquinaria pesada, repuestos que facilitan el ingreso seguro a la cabina y las plataformas del equipo.",
  };
  const catalog = window.caterTrackCatalog;
  const productByName = Object.fromEntries(
    catalog.products.map((product) => [product.name, product]),
  );
  const productDescriptions = Object.fromEntries(
    catalog.products.map((product) => [product.name, product.description]),
  );

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
  const category = catalog.categories.find(
    (item) => item.slug === catalogPage?.dataset.category,
  );
  const categoryProducts = catalog.products.filter(
    (product) => product.category === catalogPage?.dataset.category,
  );
  const pageData = category
    ? [
        category.name,
        ...categoryProducts.slice(0, 3).map((product) => product.name),
        [...new Set(categoryProducts.map((product) => product.subcategory))],
        ...categoryProducts.slice(3).map((product) => product.name),
      ]
    : null;
  if (catalogPage && pageData && !catalogPage.querySelector(".product-card")) {
    const [title, firstProduct, secondProduct, thirdProduct, subcategories] =
      pageData;
    catalogPage.innerHTML = `<section class="catalog-hero"><div class="container"><span class="catalog-hero__eyebrow">Catálogo de repuestos</span><h1>${title}</h1><p>Encuentra repuestos para maquinaria pesada, con opciones para diferentes aplicaciones y modelos. Esta página está preparada para ampliar el inventario.</p></div></section><section class="catalog-products" aria-labelledby="products-title"><div class="container"><div class="catalog-section-heading"><div><span class="catalog-hero__eyebrow">Explora por componente</span><h2 id="products-title">Encuentra el repuesto que necesitas</h2></div><span class="catalog-result" aria-live="polite"></span></div><div class="subcategory-filters" role="group" aria-label="Filtrar por subcategoría"><button class="subcategory-filter is-active" type="button" data-subcategory="all">Todos</button>${subcategories.map((subcategory) => `<button class="subcategory-filter" type="button" data-subcategory="${subcategory.toLowerCase()}">${subcategory}</button>`).join("")}</div><div class="product-grid">${[firstProduct, secondProduct, thirdProduct].map((product, index) => `<article class="product-card" data-subcategory="${subcategories[index].toLowerCase()}"><div class="product-card__visual"><img src="${productByName[product].image}" alt="${productByName[product].alt}" width="1200" height="900" loading="lazy" decoding="async"></div><div class="product-card__content"><span class="product-card__category">${subcategories[index]}</span><h3>${product}</h3><dl class="product-card__details"><div><dt>Marca</dt><dd>${productByName[product].brand}</dd></div><div><dt>Aplicación</dt><dd>${productByName[product].application}</dd></div></dl><p class="product-card__description">${productDescriptions[product]}</p><a class="product-card__cta" href="https://wa.me/573132416739?text=Hola%20CaterTrack%2C%20quiero%20cotizar%20${encodeURIComponent(product)}" target="_blank" rel="noopener noreferrer">Solicitar cotización <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a></div></article>`).join("")}</div></div></section>`;
    catalogPage.querySelector(".catalog-hero")?.remove();
    const productGrid = catalogPage.querySelector(".product-grid");
    const additionalProducts = pageData.slice(5);
    additionalProducts.forEach((product, index) => {
      const subcategoryIndex = (index + 3) % subcategories.length;
      const card = document.createElement("article");
      card.className = "product-card";
      card.dataset.subcategory = subcategories[subcategoryIndex].toLowerCase();
      card.innerHTML = `<div class="product-card__visual"><img src="${productByName[product].image}" alt="${productByName[product].alt}" width="1200" height="900" loading="lazy" decoding="async"></div><div class="product-card__content"><span class="product-card__category">${subcategories[subcategoryIndex]}</span><h3>${product}</h3><dl class="product-card__details"><div><dt>Marca</dt><dd>${productByName[product].brand}</dd></div><div><dt>Aplicación</dt><dd>${productByName[product].application}</dd></div></dl><p class="product-card__description">${productDescriptions[product]}</p><a class="product-card__cta" href="https://wa.me/573132416739?text=Hola%20CaterTrack%2C%20quiero%20cotizar%20${encodeURIComponent(product)}" target="_blank" rel="noopener noreferrer">Solicitar cotización <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a></div>`;
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
