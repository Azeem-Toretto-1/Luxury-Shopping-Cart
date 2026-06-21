const product = [
  {
    id: 1,
    name: "Cargo Short",
    price: 29,
    image: "./productsImages/cargo-short.png",
  },
  {
    id: 2,
    name: "Hoodie",
    price: 30,
    image: "./productsImages/hoodie.png",
  },
  {
    id: 3,
    name: "Denim Jeans",
    price: 35,
    image: "./productsImages/jeans.png",
  },
  {
    id: 4,
    name: "Leather Jacket",
    price: 50,
    image: "./productsImages/leather-jacket.png",
  },
  {
    id: 5,
    name: "Striped Shirt",
    price: 20,
    image: "./productsImages/striped-shirt.png",
  },
  {
    id: 6,
    name: "Summer Dress",
    price: 15,
    image: "./productsImages/summer-dress.png",
  },
  {
    id: 7,
    name: "Sweater",
    price: 30,
    image: "./productsImages/sweater.png",
  },
  {
    id: 8,
    name: "White T-Shirt",
    price: 29,
    image: "./productsImages/white-t-shirt.png",
  },
];

const productGrid = document.querySelector("#productGrid");
const cartIcon = document.querySelector("#cartIcon");
const sideBar = document.querySelector("#sideBar");
const closeBtn = document.querySelector("#closeBtn");
const overLay = document.querySelector("#overLay");
const cartContent = document.querySelector("#cartContent");
const sidebarFooter = document.querySelector("#sidebarFooter");
const cartBadge = document.querySelector("#cartBadge");
const totalPrice = document.querySelector("#totalPrice");
const cartMessage = document.querySelector("#cartMessage");
const addSound = document.querySelector("#addSound");
const removeSound = document.querySelector("#removeSound");
const checkoutBtn = document.querySelector(".checkout-btn");
const checkoutModal = document.querySelector("#checkoutModal");
const continueBtn = document.querySelector("#continueBtn");

let cart = [];

let saveCart = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const savedCart = localStorage.getItem("cart");

if (savedCart) {
  cart = JSON.parse(savedCart);
}

let toggleCart = () => {
  sideBar.classList.toggle("open");
  overLay.classList.toggle("active");
};

cartIcon.addEventListener("click", toggleCart);
closeBtn.addEventListener("click", toggleCart);
overLay.addEventListener("click", toggleCart);

let dispalyCards = () => {
  product.forEach((products) => {
    const productsCard = document.createElement("div");
    productsCard.className = "product-card";

    productsCard.innerHTML = `
      <div class="product-image">
        <img src="${products.image}" alt="${products.name}" />
      </div>

      <h2 class="product-name">${products.name}</h2>

      <p class="product-price">$${products.price}</p>

      <button class="add-btn">Add To Cart</button>
    `;

    const addBtn = productsCard.querySelector(".add-btn");

    addBtn.addEventListener("click", () => {
      addToCart(products);
    });

    productGrid.append(productsCard);
  });
};

let updateCart = () => {
  cartContent.innerHTML = "";

  cartBadge.textContent = cart.reduce((acc, item) => {
    return acc + item.quantity;
  }, 0);

  if (cart.length === 0) {
    cartContent.innerHTML = `

<div class="empty-cart">

<div class="empty-icon">

🛍️

</div>

<h3>

Your Cart Feels Lonely

</h3>

<p>

Add something amazing.

</p>

</div>

`;

    sidebarFooter.style.display = "none";
    return;
  }

  let total = 0;

  cart.forEach((products, index) => {
    total += products.price * products.quantity;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";

    cartItem.setAttribute("data-index", index);

    cartItem.innerHTML = `
      <div class="cart-item-image">
        <img src="${products.image}" alt="${products.name}" />
      </div>

      <div class="cart-item-details">

        <h3 class="cart-item-name">
          ${products.name}
        </h3>

        <p class="cart-item-price">
          $${products.price}
        </p>

        <div class="quantity-controlls">

          <button class="qty-btn decrease-btn">
            -
          </button>

          <div class="quantity">
            ${products.quantity}
          </div>

          <button class="qty-btn increase-btn">
            +
          </button>

        </div>

      </div>

      <button class="remove-btn">
        &times;
      </button>
    `;

    cartContent.append(cartItem);
  });

  totalPrice.textContent = `$${total.toFixed(2)}`;

  sidebarFooter.style.display = "block";
};

let addToCart = (products) => {
  const existingItem = cart.find((item) => {
    return item.id === products.id;
  });

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      ...products,
      quantity: 1,
    });
  }
  saveCart();
  updateCart();

  addSound.currentTime = 0;
  addSound.play();

  cartMessage.style.left = "50%";
  cartMessage.style.right = "auto";
  cartMessage.style.transform = "translateX(-50%)";

  handleMessage("Added To Cart", "green");
};

cartContent.addEventListener("click", (e) => {
  const itemDiv = e.target.closest(".cart-item");

  if (!itemDiv) return;

  const index = Number(itemDiv.dataset.index);

  if (e.target.classList.contains("increase-btn")) {
    cart[index].quantity++;
  }

  if (e.target.classList.contains("decrease-btn")) {
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
    } else {
      cart.splice(index, 1);

      cartMessage.style.left = "50%";
      cartMessage.style.right = "auto";
      cartMessage.style.transform = "translateX(-50%)";

      removeSound.currentTime = 0;
      removeSound.play();

      handleMessage("Removed From Cart", "#ef4444");
    }
  }

  if (e.target.classList.contains("remove-btn")) {
    cart.splice(index, 1);

    cartMessage.style.left = "50%";
    cartMessage.style.right = "auto";
    cartMessage.style.transform = "translateX(-50%)";

    removeSound.currentTime = 0;
    removeSound.play();

    handleMessage("Removed From Cart", "#ef4444");
  }

  saveCart();
  updateCart();
});

let handleMessage = (message, color) => {
  cartMessage.classList.add("show");

  cartMessage.textContent = message;

  cartMessage.style.background =
    color === "green"
      ? "linear-gradient(135deg,#10b981,#34d399)"
      : "linear-gradient(135deg,#ef4444,#f87171)";

  setTimeout(() => {
    cartMessage.classList.remove("show");
  }, 1200);
};

window.addEventListener("DOMContentLoaded", () => {
  dispalyCards();
  saveCart();
  updateCart();
});

checkoutBtn.addEventListener("click", () => {
  checkoutModal.classList.add("show");
});

continueBtn.addEventListener("click", () => {
  checkoutModal.classList.remove("show");
});
