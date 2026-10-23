const PRODUCTS = [
    { name: "Birthday Gift Box", price: 799, image: "images/birthday.jpg" },
    { name: "Flower Bouquet", price: 599, image: "images/flower.avif" },
    { name: "Teddy Bear", price: 699, image: "images/teddy.avif" },
    { name: "Wedding Surprise Box", price: 1499, image: "images/surprise.jpg" },
    { name: "Chocolate Hamper", price: 899, image: "images/chocolate.jpg" },
    { name: "Premium Gift Basket", price: 1999, image: "images/premium.jpg" },
    { name: "Luxury Perfume Set", price: 1299, image: "images/perfume.avif" },
    { name: "Soft Toy Collection", price: 999, image: "images/toys.avif" },
    { name: "Greeting Card Pack", price: 299, image: "images/card.avif" },
    { name: "Photo Frame Gift", price: 549, image: "images/photo.avif" },
    { name: "Love Gift Combo", price: 1599, image: "images/love.avif" },
    { name: "Festival Gift Box", price: 899, image: "images/festival.avif" }
];

function getCart() {
    try {
        return JSON.parse(localStorage.getItem("giftNestCart")) || [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem("giftNestCart", JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const count = document.getElementById("cart-count");
    if (count) {
        count.textContent = getCart().reduce((sum, item) => sum + item.quantity, 0);
    }
}

function addToCart(index) {
    const product = PRODUCTS[index];
    if (!product) return;

    const cart = getCart();
    const existing = cart.find(item => item.name === product.name);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart(cart);
    alert(product.name + " added to your cart!");
}

function checkout() {
    if (getCart().length === 0) {
        alert("Your cart is empty! Please add a gift first.");
        return;
    }

    window.location.href = "checkout.html";
}

function openCart() {
    window.location.href = "cart.html";
}

function formatPrice(price) {
    return "₹" + price.toLocaleString("en-IN");
}

function renderCart() {
    const container = document.getElementById("cart-items");
    const totalElement = document.getElementById("cart-total");
    if (!container || !totalElement) return;

    const cart = getCart();

    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty. <a href='gifts.html'>Explore gifts</a></p>";
        totalElement.textContent = formatPrice(0);
        return;
    }

    container.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" style="width:100px;height:100px;object-fit:cover;border-radius:10px">
            <div>
                <h3>${item.name}</h3>
                <p>${formatPrice(item.price)}</p>
                <button type="button" onclick="changeQuantity(${index}, -1)">−</button>
                <span>${item.quantity}</span>
                <button type="button" onclick="changeQuantity(${index}, 1)">+</button>
                <button type="button" onclick="removeItem(${index})">Remove</button>
            </div>
        </div>
    `).join("");

    totalElement.textContent = formatPrice(
        cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    );
}

function changeQuantity(index, amount) {
    const cart = getCart();
    if (!cart[index]) return;

    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart(cart);
    renderCart();
    renderCheckout();
}

function removeItem(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
    renderCheckout();
}

function renderCheckout() {
    const summary = document.getElementById("checkout-summary");
    const totalElement = document.getElementById("checkout-total");
    if (!summary || !totalElement) return;

    const cart = getCart();

    if (cart.length === 0) {
        summary.innerHTML = "<p>Your cart is empty. <a href='gifts.html'>Choose gifts</a></p>";
        totalElement.textContent = formatPrice(0);
        return;
    }

    summary.innerHTML = cart.map(item => `
        <p>${item.name} × ${item.quantity} — ${formatPrice(item.price * item.quantity)}</p>
    `).join("");

    totalElement.textContent = formatPrice(
        cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    );
}

function placeOrder(event) {
    event.preventDefault();

    const cart = getCart();
    if (cart.length === 0) {
        alert("Your cart is empty!");
        window.location.href = "gifts.html";
        return;
    }

    const form = event.target;
    if (!form.reportValidity()) return;

    const customerName = document.getElementById("customer-name").value.trim();
    const orderNumber = "GN" + Date.now().toString().slice(-8);

    document.getElementById("checkout-form").hidden = true;
    document.getElementById("order-success").hidden = false;
    document.getElementById("checkout-details").hidden = true;
    document.getElementById("order-number").textContent = orderNumber;
    document.getElementById("order-customer").textContent = customerName;

    localStorage.setItem("giftNestLastOrder", JSON.stringify({
        orderNumber,
        customerName,
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        date: new Date().toLocaleString()
    }));

    localStorage.removeItem("giftNestCart");
updateCartCount();

// Hide the checkout summary after successful order
const summary = document.getElementById("checkout-summary");
const total = document.getElementById("checkout-total");

if (summary) summary.parentElement.hidden = true;
if (total) total.parentElement.hidden = true;
}

document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    renderCart();
    renderCheckout();

    const cartIcon = document.querySelector("header .cart");
    if (cartIcon) {
        cartIcon.style.cursor = "pointer";
        cartIcon.setAttribute("role", "link");
        cartIcon.setAttribute("tabindex", "0");
        cartIcon.setAttribute("aria-label", "Open shopping cart");
        cartIcon.addEventListener("click", openCart);
        cartIcon.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openCart();
            }
        });
    }
});