import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  // Add listeners to buttons
  let removeFromCartListener = document.querySelectorAll(".cart-card__remove");
  removeFromCartListener.forEach((element) =>
    element.addEventListener("click", function (e) {
      removeFromCart(e.target.dataset.id);
    })
  );

  getCartTotal();

  let changeItemQuantity = document.querySelectorAll(".item-quantity");
  changeItemQuantity.forEach((element) =>
    element.addEventListener("change", function (e) {
      updateItemQuantity(e.target.dataset.id, e.target.value);
    })
  );
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
  <img
  src="${item.Image}"
  alt="${item.Name}"
  />
  
  </a>
  <a href="#">
  <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <div>
  Qty:  
  <input class="item-quantity" type="number" value=${item.Qty} min=1 data-id=${
    item.Id
  }>
  </div>
  <p class="cart-card__price">$${(item.FinalPrice * item.Qty).toFixed(2)}</p>
  <span class="cart-card__remove" type="button" data-id=${item.Id}> ❌</span>
  </li>`;

  return newItem;
}

function removeFromCart(id) {
  const cartItems = getLocalStorage("so-cart");
  cartItems.splice(
    cartItems.findIndex((item) => item.Id === id),
    1
  );
  setLocalStorage("so-cart", cartItems);
  renderCartContents();
}

function updateItemQuantity(id, value) {
  const cartItems = getLocalStorage("so-cart");
  cartItems[cartItems.findIndex((item) => item.Id === id)].Qty = value;
  setLocalStorage("so-cart", cartItems);
  renderCartContents();
}

function getCartTotal() {
  // Check if there is a cart in local storage
  if (localStorage.getItem("so-cart")) {
    let cart = JSON.parse(localStorage.getItem("so-cart"));
    let total = 0;

    // Iterate through the cart items
    for (let i = 0; i < cart.length; i++) {
      total += parseFloat(cart[i].FinalPrice * cart[i].Qty);
      cart.total = total;
      localStorage.setItem("so-cart", JSON.stringify(cart));
    }


    let cartTotal = document.querySelector(".cart-total");
    cartTotal.innerHTML = `Total $${total}`;

    //Show or hide  total based on total
    if (total > 0) {
      cartTotal.classList.remove("hide-cart-total");
    } else {
      cartTotal.classList.add("hide-cart-total");
    }
  }
}

renderCartContents();
