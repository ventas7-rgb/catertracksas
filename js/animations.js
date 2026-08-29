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

  // Skip category nav bar on the homepage, which shows its own category grid.
  if (header && !document.querySelector(".catalog-navigation") && !document.querySelector(".category-grid")) {
    const pageCategory = document.body.dataset.category || "";
    const categoryNavigation = document.createElement("nav");
    categoryNavigation.className = "catalog-navigation";
    categoryNavigation.setAttribute("aria-label", "Categorías de repuestos");
    categoryNavigation.innerHTML = `<div class="container"><ul>${categories.map(([slug, label]) => `<li><a href="${pageCategory ? "../" : ""}${slug}/index.html"${slug === pageCategory ? ' aria-current="page"' : ""}>${label}</a></li>`).join("")}</ul></div>`;
    header.insertAdjacentElement("afterend", categoryNavigation);
  }
});
