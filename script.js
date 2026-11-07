
/* =========================================
   MINIMAL JEWELLERY - JAVASCRIPT
========================================= */

// PRODUCT DATA

const products = [
    {
        id: 1,
        name: "Golden Glow Necklace",
        category: "Necklaces",
        price: 1299,
        tag: "BESTSELLER",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 2,
        name: "Pearl Drop Earrings",
        category: "Earrings",
        price: 899,
        tag: "NEW",
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 3,
        name: "Classic Charm Bracelet",
        category: "Bracelets",
        price: 1099,
        tag: "POPULAR",
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 4,
        name: "Everyday Gold Ring",
        category: "Rings",
        price: 749,
        tag: "NEW",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 5,
        name: "Dainty Layered Necklace",
        category: "Necklaces",
        price: 1499,
        tag: "TRENDING",
        image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 6,
        name: "Golden Hoops",
        category: "Earrings",
        price: 999,
        tag: "BESTSELLER",
        image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 7,
        name: "Minimal Cuff Bracelet",
        category: "Bracelets",
        price: 1199,
        tag: "POPULAR",
        image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 8,
        name: "Elegant Solitaire Ring",
        category: "Rings",
        price: 1599,
        tag: "SPECIAL",
        image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=700&q=85"
    }
];


// ELEMENTS

const productGrid = document.getElementById("productGrid");

const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");

const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const wishlistCount = document.getElementById("wishlistCount");

const toast = document.getElementById("toast");


// STATE

let cart = [];
let wishlist = [];

let currentFilter = "All";
let searchTerm = "";
let showAllProducts = false;


// FORMAT PRICE

function formatPrice(price) {
    return "₹" + price.toLocaleString("en-IN");
}


// TOAST NOTIFICATION

let toastTimer;

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);

}


// DISPLAY PRODUCTS

function displayProducts() {

    let filteredProducts = products.filter(product => {

        const matchesCategory =
            currentFilter === "All" ||
            product.category === currentFilter;

        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm);

        return matchesCategory && matchesSearch;

    });

    const visibleProducts = showAllProducts
        ? filteredProducts
        : filteredProducts.slice(0, 8);

    productGrid.innerHTML = "";

    if (visibleProducts.length === 0) {

        productGrid.innerHTML = `
            <div class="no-products">
                <h3>No jewellery found ♡</h3>
                <p>Try searching for something else.</p>
            </div>
        `;

        return;
    }

    visibleProducts.forEach(product => {

        const isLiked = wishlist.includes(product.id);

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >

                <span class="product-tag">${product.tag}</span>

                <button
                    class="wishlist-heart ${isLiked ? "liked" : ""}"
                    data-id="${product.id}"
                    aria-label="Add ${product.name} to wishlist"
                    aria-pressed="${isLiked}"
                >
                    <i class="${isLiked ? "fa-solid" : "fa-regular"} fa-heart"></i>
                </button>

                <button
                    class="quick-add"
                    data-id="${product.id}"
                >
                    ADD TO BAG +
                </button>

            </div>

            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3>${product.name}</h3>

                <p class="product-price">
                    ${formatPrice(product.price)}
                </p>

            </div>

        `;

        productGrid.appendChild(card);

    });

}


// PRODUCT FILTERS

const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        showAllProducts = false;

        displayProducts();

    });

});


// PRODUCT CARD BUTTONS

productGrid.addEventListener("click", function(event) {

    const addButton = event.target.closest(".quick-add");

    const wishlistButton = event.target.closest(".wishlist-heart");

    if (addButton) {

        const productId = Number(addButton.dataset.id);

        addToCart(productId);

    }

    if (wishlistButton) {

        const productId = Number(wishlistButton.dataset.id);

        toggleWishlist(productId);

    }

});


// ADD TO CART

function addToCart(productId) {

    const product = products.find(item => item.id === productId);

    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }

    updateCart();

    showToast(product.name + " added to your bag ♡");

}


// UPDATE CART

function updateCart() {

    cartItems.innerHTML = "";

    let total = 0;

    let totalQuantity = 0;

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Your bag is waiting for something lovely ♡
            </p>
        `;

    }

    cart.forEach(item => {

        total += item.price * item.quantity;

        totalQuantity += item.quantity;

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `

            <img src="${item.image}" alt="${item.name}">

            <div class="cart-item-info">

                <h4>${item.name}</h4>

                <p>${formatPrice(item.price)}</p>

                <div class="cart-quantity">

                    <button
                        data-action="decrease"
                        data-id="${item.id}"
                        aria-label="Decrease quantity"
                    >−</button>

                    <span>${item.quantity}</span>

                    <button
                        data-action="increase"
                        data-id="${item.id}"
                        aria-label="Increase quantity"
                    >+</button>

                </div>

                <button
                    data-action="remove"
                    data-id="${item.id}"
                >
                    Remove
                </button>

            </div>

        `;

        cartItems.appendChild(cartItem);

    });

    cartCount.textContent = totalQuantity;

    cartTotal.textContent = formatPrice(total);

}


// CART QUANTITY AND REMOVE

cartItems.addEventListener("click", function(event) {

    const button = event.target.closest("button");

    if (!button) return;

    const productId = Number(button.dataset.id);

    const action = button.dataset.action;

    const item = cart.find(item => item.id === productId);

    if (!item) return;

    if (action === "increase") {

        item.quantity++;

    }

    else if (action === "decrease") {

        item.quantity--;

        if (item.quantity <= 0) {

            cart = cart.filter(item => item.id !== productId);

        }

    }

    else if (action === "remove") {

        cart = cart.filter(item => item.id !== productId);

        showToast("Product removed from your bag.");

    }

    updateCart();

});


// OPEN CART

function openCart() {

    cartSidebar.classList.add("show");

    cartOverlay.classList.add("show");

    document.body.style.overflow = "hidden";

}


// CLOSE CART

function closeCart() {

    cartSidebar.classList.remove("show");

    cartOverlay.classList.remove("show");

    document.body.style.overflow = "";

}

document.getElementById("cartBtn").addEventListener("click", openCart);

document.getElementById("closeCart").addEventListener("click", closeCart);

cartOverlay.addEventListener("click", closeCart);


// CHECKOUT DEMO

document.getElementById("checkoutBtn").addEventListener("click", () => {

    if (cart.length === 0) {

        showToast("Your shopping bag is empty!");

        return;

    }

    showToast("Thank you! Checkout is a demo feature.");

});


// WISHLIST

function toggleWishlist(productId) {

    const index = wishlist.indexOf(productId);

    if (index === -1) {

        wishlist.push(productId);

        showToast("Added to your wishlist ♡");

    } else {

        wishlist.splice(index, 1);

        showToast("Removed from your wishlist.");

    }

    wishlistCount.textContent = wishlist.length;

    displayProducts();

}


// WISHLIST BUTTON

document.getElementById("wishlistBtn").addEventListener("click", () => {

    currentFilter = "All";

    filterButtons.forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.filter === "All"
        );
    });

    showAllProducts = true;

    const wishlistProducts = products.filter(product =>
        wishlist.includes(product.id)
    );

    searchTerm = "";

    document.getElementById("searchInput").value = "";

    productGrid.innerHTML = "";

    if (wishlistProducts.length === 0) {

        productGrid.innerHTML = `
            <div class="no-products">
                <h3>Your wishlist is empty ♡</h3>
                <p>Tap the heart on a product to save it here.</p>
            </div>
        `;

    } else {

        wishlistProducts.forEach(product => {

            const card = document.createElement("div");

            card.className = "product-card";

            card.innerHTML = `

                <div class="product-image">

                    <img src="${product.image}" alt="${product.name}">

                    <button
                        class="wishlist-heart liked"
                        data-id="${product.id}"
                        aria-label="Remove from wishlist"
                        aria-pressed="true"
                    >
                        <i class="fa-solid fa-heart"></i>
                    </button>

                    <button
                        class="quick-add"
                        data-id="${product.id}"
                    >
                        ADD TO BAG +
                    </button>

                </div>

                <div class="product-info">

                    <span class="product-category">
                        ${product.category}
                    </span>

                    <h3>${product.name}</h3>

                    <p class="product-price">
                        ${formatPrice(product.price)}
                    </p>

                </div>

            `;

            productGrid.appendChild(card);

        });

    }

    document.getElementById("products").scrollIntoView({
        behavior: "smooth"
    });

});


// SEARCH

const searchBtn = document.getElementById("searchBtn");

const searchBox = document.getElementById("searchBox");

const searchInput = document.getElementById("searchInput");

searchBtn.addEventListener("click", () => {

    searchBox.classList.toggle("show");

    if (searchBox.classList.contains("show")) {

        searchInput.focus();

    }

});

document.getElementById("closeSearch").addEventListener("click", () => {

    searchBox.classList.remove("show");

    searchInput.value = "";

    searchTerm = "";

    displayProducts();

});

searchInput.addEventListener("input", () => {

    searchTerm = searchInput.value.trim().toLowerCase();

    showAllProducts = true;

    displayProducts();

});


// COLLECTION CATEGORY CLICK

document.querySelectorAll(".collection-card").forEach(card => {

    card.addEventListener("click", () => {

        const category = card.dataset.category;

        currentFilter = category;

        showAllProducts = true;

        searchTerm = "";

        searchInput.value = "";

        filterButtons.forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.filter === category
            );

        });

        displayProducts();

    });

});


// VIEW ALL PRODUCTS

document.getElementById("viewAllBtn").addEventListener("click", () => {

    currentFilter = "All";

    showAllProducts = true;

    searchTerm = "";

    searchInput.value = "";

    filterButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.filter === "All"
        );

    });

    displayProducts();

});


// MOBILE MENU

const menuBtn = document.getElementById("menuBtn");

const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {

    navLinks.classList.toggle("show");

    const icon = menuBtn.querySelector("i");

    icon.classList.toggle("fa-bars");

    icon.classList.toggle("fa-xmark");

});


// CLOSE MOBILE MENU AFTER CLICKING LINK

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("show");

        menuBtn.querySelector("i").classList.add("fa-bars");

        menuBtn.querySelector("i").classList.remove("fa-xmark");

    });

});


// NEWSLETTER

const newsletterForm = document.getElementById("newsletterForm");

newsletterForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const email = document.getElementById("emailInput").value.trim();

    const message = document.getElementById("newsletterMessage");

    if (!email || !email.includes("@")) {

        message.textContent = "Please enter a valid email address.";

        return;

    }

    message.textContent = "Thank you for subscribing! Welcome to our little world ♡";

    newsletterForm.reset();

});


// INITIALIZE WEBSITE

displayProducts();

updateCart();

wishlistCount.textContent = wishlist.length;

