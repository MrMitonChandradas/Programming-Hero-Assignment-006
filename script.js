const API = {
  categories: "https://openapi.programming-hero.com/api/categories",
  plants: "https://openapi.programming-hero.com/api/plants",
  category: (id) => `https://openapi.programming-hero.com/api/category/${id}`,
  plant: (id) => `https://openapi.programming-hero.com/api/plant/${id}`,
};

const categoryList = document.getElementById("category-list");
const cardGrid = document.getElementById("card-grid");
const cartList = document.getElementById("cart-list");
const cartTotalEl = document.getElementById("cart-total");
const emptyCartMsg = document.getElementById("empty-cart");
const spinner = document.getElementById("spinner");
const modal = document.getElementById("plant-modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
const checkoutBtn = document.getElementById("checkout-btn");

let cart = [];

const manageSpinner = (status) => {
  if (status) {
    spinner.classList.remove("hidden");
    cardGrid.classList.add("hidden");
  } else {
    spinner.classList.add("hidden");
    cardGrid.classList.remove("hidden");
  }
};

const getId = (p) => p.plantId ?? p.id ?? p._id ?? String(Math.random());
const getName = (p) => p.plantName ?? p.name ?? "Unknown";
const getImg = (p) =>
  p.image ?? p.img ?? "https://via.placeholder.com/400x300?text=Plant";
const getDesc = (p) => p.description ?? p.details ?? "";
const getCat = (p) => p.category ?? p.category_name ?? "";
const getPrice = (p) => Number(p.price) || Math.floor(Math.random() * 20) + 5;

const loadCategories = () => {
  fetch(API.categories)
    .then((res) => res.json())
    .then((json) => {
      const cats = json?.data?.categories ?? json?.data ?? [];
      displayCategories(cats);
    })
    .catch(() => {
      categoryList.innerHTML =
        '<div class="text-red-500">Failed to load categories</div>';
    });
};

const displayCategories = (cats) => {
  categoryList.innerHTML = "";

  const allDiv = document.createElement("div");
  allDiv.className =
    "p-4 rounded-xl shadow cursor-pointer bg-green-700 text-white text-center font-semibold transition hover:scale-105";
  allDiv.textContent = "All Trees";
  allDiv.onclick = () => {
    highlightCategory(allDiv);
    loadAllPlants();
  };
  categoryList.appendChild(allDiv);

  cats.forEach((c) => {
    const catDiv = document.createElement("div");
    catDiv.className =
      "p-4 rounded-xl shadow cursor-pointer bg-white text-gray-800 text-center font-semibold hover:bg-green-50 transition hover:scale-105";
    catDiv.textContent = c.category ?? c.name ?? "Category";

    catDiv.onclick = () => {
      highlightCategory(catDiv);
      loadByCategory(c.category_id ?? c.id);
    };

    categoryList.appendChild(catDiv);
  });

  highlightCategory(allDiv);
};

const highlightCategory = (activeDiv) => {
  categoryList.querySelectorAll("div").forEach((el) => {
    el.classList.remove("bg-green-700", "text-white");
    el.classList.add("bg-white", "text-gray-800");
  });
  activeDiv.classList.remove("bg-white", "text-gray-800");
  activeDiv.classList.add("bg-green-700", "text-white");
};

const loadAllPlants = () => {
  manageSpinner(true);
  fetch(API.plants)
    .then((res) => res.json())
    .then((json) => {
      let plants = [];

      if (Array.isArray(json?.data)) plants = json.data;
      else if (Array.isArray(json?.plants)) plants = json.plants;
      else if (Array.isArray(json?.data?.plants)) plants = json.data.plants;

      displayPlants(plants);
    })
    .catch(() => {
      cardGrid.innerHTML =
        '<p class="col-span-full text-center text-red-500">Failed to load plants</p>';
    })
    .finally(() => manageSpinner(false));
};

const loadByCategory = (id) => {
  manageSpinner(true);
  fetch(API.category(id))
    .then((res) => res.json())
    .then((json) => {
      let plants = [];

      if (Array.isArray(json?.data)) plants = json.data;
      else if (Array.isArray(json?.plants)) plants = json.plants;
      else if (Array.isArray(json?.data?.plants)) plants = json.data.plants;

      displayPlants(plants);
    })
    .catch(() => {
      cardGrid.innerHTML =
        '<p class="col-span-full text-center text-red-500">Failed to load plants</p>';
    })
    .finally(() => manageSpinner(false));
};

const displayPlants = (items) => {
  cardGrid.innerHTML = "";

  if (!items || items.length === 0) {
    cardGrid.innerHTML =
      '<p class="col-span-full text-center text-gray-500">No trees found</p>';
    return;
  }

  items.forEach((raw) => {
    const plant = {
      id: getId(raw),
      name: getName(raw),
      img: getImg(raw),
      desc: getDesc(raw),
      cat: getCat(raw),
      price: getPrice(raw),
    };

    const card = document.createElement("article");
    card.className = "bg-white rounded shadow overflow-hidden";
    card.innerHTML = `
      <figure class="h-44 bg-gray-100">
        <img src="${plant.img}" alt="${
      plant.name
    }" class="w-full h-full object-cover">
      </figure>
      <div class="p-4">
        <div class="flex items-start justify-between gap-3">
          <h3 class="text-lg font-bold text-green-900 cursor-pointer hover:underline">${
            plant.name
          }</h3>
          <div class="bg-green-700 text-white px-3 py-1 rounded-full font-semibold">$${
            plant.price
          }</div>
        </div>
        <p class="text-sm text-gray-600 mt-2">${plant.desc.slice(0, 80)}${
      plant.desc.length > 80 ? "..." : ""
    }</p>
        <div class="mt-4 flex items-center justify-between">
          <small class="text-xs text-gray-500">${plant.cat}</small>
          <button class="btn btn-xs btn-primary">Add</button>
        </div>
      </div>
    `;

    card.querySelector("h3").onclick = () => loadPlantDetail(plant.id);
    card.querySelector("button").onclick = () => addToCart(plant);

    cardGrid.appendChild(card);
  });
};

const loadPlantDetail = (id) => {
  fetch(API.plant(id))
    .then((res) => res.json())
    .then((json) => {
      console.log("Plant Detail API Response:", json);
      displayPlantDetail(json.plants ?? {}); // 👈 এখানে ঠিক করা হলো
    })
    .catch(() => {
      modalTitle.textContent = "Error";
      modalBody.innerHTML = `<p class="text-red-500">Failed to load details</p>`;
      modal.showModal();
    });
};

const displayPlantDetail = (p) => {
  const name = p.name || "Unknown";
  const img = p.image || "https://via.placeholder.com/600x400?text=No+Image";
  const desc = p.description || "No description available.";
  const cat = p.category || "Unknown Category";
  const price = p.price || Math.floor(Math.random() * 20) + 5;

  modalTitle.textContent = name;
  modalBody.innerHTML = `
    <div class="grid md:grid-cols-2 gap-6">
      <div>
        <img src="${img}" alt="${name}" class="w-full h-60 object-cover rounded shadow">
      </div>
      <div>
        <p class="text-gray-700 mb-3">${desc}</p>
        <p class="mt-2 text-sm text-gray-500"><strong>Category:</strong> ${cat}</p>
        <p class="text-green-700 font-bold mt-2">Price: $${price}</p>
      </div>
    </div>
  `;
  modal.showModal();
};

const addToCart = (plant) => {
  const found = cart.find((it) => it.id === plant.id);
  if (found) found.qty += 1;
  else cart.push({ ...plant, qty: 1 });
  renderCart();
};

const renderCart = () => {
  cartList.innerHTML = "";

  if (cart.length === 0) {
    emptyCartMsg.style.display = "block";
    checkoutBtn.disabled = true;
  } else {
    emptyCartMsg.style.display = "none";
    checkoutBtn.disabled = false;

    cart.forEach((item, idx) => {
      const li = document.createElement("li");
      li.className =
        "flex justify-between items-center bg-green-50 p-2 rounded mb-2";
      li.innerHTML = `
        <div>
          <div class="font-medium">${item.name}</div>
          <div class="text-xs text-gray-600">$${item.price} × ${item.qty}</div>
        </div>
        <div class="flex items-center gap-2">
          <button class="btn btn-xs" data-act="minus">−</button>
          <button class="btn btn-xs" data-act="plus">+</button>
          <button class="btn btn-ghost btn-xs text-red-600" data-act="remove">✕</button>
        </div>
      `;
      li.onclick = (e) => {
        const act = e.target?.dataset?.act;
        if (!act) return;
        if (act === "minus") {
          item.qty -= 1;
          if (item.qty <= 0) cart.splice(idx, 1);
        }
        if (act === "plus") item.qty += 1;
        if (act === "remove") cart.splice(idx, 1);
        renderCart();
      };
      cartList.appendChild(li);
    });
  }

  const total = cart.reduce((s, it) => s + it.price * it.qty, 0);
  cartTotalEl.textContent = `$${total.toFixed(2)}`;
};

loadCategories();
loadAllPlants();
renderCart();
