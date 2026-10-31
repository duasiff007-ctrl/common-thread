
/* =========================================
   COMMON THREAD — SHOP FUNCTIONALITY
========================================= */

document.addEventListener("DOMContentLoaded", async () => {
  const productGrid = document.getElementById("products-grid");
  const productCount = document.getElementById("product-count");
  const searchInput = document.getElementById("product-search");
  const noProducts = document.getElementById("no-products");
  const clearFiltersButton = document.getElementById("clear-filters");

  const genderFilters = document.getElementById("gender-filters");
  const categoryFilters = document.getElementById("category-filters");

  // Stop if this script is accidentally loaded on another page.
  if (!productGrid) return;

  // Current filter selections.
  let selectedGender = "all";
  let selectedCategory = "all";
  let searchTerm = "";

  // =====================================
  // CREATE PRODUCT CARD
  // =====================================

  function createProductCard(product) {
    const card = document.createElement("article");
    card.className = "product-card";

    // Product image.
    const imageContainer = document.createElement("div");
    imageContainer.className = "product-image";

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.name;
    image.loading = "lazy";

    image.onerror = () => {
      image.remove();

      const placeholder = document.createElement("div");
      placeholder.className = "product-image-placeholder";
      placeholder.textContent = product.name;

      imageContainer.prepend(placeholder);
    };

    imageContainer.appendChild(image);

    // Product gender label.
    const tag = document.createElement("span");
    tag.className = "product-tag";
    tag.textContent =
      product.gender === "women" ? "Women's" : "Men's";

    imageContainer.appendChild(tag);

    // Product details.
    const info = document.createElement("div");
    info.className = "product-info";

    const name = document.createElement("h3");
    name.textContent = product.name;

    const category = document.createElement("p");
    category.className = "product-category";
    category.textContent =
      `${product.category} · ${product.color}`;

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = formatPrice(product.price);

    // Product actions.
    const actions = document.createElement("div");
    actions.className = "product-actions";

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "btn btn-primary";
    addButton.textContent = "Style this piece";

    addButton.addEventListener("click", () => {
      addToOutfit(product.id);
    });

    const detailsButton = document.createElement("button");
    detailsButton.type = "button";
    detailsButton.className = "btn btn-secondary";
    detailsButton.textContent = "Details";

    detailsButton.addEventListener("click", () => {
      showProductDetails(product);
    });

    actions.append(addButton, detailsButton);

    info.append(name, category, price, actions);
    card.append(imageContainer, info);

    return card;
  }

  // =====================================
  // RENDER PRODUCTS
  // =====================================

  function renderProducts() {
    const filteredProducts = products.filter(product => {
      const matchesGender =
        selectedGender === "all" ||
        product.gender === selectedGender;

      const matchesCategory =
        selectedCategory === "all" ||
        product.category === selectedCategory;

      const searchableText = [
        product.name,
        product.category,
        product.gender,
        product.color,
        product.description
      ].join(" ").toLowerCase();

      const matchesSearch =
        searchableText.includes(searchTerm);

      return (
        matchesGender &&
        matchesCategory &&
        matchesSearch
      );
    });

    productGrid.replaceChildren();

    filteredProducts.forEach(product => {
      productGrid.appendChild(createProductCard(product));
    });

    // Update product count.
    if (productCount) {
      productCount.textContent =
        `${filteredProducts.length} ${
          filteredProducts.length === 1 ? "piece" : "pieces"
        } found`;
    }

    // Show empty state when no products match.
    const hasProducts = filteredProducts.length > 0;

    if (noProducts) {
      noProducts.classList.toggle("hidden", hasProducts);
    }

    productGrid.classList.toggle("hidden", !hasProducts);
  }

  // =====================================
  // GENDER FILTERS
  // =====================================

  if (genderFilters) {
    genderFilters.addEventListener("click", event => {
      const button = event.target.closest("[data-gender]");

      if (!button) return;

      selectedGender = button.dataset.gender;

      genderFilters
        .querySelectorAll("[data-gender]")
        .forEach(filterButton => {
          const isActive = filterButton === button;

          filterButton.classList.toggle("active", isActive);
          filterButton.setAttribute(
            "aria-pressed",
            String(isActive)
          );
        });

      renderProducts();
    });
  }

  // =====================================
  // CATEGORY FILTERS
  // =====================================

  if (categoryFilters) {
    categoryFilters.addEventListener("click", event => {
      const button = event.target.closest("[data-category]");

      if (!button) return;

      selectedCategory = button.dataset.category;

      categoryFilters
        .querySelectorAll("[data-category]")
        .forEach(filterButton => {
          const isActive = filterButton === button;

          filterButton.classList.toggle("active", isActive);
          filterButton.setAttribute(
            "aria-pressed",
            String(isActive)
          );
        });

      renderProducts();
    });
  }

  // =====================================
  // SEARCH
  // =====================================

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      searchTerm = searchInput.value.trim().toLowerCase();
      renderProducts();
    });
  }

  // =====================================
  // CLEAR FILTERS
  // =====================================

  function clearFilters() {
    selectedGender = "all";
    selectedCategory = "all";
    searchTerm = "";

    if (searchInput) {
      searchInput.value = "";
    }

    if (genderFilters) {
      genderFilters
        .querySelectorAll("[data-gender]")
        .forEach(button => {
          const active = button.dataset.gender === "all";

          button.classList.toggle("active", active);
          button.setAttribute("aria-pressed", String(active));
        });
    }

    if (categoryFilters) {
      categoryFilters
        .querySelectorAll("[data-category]")
        .forEach(button => {
          const active = button.dataset.category === "all";

          button.classList.toggle("active", active);
          button.setAttribute("aria-pressed", String(active));
        });
    }

    renderProducts();
  }

  if (clearFiltersButton) {
    clearFiltersButton.addEventListener("click", clearFilters);
  }

  // =====================================
  // ADD PRODUCT TO OUTFIT BUILDER
  // =====================================

  function addToOutfit(productId) {
    try {
      let savedOutfit = JSON.parse(
        sessionStorage.getItem("commonThreadOutfit") || "{}"
      );

      const product = getProductById(productId);

      if (!product) return;

      // Save one item per category.
      savedOutfit[product.category] = product.id;

      sessionStorage.setItem(
        "commonThreadOutfit",
        JSON.stringify(savedOutfit)
      );

      const message = document.createElement("div");
      message.className = "shop-toast";
      message.textContent = `${product.name} added to your outfit!`;

      document.body.appendChild(message);

      requestAnimationFrame(() => {
        message.classList.add("show");
      });

      setTimeout(() => {
        message.classList.remove("show");

        setTimeout(() => message.remove(), 250);
      }, 2200);

      // Open the builder after adding the product.
      setTimeout(() => {
        window.location.href = "builder.html";
      }, 900);

    } catch (error) {
      alert("Unable to save this piece. Please try again.");
    }
  }

  // =====================================
  // PRODUCT DETAILS
  // =====================================

  function showProductDetails(product) {
    const message = [
      product.name,
      "",
      product.description,
      "",
      `Collection: ${product.gender}`,
      `Category: ${product.category}`,
      `Color: ${product.color}`,
      `Price: ${formatPrice(product.price)}`
    ].join("\n");

    alert(message);
  }

  // =====================================
  // READ CATEGORY FROM HOMEPAGE LINK
  // =====================================

  const params = new URLSearchParams(window.location.search);
  const requestedCategory = params.get("category");

  const allowedCategories = [
    "tops",
    "bottoms",
    "purses",
    "sunglasses"
  ];

  if (allowedCategories.includes(requestedCategory)) {
    selectedCategory = requestedCategory;

    if (categoryFilters) {
      categoryFilters
        .querySelectorAll("[data-category]")
        .forEach(button => {
          const active =
            button.dataset.category === requestedCategory;

          button.classList.toggle("active", active);
          button.setAttribute("aria-pressed", String(active));
        });
    }
  }

    // Wait for MongoDB products before displaying the Shop.
  try {
    await productsReady;
    renderProducts();
  } catch (error) {
    productGrid.replaceChildren();

    if (productCount) {
      productCount.textContent = "Products could not be loaded.";
    }

    if (noProducts) {
      noProducts.classList.remove("hidden");
      noProducts.textContent =
        "Unable to load products. Please refresh the page.";
    }

    console.error("Shop initialization failed:", error);
  }
});
