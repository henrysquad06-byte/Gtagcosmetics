
const products = [
  {name:"Banana Crown", category:"Hats", price:250, emoji:"🍌", desc:"A legendary banana crown."},
  {name:"Pickle Hat", category:"Hats", price:150, emoji:"🥒", desc:"The ultimate pickle style."},
  {name:"Wizard Hat", category:"Hats", price:300, emoji:"🧙", desc:"Magical forest fashion."},
  {name:"Toaster Head", category:"Hats", price:200, emoji:"🍞", desc:"Toast your competition."},
  {name:"Berry Backpack", category:"Backpacks", price:350, emoji:"🫐", desc:"Carry your berries."},
  {name:"Frog Backpack", category:"Backpacks", price:400, emoji:"🐸", desc:"A tiny frog companion."},
  {name:"Crab Backpack", category:"Backpacks", price:450, emoji:"🦀", desc:"A crabby companion."},
  {name:"Turtle Backpack", category:"Backpacks", price:350, emoji:"🐢", desc:"Slow and steady."},
  {name:"Squid Badge", category:"Badges", price:100, emoji:"🦑", desc:"Show off your badge."},
  {name:"Goblin Badge", category:"Badges", price:125, emoji:"👺", desc:"A mysterious badge."},
  {name:"Muffin Badge", category:"Badges", price:100, emoji:"🧁", desc:"A sweet collectible."},
  {name:"Spoon Monkey", category:"Badges", price:200, emoji:"🐒", desc:"The spoon legend."},
  {name:"Yellow Aura", category:"Other", price:500, emoji:"✨", desc:"Glow with style."},
  {name:"Cosmic Cheese", category:"Other", price:600, emoji:"🧀", desc:"Out of this world."},
  {name:"Giant Spoon", category:"Other", price:275, emoji:"🥄", desc:"A very large spoon."},
  {name:"Glitch Effect", category:"Other", price:550, emoji:"⚡", desc:"A digital mystery."}
];

let cart = [];

function renderProducts(items) {
  const grid = document.getElementById("productGrid");

  grid.innerHTML = items.map((item, index) => `
    <article class="product-card">
      <div class="product-image">${item.emoji}</div>
      <div class="product-info">
        <small>${item.category.toUpperCase()}</small>
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
        <div class="product-bottom">
          <span class="price">💎 ${item.price}</span>
          <button class="add-button" onclick="addToCart('${item.name}',${item.price})">
            ADD TO CART
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

function filterItems(category, button) {
  document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
  button.classList.add("active");

  const filtered = category === "All"
    ? products
    : products.filter(p => p.category === category);

  renderProducts(filtered);
}

function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({name, price, quantity:1});
  }

  updateCart();
}

function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  updateCart();
}

function updateCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartTotal").textContent = total + " 💎";

  document.getElementById("cartItems").innerHTML = cart.length
    ? cart.map(item => `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong><br>
          <small>${item.quantity} × ${item.price} 💎</small>
        </div>
        <button class="add-button" onclick="removeFromCart('${item.name}')">REMOVE</button>
      </div>
    `).join("")
    : "<p>Your cart is empty.</p>";
}

function toggleCart() {
  document.getElementById("cartPanel").classList.toggle("open");
  document.getElementById("cartOverlay").classList.toggle("open");
}

function checkout() {
  if (!cart.length) {
    alert("Your cart is empty!");
    return;
  }

  alert("This is a demo shop. No real purchases are available.");
}

renderProducts(products);
updateCart();
