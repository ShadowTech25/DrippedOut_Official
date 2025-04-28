// Full site logic: navbar toggle, cart system, profile dropdown, slider, shop filtering, service worker

document.addEventListener("DOMContentLoaded", () => { // Hamburger Menu Toggle const hamburger = document.getElementById("hamburger"); const navSection = document.getElementById("navSection"); if (hamburger && navSection) { hamburger.addEventListener("click", () => { navSection.classList.toggle("show"); }); }

// Dropdown Menus Toggle document.querySelectorAll(".dropdown").forEach((dropdown) => { const dropdownToggle = dropdown.querySelector(".dropbtn"); if (dropdownToggle) { dropdownToggle.addEventListener("click", (e) => { e.preventDefault(); dropdown.classList.toggle("open"); document.querySelectorAll(".dropdown").forEach((other) => { if (other !== dropdown) other.classList.remove("open"); }); }); } });

// Account Icon Dropdown Toggle const accountIcon = document.getElementById("accountIcon"); const accountDropdownMenu = document.getElementById("accountDropdownMenu"); if (accountIcon && accountDropdownMenu) { accountIcon.addEventListener("click", (e) => { e.stopPropagation(); accountDropdownMenu.classList.toggle("show"); });

document.addEventListener("click", (e) => {
  if (!e.target.closest("#accountDropdownMenu") && !e.target.closest("#accountIcon")) {
    accountDropdownMenu.classList.remove("show");
  }
});

}

// Cart Button/Count Setup updateCartCount(); setupCartButtons();

// Shop Filter if on products page const categorySelect = document.getElementById("categorySelect"); if (categorySelect) { categorySelect.addEventListener("change", filterProducts); filterProducts(); }

// Initialize Sliders and Dragging fitSliderCards(); initSliderControls(); enableDragScroll();

// Cart Display displayCartItems();

// Checkout Page Items displayCheckoutItems(); });

function logout() { localStorage.removeItem("drip_user"); window.location.href = "index.html"; }

function updateCartCount() { const cart = JSON.parse(localStorage.getItem("cart")) || []; document.querySelectorAll("a[href='cart.html']").forEach((link) => { link.textContent = Cart (${cart.length}); }); }

function addToCart(name, price, image) { let cart = JSON.parse(localStorage.getItem("cart")) || []; const existingItem = cart.find(item => item.name === name);

if (existingItem) { existingItem.quantity++; } else { cart.push({ name, price, quantity: 1, image }); }

localStorage.setItem("cart", JSON.stringify(cart)); alert("Item added to cart!"); updateCartCount(); updateProductButtons(); }

function removeItem(index) { let cart = JSON.parse(localStorage.getItem("cart")) || []; cart.splice(index, 1); localStorage.setItem("cart", JSON.stringify(cart)); displayCartItems(); updateCartCount(); }

function removeFromCartByName(name) { let cart = JSON.parse(localStorage.getItem("cart")) || []; cart = cart.filter(item => item.name !== name); localStorage.setItem("cart", JSON.stringify(cart)); updateCartCount(); updateProductButtons(); }

function addToCartFromCard(card) { const name = card.querySelector("h3")?.textContent; const price = parseFloat(card.querySelector(".price")?.textContent.replace("$", "")); const image = card.querySelector("img")?.getAttribute("src"); addToCart(name, price, image); }

function updateProductButtons() { const cart = JSON.parse(localStorage.getItem("cart")) || []; document.querySelectorAll(".product-card").forEach(card => { const name = card.querySelector("h3")?.textContent; const btn = card.querySelector("button"); const inCart = cart.find(item => item.name === name); if (btn) { btn.textContent = inCart ? "Remove from Cart" : "Add to Cart"; btn.className = inCart ? "remove-button" : "buy-button"; btn.onclick = () => inCart ? removeFromCartByName(name) : addToCartFromCard(card); } }); }

function setupCartButtons() { updateProductButtons(); }

function filterProducts() { const sel = document.getElementById("categorySelect").value; document.querySelectorAll(".product-card").forEach(card => { card.style.display = sel === "all" || card.dataset.category === sel ? "" : "none"; }); }

function displayCartItems() { const cartItemsContainer = document.getElementById("cartItems"); let cart = JSON.parse(localStorage.getItem("cart")) || [];

if (!cartItemsContainer) return;

cartItemsContainer.innerHTML = cart.length === 0 ? "<p style='text-align:center;'>Your cart is empty.</p>" : cart.map((item, index) => <div class="cart-item"> <div class="cart-details"> <h3 class="cart-title">${item.name}</h3> <p>Quantity: ${item.quantity}</p> <p>Price: $${(item.price * item.quantity).toFixed(2)}</p> <button onclick="removeItem(${index})" class="remove-button">Remove</button> </div> <div class="cart-image"> <img src="${item.image}" alt="${item.name}"> </div> </div>).join(""); }

function displayCheckoutItems() { const checkoutList = document.getElementById("checkoutList"); let cart = JSON.parse(localStorage.getItem("cart")) || [];

if (!checkoutList) return;

checkoutList.innerHTML = cart.length === 0 ? "<p style='text-align:center;'>Your cart is empty.</p>" : cart.map(item => <div class="checkout-item"> <strong>${item.name}</strong> x ${item.quantity} — $${(item.price * item.quantity).toFixed(2)} </div>).join("") + <div class="checkout-total"><strong>Total: $${cart.reduce((t, i) => t + (i.price * i.quantity), 0).toFixed(2)}</strong></div>; }

function fitSliderCards() { const slider = document.querySelector(".product-slider"); if (!slider) return; const w = slider.clientWidth; slider.querySelectorAll(".product-card").forEach(c => { c.style.minWidth = ${w}px; }); }

function initSliderControls() { const slider = document.querySelector(".product-slider"); if (!slider) return; const slides = slider.querySelectorAll(".product-card"); let idx = 0;

const prev = document.createElement("button"); prev.className = "slider-btn prev"; prev.innerHTML = "❮"; const next = document.createElement("button"); next.className = "slider-btn next"; next.innerHTML = "❯";

slider.style.position = "relative"; slider.appendChild(prev); slider.appendChild(next);

function go(i) { slider.scrollTo({ left: i * slider.clientWidth, behavior: "smooth" }); idx = i; } prev.addEventListener("click", () => go((idx - 1 + slides.length) % slides.length)); next.addEventListener("click", () => go((idx + 1) % slides.length));

setInterval(() => go((idx + 1) % slides.length), 5000); }

function enableDragScroll() { const slider = document.querySelector(".product-slider"); if (!slider) return; let down = false, startX, scrollLeft; slider.style.cursor = "grab"; slider.addEventListener("mousedown", (e) => { down = true; slider.classList.add("dragging"); startX = e.pageX - slider.offsetLeft; scrollLeft = slider.scrollLeft; }); slider.addEventListener("mouseleave", () => { down = false; slider.classList.remove("dragging"); }); slider.addEventListener("mouseup", () => { down = false; slider.classList.remove("dragging"); }); slider.addEventListener("mousemove", (e) => { if (!down) return; e.preventDefault(); const x = e.pageX - slider.offsetLeft; const walk = (x - startX) * 2; slider.scrollLeft = scrollLeft - walk; }); }

if ("serviceWorker" in navigator) { navigator.serviceWorker.register("service-worker.js").catch(e => console.error(e)); }

window.addEventListener("resize", fitSliderCards);

