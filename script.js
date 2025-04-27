// Full site logic: nav, cart, profile, slider, shop filtering

document.addEventListener("DOMContentLoaded", () => {
  // Hamburger Menu Toggle
  const hamburger = document.getElementById("hamburger");
  const navSection = document.getElementById("navSection");
  if (hamburger && navSection) {
    hamburger.addEventListener("click", () => {
      navSection.classList.toggle("show");
    });
  }

  // Dropdown Menus
  document.querySelectorAll(".dropdown").forEach((dropdown) => {
    const dropdownToggle = dropdown.querySelector(".dropbtn");
    const dropdownContent = dropdown.querySelector(".dropdown-content");

    if (dropdownToggle && dropdownContent) {
      dropdownToggle.addEventListener("click", (e) => {
        e.preventDefault();
        dropdown.classList.toggle("open");

        document.querySelectorAll(".dropdown").forEach((otherDropdown) => {
          if (otherDropdown !== dropdown) {
            otherDropdown.classList.remove("open");
          }
        });
      });
    }
  });

  // Account Icon Dropdown Toggle
  const accountIcon = document.getElementById("accountIcon");
  const accountDropdownMenu = document.getElementById("accountDropdownMenu");

  if (accountIcon && accountDropdownMenu) {
    accountIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      accountDropdownMenu.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest("#accountDropdownMenu") && !e.target.closest("#accountIcon")) {
        accountDropdownMenu.classList.remove("show");
      }
    });
  }

  // Close Shop Dropdowns on Outside Click
  document.addEventListener("click", (e) => {
    const isDropdown = e.target.closest(".dropdown");
    if (!isDropdown) {
      document.querySelectorAll(".dropdown").forEach((dropdown) => {
        dropdown.classList.remove("open");
      });
    }
  });

  // Inject Account Menu (Mobile)
  const accountMenuMobile = document.getElementById("accountMenuMobile");
  const user = JSON.parse(localStorage.getItem("drip_user"));
  if (accountMenuMobile) {
    accountMenuMobile.innerHTML = user
      ? `<li><a href="dashboard.html">Dashboard</a></li>
         <li><a href="profile.html">Profile</a></li>
         <li><a href="#" onclick="logout()">Logout</a></li>`
      : `<li><a href="login.html">Login</a></li>
         <li><a href="signup.html">Sign Up</a></li>`;
  }

  // Cart & Product Buttons
  updateCartCount();
  if (document.querySelector(".buy-button")) setupCartButtons();

  // FAQ Toggle
  document.querySelectorAll(".faq").forEach((faq) =>
    faq.addEventListener("click", () => faq.classList.toggle("active"))
  );

  // Shop filter
  const categorySelect = document.getElementById("categorySelect");
  if (categorySelect) {
    categorySelect.addEventListener("change", filterProducts);
    filterProducts();
  }

  // Slider setup
  fitSliderCards();
  initSliderControls();
  enableDragScroll();

  // Cart Display on Cart Page
  displayCartItems();

  // Checkout Summary on Checkout Page
  displayCheckoutItems();
});

// Global Functions

function logout() {
  localStorage.removeItem("drip_user");
  window.location.href = "index.html";
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  document.querySelectorAll("a[href='cart.html']").forEach((link) => {
    link.textContent = `Cart (${cart.length})`;
  });
}

function addToCart(name, price, image) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ name, price, quantity: 1, image });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Item added to cart!");
  updateCartCount();
  updateProductButtons();
}

function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCartItems();
  updateCartCount();
}

function addToCartFromCard(card) {
  const name = card.querySelector("h3")?.textContent;
  const price = parseFloat(card.querySelector(".price")?.textContent.replace("$", ""));
  const image = card.querySelector("img")?.getAttribute("src");
  addToCart(name, price, image);
}

function removeFromCartByName(name) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((item) => item.name !== name);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  updateProductButtons();
}

function updateProductButtons() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  document.querySelectorAll(".product-card").forEach((card) => {
    const name = card.querySelector("h3")?.textContent;
    const btn = card.querySelector("button");
    const inCart = cart.find((item) => item.name === name);
    if (btn) {
      btn.textContent = inCart ? "Remove from Cart" : "Add to Cart";

      // Clear old classes first
      btn.classList.remove("buy-button", "remove-button");

      if (inCart) {
        btn.classList.add("remove-button");
        btn.onclick = () => removeFromCartByName(name);
      } else {
        btn.classList.add("buy-button");
        btn.onclick = () => addToCartFromCard(card);
      }
    }
  });
}

function setupCartButtons() {
  updateProductButtons();
}

function filterProducts() {
  const sel = document.getElementById("categorySelect").value;
  document.querySelectorAll(".product-card").forEach((card) => {
    card.style.display =
      sel === "all" || card.dataset.category === sel ? "" : "none";
  });
}

function displayCartItems() {
  const cartItemsContainer = document.getElementById("cartItems");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p style='text-align:center;'>Your cart is empty.</p>";
    return;
  }

  cartItemsContainer.innerHTML = "";

  cart.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <div class="cart-details">
        <h3 class="cart-title">${item.name}</h3>
        <p>Quantity: ${item.quantity}</p>
        <p>Price: $${(item.price * item.quantity).toFixed(2)}</p>
        <button onclick="removeItem(${index})" class="remove-button">Remove</button>
      </div>
      <div class="cart-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
    `;
    cartItemsContainer.appendChild(itemDiv);
  });
}

function displayCheckoutItems() {
  const checkoutList = document.getElementById("checkoutList");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (!checkoutList) return;

  if (cart.length === 0) {
    checkoutList.innerHTML = "<p style='text-align:center;'>Your cart is empty.</p>";
    return;
  }

  let total = 0;
  checkoutList.innerHTML = "";

  cart.forEach(item => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "checkout-item";
    itemDiv.innerHTML = `
      <strong>${item.name}</strong> x ${item.quantity} — $${(item.price * item.quantity).toFixed(2)}
    `;
    checkoutList.appendChild(itemDiv);
    total += item.price * item.quantity;
  });

  const totalDiv = document.createElement("div");
  totalDiv.className = "checkout-total";
  totalDiv.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
  checkoutList.appendChild(totalDiv);
}

function fitSliderCards() {
  const s = document.querySelector(".product-slider");
  if (!s) return;
  const w = s.clientWidth;
  s.querySelectorAll(".product-card").forEach((c) => {
    c.style.minWidth = `${w}px`;
  });
}

function initSliderControls() {
  const slider = document.querySelector(".product-slider");
  if (!slider) return;
  const slides = slider.querySelectorAll(".product-card");
  let idx = 0;

  const prev = document.createElement("button");
  prev.className = "slider-btn prev";
  prev.innerHTML = "❮";
  const next = document.createElement("button");
  next.className = "slider-btn next";
  next.innerHTML = "❯";

  slider.style.position = "relative";
  slider.appendChild(prev);
  slider.appendChild(next);

  function go(i) {
    slider.scrollTo({ left: i * slider.clientWidth, behavior: "smooth" });
    idx = i;
  }
  prev.addEventListener("click", () =>
    go((idx - 1 + slides.length) % slides.length)
  );
  next.addEventListener("click", () => go((idx + 1) % slides.length));

  setInterval(() => go((idx + 1) % slides.length), 5000);
}

function enableDragScroll() {
  const slider = document.querySelector(".product-slider");
  if (!slider) return;
  let down = false,
    startX,
    scr;
  slider.style.cursor = "grab";
  slider.addEventListener("mousedown", (e) => {
    down = true;
    slider.classList.add("dragging");
    startX = e.pageX - slider.offsetLeft;
    scr = slider.scrollLeft;
  });
  slider.addEventListener("mouseleave", () => {
    down = false;
    slider.classList.remove("dragging");
  });
  slider.addEventListener("mouseup", () => {
    down = false;
    slider.classList.remove("dragging");
  });
  slider.addEventListener("mousemove", (e) => {
    if (!down) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scr - walk;
  });
}

// Service Worker Register
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .catch((e) => console.error(e));
}

// Adjust on Resize
window.addEventListener("resize", fitSliderCards);
