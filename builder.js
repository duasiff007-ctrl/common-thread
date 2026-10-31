
document.addEventListener("DOMContentLoaded", async () => {
  // -----------------------------------
  // Elements
  // -----------------------------------

  const productsContainer = document.getElementById("builder-items");
  const genderFilters = document.getElementById("builder-gender-filters");
  const categoryFilters = document.getElementById("builder-category-filters");
  const previewContainer = document.getElementById("outfit-preview-list");
  const totalElement = document.getElementById("outfit-total");
  const statusElement = document.getElementById("builder-status");
  const saveStatus = document.getElementById("builder-save-status");
  const clearButton = document.getElementById("clear-outfit");
  const saveButton = document.getElementById("save-outfit");
  const colorSuggestions = document.getElementById("color-suggestions");
  const colorLabel = document.getElementById("color-suggestion-label");

  if (
    !productsContainer ||
    !genderFilters ||
    !categoryFilters ||
    !previewContainer
  ) {
    return;
  }

  // -----------------------------------
  // State
  // -----------------------------------

  let selectedGender = "all";
  let selectedCategory = "all";

  const categories = ["tops", "bottoms", "purses", "sunglasses"];

  // Each category can contain one selected product.
  // Products from men's and women's collections can be mixed.
  let outfit = {
    tops: null,
    bottoms: null,
    purses: null,
    sunglasses: null
  };

  // -----------------------------------
  // Load previously selected item
  // -----------------------------------

  function loadPreviousOutfit() {
    try {
      const saved = sessionStorage.getItem("commonThreadOutfit");

      if (!saved) return;

      const savedOutfit = JSON.parse(saved);

      categories.forEach((category) => {
        const productId = savedOutfit[category];

        if (productId !== undefined && productId !== null) {
          const product = getProductById(productId);

          if (product && product.category === category) {
            outfit[category] = product.id;
          }
        }
      });

      sessionStorage.removeItem("commonThreadOutfit");
    } catch (error) {
      console.error("Could not load previous outfit:", error);
    }
  }

  // -----------------------------------
  // Helpers
  // -----------------------------------

  function getSelectedProduct(category) {
    const productId = outfit[category];

    if (productId === null) return null;

    return getProductById(productId);
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
      element.className = className;
    }

    if (text !== undefined) {
      element.textContent = text;
    }

    return element;
  }

  function getImageUrl(product) {
    return product.image || "";
  }

  function getFilteredProducts() {
    return products.filter((product) => {
      const genderMatches =
        selectedGender === "all" ||
        product.gender === selectedGender;

      const categoryMatches =
        selectedCategory === "all" ||
        product.category === selectedCategory;

      return genderMatches && categoryMatches;
    });
  }

  // -----------------------------------
  // Render product choices
  // -----------------------------------

  function renderProducts() {
    productsContainer.replaceChildren();

    const filteredProducts = getFilteredProducts();

    if (filteredProducts.length === 0) {
      const emptyMessage = createElement(
        "p",
        "empty-message",
        "No pieces found in this category."
      );

      productsContainer.appendChild(emptyMessage);
      return;
    }

    filteredProducts.forEach((product) => {
      const card = createElement("article", "builder-product-card");

      const imageWrapper = createElement(
        "div",
        "builder-product-image"
      );

      const image = document.createElement("img");
      image.src = getImageUrl(product);
      image.alt = product.name;
      image.loading = "lazy";

      image.addEventListener("error", () => {
        imageWrapper.classList.add("image-unavailable");
        image.remove();
        imageWrapper.textContent = "Image unavailable";
      }, { once: true });

      imageWrapper.appendChild(image);

      const info = createElement("div", "builder-product-info");

      const name = createElement(
        "h4",
        "builder-product-name",
        product.name
      );

      const details = createElement(
        "p",
        "builder-product-details",
        `${product.gender === "women" ? "Women's" : "Men's"} · ${product.category}`
      );

      const price = createElement(
        "p",
        "builder-product-price",
        formatPrice(product.price)
      );

      const button = createElement(
        "button",
        "btn btn-secondary builder-select-btn",
        outfit[product.category] === product.id
          ? "Selected"
          : "Add to outfit"
      );

      button.type = "button";

      const isSelected = outfit[product.category] === product.id;

      if (isSelected) {
        button.classList.add("selected");
        button.setAttribute("aria-pressed", "true");
      } else {
        button.setAttribute("aria-pressed", "false");
      }

      button.addEventListener("click", () => {
        selectProduct(product);
      });

      info.append(name, details, price, button);
      card.append(imageWrapper, info);

      productsContainer.appendChild(card);
    });
  }

  // -----------------------------------
  // Select a product
  // -----------------------------------

  function selectProduct(product) {
    const category = product.category;

    if (!categories.includes(category)) {
      return;
    }

    // Clicking the selected product removes it.
    if (outfit[category] === product.id) {
      outfit[category] = null;

      showStatus(`${product.name} removed from your outfit.`);
    } else {
      outfit[category] = product.id;

      showStatus(`${product.name} added to your outfit.`);
    }

    renderProducts();
    renderOutfit();
    updateTotal();
    updateColorSuggestions();
  }

  // -----------------------------------
  // Render outfit preview
  // -----------------------------------

  function renderOutfit() {
    previewContainer.replaceChildren();

    const categoryNames = {
      tops: "Top",
      bottoms: "Bottoms",
      purses: "Purse",
      sunglasses: "Sunglasses"
    };

    categories.forEach((category, index) => {
      const product = getSelectedProduct(category);

      const slot = createElement("div", "outfit-slot");
      slot.dataset.slot = category;

      if (!product) {
        const placeholder = createElement(
          "div",
          "outfit-slot-placeholder"
        );

        const number = createElement(
          "span",
          "",
          String(index + 1).padStart(2, "0")
        );

        const info = createElement("div");

        const title = createElement(
          "strong",
          "",
          categoryNames[category]
        );

        const subtitle = createElement(
          "small",
          "",
          "Nothing selected yet"
        );

        info.append(title, subtitle);
        placeholder.append(number, info);
        slot.appendChild(placeholder);
      } else {
        const item = createElement("div", "outfit-slot-item");

        const image = document.createElement("img");
        image.src = getImageUrl(product);
        image.alt = product.name;
        image.loading = "lazy";

        const info = createElement("div", "outfit-slot-info");

        const title = createElement(
          "strong",
          "",
          product.name
        );

        const price = createElement(
          "small",
          "",
          formatPrice(product.price)
        );

        const removeButton = createElement(
          "button",
          "remove-outfit-item",
          "Remove"
        );

        removeButton.type = "button";
        removeButton.setAttribute(
          "aria-label",
          `Remove ${product.name} from outfit`
        );

        removeButton.addEventListener("click", () => {
          outfit[category] = null;

          renderProducts();
          renderOutfit();
          updateTotal();
          updateColorSuggestions();

          showStatus(`${product.name} removed from your outfit.`);
        });

        image.addEventListener("error", () => {
          image.remove();
        }, { once: true });

        info.append(title, price, removeButton);
        item.append(image, info);
        slot.appendChild(item);
      }

      previewContainer.appendChild(slot);
    });
  }

  // -----------------------------------
  // Update total price
  // -----------------------------------

  function updateTotal() {
    let total = 0;

    categories.forEach((category) => {
      const product = getSelectedProduct(category);

      if (product) {
        total += Number(product.price) || 0;
      }
    });

    totalElement.textContent = formatPrice(total);
  }

  // -----------------------------------
  // Colour suggestions
  // -----------------------------------

  const palettes = [
    {
      name: "A soft, earthy palette",
      colors: ["#D8C6B4", "#A98F86", "#74745F", "#E9DFD3"]
    },
    {
      name: "Warm and understated",
      colors: ["#B79B83", "#78685D", "#D5C4AE", "#EEE5D8"]
    },
    {
      name: "Muted and relaxed",
      colors: ["#A9A69A", "#777C70", "#C7B9A8", "#E4DCD1"]
    },
    {
      name: "Deep and balanced",
      colors: ["#66545E", "#8F737B", "#B6A294", "#DDD0C3"]
    }
  ];

  function updateColorSuggestions() {
    if (!colorSuggestions || !colorLabel) return;

    const selectedProducts = categories
      .map((category) => getSelectedProduct(category))
      .filter(Boolean);

    let paletteIndex = 0;

    if (selectedProducts.length > 0) {
      const colorText = selectedProducts
        .map((product) => product.color || "")
        .join(" ")
        .toLowerCase();

      if (
        colorText.includes("black") ||
        colorText.includes("brown") ||
        colorText.includes("navy")
      ) {
        paletteIndex = 3;
      } else if (
        colorText.includes("pink") ||
        colorText.includes("beige") ||
        colorText.includes("cream")
      ) {
        paletteIndex = 1;
      } else if (
        colorText.includes("green") ||
        colorText.includes("olive") ||
        colorText.includes("grey")
      ) {
        paletteIndex = 2;
      }
    }

    const palette = palettes[paletteIndex];

    colorSuggestions.replaceChildren();

    palette.colors.forEach((color, index) => {
      const swatch = createElement("span", "color-swatch");

      swatch.style.backgroundColor = color;
      swatch.title = color;
      swatch.setAttribute("aria-label", `Suggested colour ${index + 1}: ${color}`);

      colorSuggestions.appendChild(swatch);
    });

    colorLabel.textContent = palette.name;
  }

  // -----------------------------------
  // Gender filter
  // -----------------------------------

  genderFilters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-builder-gender]");

    if (!button) return;

    selectedGender = button.dataset.builderGender;

    genderFilters.querySelectorAll("[data-builder-gender]").forEach((item) => {
      const active = item === button;

      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });

    renderProducts();
  });

  // -----------------------------------
  // Category filter
  // -----------------------------------

  categoryFilters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-builder-category]");

    if (!button) return;

    selectedCategory = button.dataset.builderCategory;

    categoryFilters.querySelectorAll("[data-builder-category]").forEach((item) => {
      const active = item === button;

      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });

    renderProducts();
  });

  // -----------------------------------
  // Clear outfit
  // -----------------------------------

  clearButton?.addEventListener("click", () => {
    categories.forEach((category) => {
      outfit[category] = null;
    });

    try {
      sessionStorage.removeItem("commonThreadOutfit");
    } catch (error) {
      console.error("Could not clear temporary outfit:", error);
    }

    if (saveStatus) {
      saveStatus.textContent = "";
    }

    renderProducts();
    renderOutfit();
    updateTotal();
    updateColorSuggestions();

    showStatus("Your outfit has been cleared.");
  });

  // -----------------------------------
  // Save outfit
  // -----------------------------------

  saveButton?.addEventListener("click", () => {
    const hasItems = categories.some(
      (category) => outfit[category] !== null
    );

    if (!hasItems) {
      if (saveStatus) {
        saveStatus.textContent = "Add at least one piece before saving.";
      }
      return;
    }

    try {
      localStorage.setItem(
        "commonThreadSavedOutfit",
        JSON.stringify(outfit)
      );

      if (saveStatus) {
        saveStatus.textContent = "Your outfit has been saved on this device.";
      }
    } catch (error) {
      console.error("Could not save outfit:", error);

      if (saveStatus) {
        saveStatus.textContent = "Unable to save your outfit. Please try again.";
      }
    }
  });

  // -----------------------------------
  // Status message
  // -----------------------------------

  function showStatus(message) {
    if (statusElement) {
      statusElement.textContent = message;
    }
  }

  //   // -----------------------------------
  // Initial setup
  // -----------------------------------

  try {
    // Wait until products have loaded from MongoDB.
    await productsReady;

    loadPreviousOutfit();
    renderProducts();
    renderOutfit();
    updateTotal();
    updateColorSuggestions();

  } catch (error) {
    console.error("Builder initialization failed:", error);

    showStatus("Unable to load products. Please refresh the page.");
  }
});