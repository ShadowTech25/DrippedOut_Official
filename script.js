// Add product to cart (saves name, price (number), quantity, and image)
function addToCart(name, price, image) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ name, price, quantity: 1, image });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Item added to cart!');
  updateCartCount();
}

// Display cart items (for cart.html page)
function displayCartItems() {
  const cartItemsContainer = document.getElementById("cartItems");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (!cartItemsContainer) return; // If not on cart page, skip

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p style='text-align:center;'>Your cart is empty.</p>";
    return;
  }

  cartItemsContainer.innerHTML = "";

  cart.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.style.display = "flex";
    itemDiv.style.alignItems = "center";
    itemDiv.style.justifyContent = "space-between";
    itemDiv.style.borderBottom = "1px solid #ccc";
    itemDiv.style.padding = "15px 0";

    itemDiv.innerHTML = `
      <div style="flex: 1;">
        <h3 style="color:gold; margin-bottom:5px;">${item.name}</h3>
        <p>Quantity: ${item.quantity}</p>
        <p>Price: $${(item.price * item.quantity).toFixed(2)}</p>
        <button onclick="removeItem(${index})" style="margin-top:8px; background:black; color:gold; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">Remove</button>
      </div>
      <div style="flex: 0 0 80px; text-align:right;">
        <img src="${item.image}" alt="${item.name}" style="width:80px; height:auto; border-radius:8px;">
      </div>
    `;
    cartItemsContainer.appendChild(itemDiv);
  });
}

// Remove item from cart
function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  displayCartItems();
  updateCartCount();
}

// Display checkout cart summary (for checkout.html page)
function displayCheckoutItems() {
  const checkoutList = document.getElementById("checkoutList");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (!checkoutList) return; // If not on checkout page, skip

  if (cart.length === 0) {
    checkoutList.innerHTML = "<p style='text-align:center;'>Your cart is empty.</p>";
    return;
  }

  let total = 0;
  checkoutList.innerHTML = "";

  cart.forEach(item => {
    const itemDiv = document.createElement("div");
    itemDiv.style.marginBottom = "10px";
    itemDiv.innerHTML = `
      <strong style="color:gold;">${item.name}</strong> x ${item.quantity} — $${(item.price * item.quantity).toFixed(2)}
    `;
    checkoutList.appendChild(itemDiv);
    total += item.price * item.quantity;
  });

  const totalDiv = document.createElement("div");
  totalDiv.style.marginTop = "20px";
  totalDiv.innerHTML = `<strong style="color:gold;">Total: $${total.toFixed(2)}</strong>`;
  checkoutList.appendChild(totalDiv);
}

// Update cart item count in the nav
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  document.querySelectorAll("a[href='cart.html']").forEach(link => {
    link.textContent = `Cart (${cart.length})`;
  });
}

// Navbar hamburger toggle
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const navSection = document.getElementById("navSection");
  
  if (hamburger && navSection) {
    hamburger.addEventListener("click", () => {
      navSection.classList.toggle("show");
    });
  }

  document.querySelectorAll(".dropbtn").forEach(button => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const parent = this.parentElement;
      parent.classList.toggle("dropdown-open");

      document.querySelectorAll(".dropdown").forEach(drop => {
        if (drop !== parent) drop.classList.remove("dropdown-open");
      });
    });
  });

  // Run cart/checkout displays automatically
  displayCartItems();
  displayCheckoutItems();
  updateCartCount();
});
