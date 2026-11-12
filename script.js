
const products = [
  {
    id: 1, name: "Jungle Mode Tee", category: "apparel",
    price: 24, tag: "BESTSELLER", type: "shirt",
    bg: "#dce7cb", ink: "#263222", art: "MONKE",
    description: "A relaxed everyday tee with a bold jungle-inspired graphic."
  },
  {
    id: 2, name: "Forest Hoodie", category: "apparel",
    price: 48, tag: "NEW", type: "shirt",
    bg: "#d9dce5", ink: "#35394b", art: "JUNGLE",
    description: "A cozy hoodie concept for your next adventure."
  },
  {
    id: 3, name: "Banana Bucket Hat", category: "accessories",
    price: 19, tag: "", type: "hat",
    bg: "#f2e6bd", ink: "#c69d28", art: "BANANA",
    description: "A playful bucket hat with bright jungle energy."
  },
  {
    id: 4, name: "Monke Backpack", category: "accessories",
    price: 32, tag: "POPULAR", type: "bag",
    bg: "#d8e3e4", ink: "#31545a", art: "M",
    description: "A simple backpack concept for carrying your everyday stuff."
  },
  {
    id: 5, name: "Jungle Sticker Pack", category: "collectibles",
    price: 8, tag: "", type: "sticker",
    bg: "#f0d9d0", ink: "#b85c40", art: "✳",
    description: "A collection of fun jungle-inspired sticker designs."
  },
  {
    id: 6, name: "Golden Banana Pin", category: "collectibles",
    price: 12, tag: "LIMITED", type: "sticker",
    bg: "#f1e5b6", ink: "#a57b18", art: "🍌",
    description: "A little collectible pin concept to add to your collection."
  }
];

let cart = [];
let activeFilter = "all";
let searchTerm = "";

const grid = document.getElementById("productGrid");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const toast = document.getElementById("toast");

function money(value) {
  return "$" + value.toFixed(2);
}

function artClass(type) {
  return {
    shirt: "art-shirt",
    hat: "art-hat",
    bag: "art-bag",
    sticker: "art-sticker"
  }[type] || "";
}

function renderProducts() {
  let shown = products.filter(product => {
    const categoryMatch =
      activeFilter === "all" || product.category === activeFilter;
    const searchMatch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const sort = document.getElementById("sortSelect").value;
  if (sort === "low") shown.sort((a, b) => a.price - b.price);
  if (sort === "high") shown.sort((a, b) => b.price - a.price);
  if (sort === "az") shown.sort((a, b) => a.name.localeCompare(b.name));

  document.getElementById("productCount").textContent =
    `${shown.length.toString().padStart(2, "0")} ITEMS`;

  document.getElementById("emptyState").hidden = shown.length !== 0;

  grid.innerHTML = shown.map(product => `
    <article class="product-card" data-id="${product.id}">
      <div class="product-image"
        style="--product-bg:${product.bg};--product-ink:${product.ink}">
        ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ""}
        <div class="product-art ${artClass(product.type)}">${product.art}</div>
        <button class="quick-add" data-add="${product.id}">ADD TO BAG +</button>
      </div>
      <div class="product-info">
        <div>
          <div class="product-name">${product.name}</div>
          <div class="product-category">${product.category.toUpperCase()}</div>
        </div>
        <div class="product-price">${money(product.price)}</div>
      </div>
    </article>
  `).join("");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function addToCart(id) {
  const existing = cart.find(item => item.id === id);
  if (existing) existing.quantity++;
  else cart.push({ id, quantity: 1 });

  renderCart();
  showToast("Added to your bag ✓");
}

function renderCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => {
    const product = products.find(product => product.id === item.id);
    return sum + product.price * item.quantity;
  }, 0);

  document.getElementById("cartCount").textContent = totalItems;
  document.getElementById("drawerCount").textContent = `(${totalItems})`;
  document.getElementById("subtotal").textContent = money(totalPrice);

  const container = document.getElementById("cartItems");

  if (cart.length === 0) {
    container.innerHTML = `<p class="empty-state">Your bag is empty.<br>Go find something good.</p>`;
    return;
  }

  container.innerHTML = cart.map(item => {
    const product = products.find(product => product.id === item.id);
    return `
      <div class="cart-row">
        <div class="cart-thumb"
          style="--product-bg:${product.bg};color:${product.ink}">
          ${product.art}
        </div>
        <div>
          <strong>${product.name}</strong>
          <small>${money(product.price)}</small>
          <div class="quantity">
            <button data-change="${product.id}" data-amount="-1">−</button>
            <span>${item.quantity}</span>
            <button data-change="${product.id}" data-amount="1">+</button>
          </div>
        </div>
        <button class="remove-item" data-remove="${product.id}" aria-label="Remove item">×</button>
      </div>
    `;
  }).join("");
}

function openCart() {
  cartDrawer.classList.add("open");
  overlay.classList.add("visible");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("visible");
}

function openProduct(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;

  document.getElementById("modalContent").innerHTML = `
    <div class="modal-layout">
      <div class="modal-art"
        style="--product-bg:${product.bg};color:${product.ink}">
        ${product.art}
      </div>
      <div class="modal-details">
        <div class="eyebrow">${product.category.toUpperCase()}</div>
        <h2>${product.name}</h2>
        <div class="modal-price">${money(product.price)}</div>
        <p>${product.description}</p>
        <button class="modal-add" data-add="${product.id}">ADD TO BAG — ${money(product.price)}</button>
      </div>
    </div>
  `;

  document.getElementById("productModal").classList.add("open");
  overlay.classList.add("visible");
}

function closeModal() {
  document.getElementById("productModal").classList.remove("open");
  overlay.classList.remove("visible");
}

// Product grid actions
grid.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add]");
  if (addButton) {
    event.stopPropagation();
    addToCart(Number(addButton.dataset.add));
    return;
  }

  const card = event.target.closest(".product-card");
  if (card) openProduct(Number(card.dataset.id));
});

// Modal actions
document.getElementById("modalContent").addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  addToCart(Number(button.dataset.add));
  closeModal();
});

// Cart quantity actions
document.getElementById("cartItems").addEventListener("click", event => {
  const changeButton = event.target.closest("[data-change]");
  const removeButton = event.target.closest("[data-remove]");

  if (changeButton) {
    const id = Number(changeButton.dataset.change);
    const amount = Number(changeButton.dataset.amount);
    const item = cart.find(item => item.id === id);

    if (item) {
      item.quantity += amount;
      if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== id);
      }
    }
    renderCart();
  }

  if (removeButton) {
    const id = Number(removeButton.dataset.remove);
    cart = cart.filter(item => item.id !== id);
    renderCart();
  }
});

// Category filters
document.getElementById("filters").addEventListener("click", event => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;

  activeFilter = button.dataset.filter;

  document.querySelectorAll(".filter").forEach(filter => {
    filter.classList.toggle("active", filter === button);
  });

  renderProducts();
});

document.getElementById("sortSelect").addEventListener("change", renderProducts);

// Search controls
document.getElementById("searchButton").addEventListener("click", () => {
  document.getElementById("searchPanel").classList.toggle("visible");
  document.getElementById("searchInput").focus();
});

document.getElementById("closeSearch").addEventListener("click", () => {
  document.getElementById("searchPanel").classList.remove("visible");
  document.getElementById("searchInput").value = "";
  searchTerm = "";
  renderProducts();
});

document.getElementById("searchInput").addEventListener("input", event => {
  searchTerm = event.target.value;
  renderProducts();
});

// Drawer and modal controls
document.getElementById("cartButton").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("closeModal").addEventListener("click", closeModal);

overlay.addEventListener("click", () => {
  closeCart();
  closeModal();
});

document.getElementById("checkoutButton").addEventListener("click", () => {
  showToast("This is a demo store — checkout is disabled.");
});

// Mobile navigation
document.getElementById("menuButton").addEventListener("click", () => {
  document.getElementById("nav").classList.toggle("open");
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("nav").classList.remove("open");
  });
});

// Keyboard support
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeCart();
    closeModal();
  }
});

renderProducts();
renderCart();
