/* Aurora Cakes v1 — frontend demo store */
const PRODUCTS = [
  {
    id: "chocolate",
    name: "Chocolate Cupcake",
    category: "Chocolate",
    price: 2500,
    image: "assets/chocolatecake.jfif",
    desc: "Rich chocolate cupcake with silky frosting.",
    trending: true,
  },
  {
    id: "strawberry",
    name: "Strawberry Cupcake",
    category: "Strawberry",
    price: 4500,
    image: "assets/strawberrycake.jpg.jpg",
    desc: "Fresh strawberry flavour with a soft cream finish.",
    trending: true,
  },
  {
    id: "vanilla",
    name: "Vanilla Cupcake",
    category: "Vanilla",
    price: 3000,
    image: "assets/vanillacake.jpg.jpg",
    desc: "Classic vanilla sponge with smooth buttercream.",
    trending: false,
  },
  {
    id: "redvelvet",
    name: "Red Velvet Cupcake",
    category: "Red Velvet",
    price: 5000,
    image: "assets/Redvelvet.jpg.jpg",
    desc: "Velvety cocoa sponge with rich cream topping.",
    trending: true,
  },
  {
    id: "lemon",
    name: "Lemon Cake",
    category: "Lemon",
    price: 3500,
    image: "assets/lemoncake.jpg",
    desc: "Bright lemon flavour with a soft, fresh crumb.",
    trending: true,
  },
  {
    id: "carrot",
    name: "Carrot Cake",
    category: "Carrot",
    price: 4000,
    image: "assets/carrot.jpg",
    desc: "Moist carrot cake with a comforting spice finish.",
    trending: true,
  },
];
const DELIVERY = {
  Ikeja: 2000,
  Yaba: 2500,
  Surulere: 2500,
  Maryland: 2000,
  Lekki: 3500,
  "Victoria Island": 3500,
};
const WA_NUMBER = "2348000000000"; // Replace with your real WhatsApp number
const money = (n) => "₦" + Number(n).toLocaleString("en-NG");
const getJSON = (k, f) => {
  try {
    return JSON.parse(localStorage.getItem(k)) ?? f;
  } catch {
    return f;
  }
};
const setJSON = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const user = () => getJSON("ac_user", null);
const cart = () => getJSON("ac_cart", []);
const favs = () => getJSON("ac_favorites", []);
const setCart = (v) => setJSON("ac_cart", v);
const setFavs = (v) => setJSON("ac_favorites", v);
function toast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}
function requireAuth() {
  if (!user()) {
    location.href = "auth.html";
    return false;
  }
  return true;
}
function updateCounts() {
  const c = cart().reduce((s, i) => s + i.qty, 0),
    f = favs().length;
  document.querySelectorAll("#cartCount").forEach((e) => (e.textContent = c));
  document.querySelectorAll("#favCount").forEach((e) => (e.textContent = f));
}
function navSetup() {
  const toggle = document.getElementById("navToggle"),
    nav = document.getElementById("nav");
  if (toggle && nav) toggle.onclick = () => nav.classList.toggle("open");
  document
    .querySelectorAll("[data-link]")
    .forEach((b) => (b.onclick = () => (location.href = b.dataset.link)));
}
function productCard(p) {
  const active = favs().includes(p.id);
  return `<article class="product-card"><div class="product-image"><img src="${p.image}" alt="${p.name}"><button class="fav ${active ? "active" : ""}" data-fav="${p.id}" aria-label="Favorite">${active ? "♥" : "♡"}</button></div><div class="product-info"><h3>${p.name}</h3><p>${p.desc}</p><div class="product-bottom"><span class="price">${money(p.price)}</span><div><button class="mini-btn" data-quick="${p.id}">View</button> <button class="mini-btn" data-add="${p.id}">+</button></div></div></div></article>`;
}
function renderProducts(el, items) {
  if (!el) return;
  el.innerHTML = items.map(productCard).join("");
  bindProductButtons();
}
function bindProductButtons() {
  document.querySelectorAll("[data-fav]").forEach(
    (b) =>
      (b.onclick = () => {
        let f = favs();
        f = f.includes(b.dataset.fav)
          ? f.filter((x) => x !== b.dataset.fav)
          : [...f, b.dataset.fav];
        setFavs(f);
        updateCounts();
        b.classList.toggle("active");
        b.textContent = f.includes(b.dataset.fav) ? "♥" : "♡";
      }),
  );
  document
    .querySelectorAll("[data-add]")
    .forEach((b) => (b.onclick = () => addToCart(b.dataset.add)));
  document
    .querySelectorAll("[data-quick]")
    .forEach((b) => (b.onclick = () => openQuick(b.dataset.quick)));
}
function addToCart(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return;
  let c = cart();
  const item = c.find((x) => x.id === id);
  if (item) item.qty++;
  else c.push({ id, qty: 1 });
  setCart(c);
  updateCounts();
  toast(`${p.name} added to cart`);
}
function openQuick(id) {
  const p = PRODUCTS.find((x) => x.id === id),
    m = document.getElementById("quickModal"),
    c = document.getElementById("quickContent");
  if (!p || !m || !c) return;
  c.innerHTML = `<img class="quick-image" src="${p.image}" alt="${p.name}"><h2>${p.name}</h2><p class="muted">${p.desc}</p><h3>${money(p.price)}</h3><button class="btn primary" data-add="${p.id}">Add to cart</button>`;
  m.classList.add("open");
  c.querySelector("[data-add]").onclick = () => {
    addToCart(id);
    m.classList.remove("open");
  };
}

function homePage() {
  renderProducts(document.getElementById("homeProducts"), PRODUCTS.slice(0, 5));
}
function menuPage() {
  const grid = document.getElementById("productGrid"),
    search = document.getElementById("productSearch"),
    filters = document.getElementById("filters");
  if (!grid) return;
  let cat = "All";
  filters.innerHTML = ["All", ...new Set(PRODUCTS.map((p) => p.category))]
    .map(
      (x) =>
        `<button class="filter ${x === "All" ? "active" : ""}" data-cat="${x}">${x}</button>`,
    )
    .join("");
  const draw = () => {
    const q = (search.value || "").toLowerCase();
    const items = PRODUCTS.filter(
      (p) =>
        (cat === "All" || p.category === cat) &&
        (p.name.toLowerCase().includes(q) ||
          p.desc.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)),
    );
    renderProducts(grid, items);
  };
  filters.querySelectorAll("[data-cat]").forEach(
    (b) =>
      (b.onclick = () => {
        cat = b.dataset.cat;
        filters
          .querySelectorAll(".filter")
          .forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
        draw();
      }),
  );
  search.oninput = draw;
  draw();
  document
    .getElementById("closeQuick")
    ?.addEventListener("click", () =>
      document.getElementById("quickModal").classList.remove("open"),
    );
}
function trendingPage() {
  renderProducts(
    document.getElementById("trendingProducts"),
    PRODUCTS.filter((p) => p.trending),
  );
}
function favPage() {
  const grid = document.getElementById("favoritesGrid");
  if (!grid) return;
  const items = PRODUCTS.filter((p) => favs().includes(p.id));
  grid.innerHTML = items.length
    ? items.map(productCard).join("")
    : '<div class="empty" style="grid-column:1/-1">No favourites yet. Go to the menu and tap ♡ on a cake you love.</div>';
  bindProductButtons();
}
function cartPage() {
  const root = document.getElementById("cartItems"),
    summary = document.getElementById("cartSummary");
  if (!root) return;
  const c = cart();
  if (!c.length) {
    root.innerHTML =
      '<div class="empty">Your cart is empty.<br><br><a class="btn primary" href="menu.html">Browse cakes</a></div>';
    summary.innerHTML = "";
    return;
  }
  root.innerHTML = c
    .map((i) => {
      const p = PRODUCTS.find((x) => x.id === i.id);
      return `<div class="cart-row"><img src="${p.image}" alt="${p.name}"><div><strong>${p.name}</strong><div class="muted">${money(p.price)} each</div></div><div class="qty"><button data-dec="${p.id}">−</button><strong>${i.qty}</strong><button data-inc="${p.id}">+</button></div><strong class="row-total">${money(p.price * i.qty)}</strong><button class="btn" data-remove="${p.id}">Remove</button></div>`;
    })
    .join("");
  const sub = c.reduce(
    (s, i) => s + PRODUCTS.find((p) => p.id === i.id).price * i.qty,
    0,
  );
  summary.innerHTML = `<h2>Summary</h2><div class="summary-line"><span>Subtotal</span><strong>${money(sub)}</strong></div><div class="summary-line"><span>Delivery</span><span>Calculated at checkout</span></div><div class="summary-line summary-total"><span>Total</span><span>${money(sub)}</span></div><a class="btn primary" style="width:100%;margin-top:1rem;text-align:center" href="checkout.html">Proceed to checkout</a>`;
  root
    .querySelectorAll("[data-inc]")
    .forEach((b) => (b.onclick = () => changeQty(b.dataset.inc, 1)));
  root
    .querySelectorAll("[data-dec]")
    .forEach((b) => (b.onclick = () => changeQty(b.dataset.dec, -1)));
  root.querySelectorAll("[data-remove]").forEach(
    (b) =>
      (b.onclick = () => {
        setCart(cart().filter((i) => i.id !== b.dataset.remove));
        cartPage();
        updateCounts();
      }),
  );
}
function changeQty(id, d) {
  let c = cart(),
    i = c.find((x) => x.id === id);
  if (!i) return;
  i.qty += d;
  if (i.qty <= 0) c = c.filter((x) => x.id !== id);
  setCart(c);
  cartPage();
  updateCounts();
}
function checkoutPage() {
  if (!requireAuth()) return;
  const form = document.getElementById("checkoutForm");
  if (!form) return;
  if (!cart().length) {
    location.href = "cart.html";
    return;
  }
  let fulfil = "pickup",
    payment = "transfer";
  const deliveryFields = document.getElementById("deliveryFields"),
    someone = document.getElementById("someoneFields"),
    summary = document.getElementById("checkoutSummary");
  const update = () => {
    deliveryFields.hidden = fulfil !== "delivery";
    someone.hidden = fulfil !== "someone";
    document
      .querySelectorAll("[data-fulfil]")
      .forEach((x) =>
        x.classList.toggle("active", x.dataset.fulfil === fulfil),
      );
    document
      .querySelectorAll("[data-payment]")
      .forEach((x) =>
        x.classList.toggle("active", x.dataset.payment === payment),
      );
    document
      .getElementById("transferBox")
      .classList.toggle("active", payment === "transfer");
    document
      .getElementById("cardBox")
      .classList.toggle("active", payment === "card");
    const sub = cart().reduce(
      (s, i) => s + PRODUCTS.find((p) => p.id === i.id).price * i.qty,
      0,
    );
    const fee =
      fulfil === "delivery"
        ? DELIVERY[document.getElementById("deliveryLocation").value] || 0
        : 0;
    summary.innerHTML = `<h2>Your order</h2>${cart()
      .map((i) => {
        const p = PRODUCTS.find((x) => x.id === i.id);
        return `<div class="summary-line"><span>${p.name} × ${i.qty}</span><strong>${money(p.price * i.qty)}</strong></div>`;
      })
      .join(
        "",
      )}<div class="summary-line"><span>Subtotal</span><strong>${money(sub)}</strong></div><div class="summary-line"><span>Delivery</span><strong>${money(fee)}</strong></div><div class="summary-line summary-total"><span>Total</span><strong>${money(sub + fee)}</strong></div>`;
  };
  document.querySelectorAll("[data-fulfil]").forEach(
    (b) =>
      (b.onclick = () => {
        fulfil = b.dataset.fulfil;
        update();
      }),
  );
  document.querySelectorAll("[data-payment]").forEach(
    (b) =>
      (b.onclick = () => {
        payment = b.dataset.payment;
        update();
      }),
  );
  document.getElementById("deliveryLocation").onchange = update;
  form.onsubmit = (e) => {
    e.preventDefault();
    const sub = cart().reduce(
        (s, i) => s + PRODUCTS.find((p) => p.id === i.id).price * i.qty,
        0,
      ),
      locationName = document.getElementById("deliveryLocation").value,
      fee = fulfil === "delivery" ? DELIVERY[locationName] || 0 : 0,
      total = sub + fee;
    const order = {
      id: "AC-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
      user: user().email,
      customer: user().name,
      items: cart(),
      subtotal: sub,
      deliveryFee: fee,
      total,
      fulfilment: fulfil,
      deliveryLocation: locationName,
      address: document.getElementById("deliveryAddress").value,
      pickupName: document.getElementById("pickupName").value,
      pickupPhone: document.getElementById("pickupPhone").value,
      payment,
      created: new Date().toISOString(),
      status: payment === "card" ? "Payment pending" : "Payment pending",
    };
    const orders = getJSON("ac_orders", []);
    orders.unshift(order);
    setJSON("ac_orders", orders);
    setJSON("ac_last_order", order);
    setCart([]);
    location.href = "receipt.html";
  };
  update();
}
function receiptPage() {
  const root = document.getElementById("receiptRoot");
  if (!root) return;
  const o = getJSON("ac_last_order", null);
  if (!o) {
    root.innerHTML = '<div class="empty">No recent order found.</div>';
    return;
  }
  const itemRows = o.items
    .map((i) => {
      const p = PRODUCTS.find((x) => x.id === i.id);
      return `<div class="summary-line"><span>${p.name} × ${i.qty}</span><strong>${money(p.price * i.qty)}</strong></div>`;
    })
    .join("");
  const message = `Hello Aurora Cakes 👋\n\nI have placed order ${o.id}.\nCustomer: ${o.customer}\nTotal: ${money(o.total)}\nPayment: ${o.payment}\nFulfilment: ${o.fulfilment}${o.deliveryLocation ? "\nLocation: " + o.deliveryLocation : ""}\n\nPlease confirm my payment/order.`;
  const wa = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
  root.innerHTML = `<div class="receipt"><div class="receipt-head"><div><img src="assets/logo4.svg" style="width:65px;height:65px;object-fit:contain"><h1>Aurora Cakes</h1><p class="muted">Order receipt</p></div><div><strong>${o.id}</strong><br><span class="status">${o.status}</span></div></div><div style="padding:1.5rem 0"><p><strong>Customer:</strong> ${o.customer}</p><p><strong>Payment:</strong> ${o.payment === "transfer" ? "Bank transfer" : "Card"}</p><p><strong>Fulfilment:</strong> ${o.fulfilment === "delivery" ? "Door delivery" : o.fulfilment === "someone" ? "Someone else pickup" : "Self pickup"}</p>${o.deliveryLocation ? `<p><strong>Location:</strong> ${o.deliveryLocation}<br><strong>Address:</strong> ${o.address}</p>` : ""}${o.pickupName ? `<p><strong>Pickup person:</strong> ${o.pickupName} (${o.pickupPhone})</p>` : ""}</div><div class="receipt-items">${itemRows}<div class="summary-line"><span>Subtotal</span><strong>${money(o.subtotal)}</strong></div><div class="summary-line"><span>Delivery</span><strong>${money(o.deliveryFee)}</strong></div><div class="summary-line summary-total"><span>Total</span><strong>${money(o.total)}</strong></div></div><p class="muted">Your payment is pending approval. Send this receipt to Aurora Cakes on WhatsApp so your payment can be verified.</p><div style="display:flex;gap:1rem;flex-wrap:wrap;margin-top:1.5rem"><a class="btn primary" href="${wa}" target="_blank">Send to WhatsApp</a><a class="btn" href="account.html">View my orders</a><button class="btn" onclick="window.print()">Print receipt</button></div></div>`;
}
function accountPage() {
  if (!requireAuth()) return;
  const u = user();
  document.getElementById("accountName").textContent = `Hello, ${u.name}`;
  document.getElementById("accountEmail").textContent = u.email;
  const list = document.getElementById("ordersList"),
    orders = getJSON("ac_orders", []).filter((o) => o.user === u.email);
  list.innerHTML = orders.length
    ? orders
        .map(
          (o) =>
            `<article class="order-card"><div class="order-card-head"><strong>${o.id}</strong><span class="status">${o.status}</span></div><p class="muted">${new Date(o.created).toLocaleString("en-NG")} · ${o.fulfilment} · ${o.payment}</p><strong>${money(o.total)}</strong></article>`,
        )
        .join("")
    : '<p class="muted">You have no orders yet.</p>';
  document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("ac_user");
    location.href = "auth.html";
  };
}
function contactPage() {
  const a = document.getElementById("whatsappContact");
  if (a)
    a.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hello Aurora Cakes 👋 I would like to make an enquiry.")}`;
}

document.addEventListener(
    "DOMContentLoaded",
    () => {

        // Store pages require authentication.

        if (!user()) {

            window.location.replace(
                "auth.html"
            );

            return;
        }


        navSetup();

        updateCounts();

        homePage();

        menuPage();

        trendingPage();

        favPage();

        cartPage();

        checkoutPage();

        receiptPage();

        accountPage();

        contactPage();

    }
);