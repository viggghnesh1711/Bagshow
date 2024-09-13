document.addEventListener("DOMContentLoaded", () => {
  const quantityContainers = document.querySelectorAll(".quantity-container");

  quantityContainers.forEach((container) => {
    const increaseButton = container.querySelector(".increase");
    const decreaseButton = container.querySelector(".decrease");
    const quantityElement = container.querySelector(".quantity");
    const quantityinp = container.querySelector(".quantityinp");

    increaseButton.addEventListener("click", () => {
      let quantity = parseInt(quantityElement.textContent) || 0;
      quantity = quantity + 1;
      quantityElement.textContent = quantity;
      quantityinp.value = quantity;
    });

    decreaseButton.addEventListener("click", () => {
      let quantity = parseInt(quantityElement.textContent) || 0;
      if (quantity > 1) {
        quantity = quantity - 1;
        quantityElement.textContent = quantity;
        quantityinp.value = quantity;
      }
    });
  });
});
