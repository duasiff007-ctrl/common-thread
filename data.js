
/* =========================================
   COMMON THREAD — LIVE PRODUCT DATABASE
========================================= */

const API_BASE_URL =
  "https://common-thread-omega.vercel.app/api";

let products = [];

// Load products from MongoDB through the backend.
const productsReady = (async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const data = await response.json();

    if (!data.success || !Array.isArray(data.products)) {
      throw new Error("Invalid product data received from the server.");
    }

    // Convert MongoDB product IDs into the format used by the website.
    products = data.products.map(product => ({
      ...product,
      id: String(product._id)
    }));

    console.log(`Common Thread: ${products.length} products loaded from MongoDB.`);

    return products;

  } catch (error) {
    console.error("Could not load products from MongoDB:", error);

    throw error;
  }
})();


/* =========================================
   HELPER FUNCTIONS
========================================= */

// Find a product using its MongoDB ID.
function getProductById(id) {
  return products.find(
    product => String(product.id) === String(id)
  );
}

// Get products by category.
function getProductsByCategory(category) {
  if (category === "all") {
    return products;
  }

  return products.filter(product => product.category === category);
}

// Get products by collection.
function getProductsByGender(gender) {
  if (gender === "all") {
    return products;
  }

  return products.filter(product => product.gender === gender);
}

// Get products using both collection and category.
function filterProducts(gender = "all", category = "all") {
  return products.filter(product => {
    const genderMatches =
      gender === "all" || product.gender === gender;

    const categoryMatches =
      category === "all" || product.category === category;

    return genderMatches && categoryMatches;
  });
}

// Format prices in Pakistani Rupees.
function formatPrice(price) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0
  }).format(price);
}
