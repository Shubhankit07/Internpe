// DOM Elements
const mobileMenuBtn = document.querySelector(".mobile-menu");
const nav = document.querySelector("nav");
const cartIcon = document.querySelector(".cart-icon");
const cartSidebar = document.querySelector(".cart-sidebar");
const closeCartBtn = document.querySelector(".close-cart");
const cartOverlay = document.querySelector(".cart-overlay");
const productGrid = document.getElementById("product-grid");
const filterBtns = document.querySelectorAll(".filter-btn");
const cartItemsContainer = document.querySelector(".cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.querySelector(".cart-count");
const checkoutBtn = document.querySelector(".checkout-btn");

// Cart array to store items
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Mobile menu toggle
mobileMenuBtn.addEventListener("click", () => {
  nav.classList.toggle("active");
  mobileMenuBtn.innerHTML = nav.classList.contains("active")
    ? "&times;"
    : '<i class="fas fa-bars"></i>';
});

// Cart toggle
cartIcon.addEventListener("click", () => {
  cartSidebar.classList.add("active");
  cartOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
});

closeCartBtn.addEventListener("click", () => {
  cartSidebar.classList.remove("active");
  cartOverlay.classList.remove("active");
  document.body.style.overflow = "auto";
});

cartOverlay.addEventListener("click", () => {
  cartSidebar.classList.remove("active");
  cartOverlay.classList.remove("active");
  document.body.style.overflow = "auto";
});

// Display products
function displayProducts(products) {
  productGrid.innerHTML = "";

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.dataset.category = product.category;

    productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">
                    <span class="price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart" data-id="${
                      product.id
                    }">Add to Cart</button>
                </div>
            </div>
        `;

    productGrid.appendChild(productCard);
  });

  // Add event listeners to add-to-cart buttons
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", addToCart);
  });
}

// Filter products
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove active class from all buttons
    filterBtns.forEach((btn) => btn.classList.remove("active"));
    // Add active class to clicked button
    btn.classList.add("active");

    const filter = btn.dataset.filter;
    const productCards = document.querySelectorAll(".product-card");

    productCards.forEach((card) => {
      if (filter === "all" || card.dataset.category === filter) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});

// Add to cart function
function addToCart(e) {
  const productId = parseInt(e.target.dataset.id);
  const product = products.find((p) => p.id === productId);

  // Check if product already in cart
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  updateCart();
  showAddedToCartMessage(product.name);
}

// Show added to cart message
function showAddedToCartMessage(productName) {
  const message = document.createElement("div");
  message.className = "cart-message";
  message.innerHTML = `
        <p>${productName} added to cart!</p>
    `;

  document.body.appendChild(message);

  setTimeout(() => {
    message.classList.add("show");
  }, 10);

  setTimeout(() => {
    message.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(message);
    }, 300);
  }, 3000);
}

// Update cart
function updateCart() {
  // Save cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Update cart count
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalItems;

  // Update cart items
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty</p>";
    cartTotal.textContent = "0.00";
  } else {
    let total = 0;

    cart.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";

      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-id="${
                          item.id
                        }">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn increase" data-id="${
                          item.id
                        }">+</button>
                    </div>
                </div>
                <button class="remove-item" data-id="${
                  item.id
                }">&times;</button>
            `;

      cartItemsContainer.appendChild(cartItem);
    });

    cartTotal.textContent = total.toFixed(2);

    // Add event listeners to quantity buttons
    document.querySelectorAll(".decrease").forEach((btn) => {
      btn.addEventListener("click", decreaseQuantity);
    });

    document.querySelectorAll(".increase").forEach((btn) => {
      btn.addEventListener("click", increaseQuantity);
    });

    document.querySelectorAll(".remove-item").forEach((btn) => {
      btn.addEventListener("click", removeItem);
    });
  }
}

// Decrease quantity
function decreaseQuantity(e) {
  const productId = parseInt(e.target.dataset.id);
  const item = cart.find((item) => item.id === productId);

  if (item.quantity > 1) {
    item.quantity -= 1;
  } else {
    cart = cart.filter((item) => item.id !== productId);
  }

  updateCart();
}

// Increase quantity
function increaseQuantity(e) {
  const productId = parseInt(e.target.dataset.id);
  const item = cart.find((item) => item.id === productId);

  item.quantity += 1;
  updateCart();
}

// Remove item
function removeItem(e) {
  const productId = parseInt(e.target.dataset.id);
  cart = cart.filter((item) => item.id !== productId);
  updateCart();
}

// Checkout
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
  } else {
    alert("Thank you for your purchase!");
    cart = [];
    updateCart();
    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");
    document.body.style.overflow = "auto";
  }
});

// Initialize
displayProducts(products);
updateCart();

// Add cart message styles dynamically
const style = document.createElement("style");
style.textContent = `
    .cart-message {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: var(--primary-color);
        color: white;
        padding: 15px 30px;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 1100;
    }
    
    .cart-message.show {
        opacity: 1;
    }
`;
document.head.appendChild(style);


// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70, // Adjust for fixed header
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    });
});

// Contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Here you would typically send this data to a server
        // For demonstration, we'll just show an alert
        alert(`Thank you, ${name}! Your message has been received. We'll contact you at ${email} soon.`);
        
        // Reset form
        contactForm.reset();
    });
}


// Newsletter form handling
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        alert(`Thank you for subscribing with ${email}! You'll receive our newsletter soon.`);
        this.reset();
    });
}



// Customer Service Information
const serviceContent = {
    shipping: {
        title: "Shipping Policy",
        content: "We offer free standard shipping on all orders over $50. Orders are processed within 1-2 business days and delivered within 3-5 business days. Express shipping options available at checkout."
    },
    returns: {
        title: "Return Policy",
        content: "Easy 30-day returns. Items must be unused with original tags. Return shipping is free for defective items. Refunds are processed within 3-5 business days after we receive your return."
    },
    faq: {
        title: "Frequently Asked Questions",
        content: "Q: How do I change my order? A: Contact us within 1 hour of placing your order. Q: Do you offer international shipping? A: Yes, to select countries with calculated rates at checkout."
    },
    "size-guide": {
        title: "Size Guide",
        content: "Our sizes run true to standard measurements. For clothing: XS (0-2), S (4-6), M (8-10), L (12-14), XL (16-18). Still unsure? Contact our sizing specialists for personalized recommendations."
    },
    tracking: {
        title: "Order Tracking",
        content: "Track your order by clicking the link in your shipping confirmation email. Having trouble? Contact us with your order number and we'll provide real-time updates on your shipment."
    }
};

// Service link functionality
document.querySelectorAll('.service-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const serviceType = this.dataset.service;
        const serviceInfo = document.getElementById('serviceInfo');
        
        // Hide all other active service info
        document.querySelectorAll('.service-info').forEach(info => {
            info.classList.remove('active');
        });
        
        // Set and show the clicked service info
        serviceInfo.innerHTML = `
            <h4>${serviceContent[serviceType].title}</h4>
            <p>${serviceContent[serviceType].content}</p>
            <a href="#contact" class="btn btn-small" style="margin-top: 10px; padding: 5px 10px; font-size: 0.8rem;">
                Need more help?
            </a>
        `;
        serviceInfo.classList.add('active');
        
        // Scroll to the info if on mobile
        if (window.innerWidth < 768) {
            serviceInfo.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
});

