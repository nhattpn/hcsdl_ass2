const API_URL = "http://localhost:3001/products";

// DOM Elements
const productTable = document.querySelector("tbody");
const addButton = document.querySelector(".bg-blue-500");
const formInputs = {
  name: document.querySelector('input[placeholder="Tên sản phẩm"]'),
  price: document.querySelector('input[placeholder="Giá hiện tại"]'),
  quantity: document.querySelector('input[placeholder="Số lượng"]'),
  category: document.querySelector('select[placeholder="Danh mục"]'),
  brand: document.querySelector('select[placeholder="Thương hiệu"]'),
};
const deleteDialog = document.getElementById("deleteDialog");
const confirmationText = deleteDialog.querySelector("p");
const confirmDeleteButton = deleteDialog.querySelector("button.bg-red-500");
const cancelDeleteButton = deleteDialog.querySelector("button.bg-gray-500");

let isEditing = false;
let editProductId = null;
let currentDeleteRow = null;

// Fetch and display products
const fetchProducts = async () => {
  const response = await fetch(API_URL);
  const products = await response.json();
  renderProducts(products);
};

const renderProducts = (products) => {
  productTable.innerHTML = "";
  products.forEach((product) => {
    const row = `
      <tr>
        <td class="py-2 px-4 border-b">${product.id}</td>
        <td class="py-2 px-4 border-b">${product.name}</td>
        <td class="py-2 px-4 border-b">${product.price} VND</td>
        <td class="py-2 px-4 border-b">${product.quantity}</td>
        <td class="py-2 px-4 border-b">${product.category}</td>
        <td class="py-2 px-4 border-b">${product.brand}</td>
        <td class="py-2 px-4 border-b">
          <button class="text-blue-500 hover:text-blue-700" onclick="editProduct(${product.id})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="text-red-500 hover:text-red-700 ml-2" data-action="delete">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
    productTable.innerHTML += row;
  });

  // Attach delete event to dynamically added buttons
  attachDeleteEvents();
};

// Add or update product
const saveProduct = async (event) => {
  event.preventDefault();
  const product = {
    name: formInputs.name.value,
    price: +formInputs.price.value,
    quantity: +formInputs.quantity.value,
    category: formInputs.category.value,
    brand: formInputs.brand.value,
  };

  if (isEditing) {
    await fetch(`${API_URL}/${editProductId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    isEditing = false;
    editProductId = null;
  } else {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
  }

  fetchProducts();
  document.querySelector("form").reset();
};

// Show delete dialog
const showDeleteDialog = (row, productName) => {
  currentDeleteRow = row;
  confirmationText.textContent = `Bạn có chắc chắn muốn xóa sản phẩm "${productName}"? Hành động này không thể hoàn tác.`;
  deleteDialog.style.display = "flex";
};

// Hide delete dialog
const hideDeleteDialog = () => {
  deleteDialog.style.display = "none";
  currentDeleteRow = null;
};

// Delete product
const deleteProduct = async () => {
  if (currentDeleteRow) {
    const productId = currentDeleteRow.querySelector("td:first-child").textContent.trim();
    await fetch(`${API_URL}/${productId}`, {
      method: "DELETE",
    });

    // Remove row from table
    currentDeleteRow.remove();
    currentDeleteRow = null;
    hideDeleteDialog();
  }
};

// Attach delete event to buttons
const attachDeleteEvents = () => {
  const deleteButtons = document.querySelectorAll('[data-action="delete"]');
  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const row = button.closest("tr");
      const productName = row.querySelector("td:nth-child(2)").textContent.trim();
      showDeleteDialog(row, productName);
    });
  });
};

// Edit product
const editProduct = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  const product = await response.json();

  formInputs.name.value = product.name;
  formInputs.price.value = product.price;
  formInputs.quantity.value = product.quantity;
  formInputs.category.value = product.category;
  formInputs.brand.value = product.brand;

  isEditing = true;
  editProductId = id;
};

// Event listeners
document.querySelector("form").addEventListener("submit", saveProduct);
addButton.addEventListener("click", () => document.querySelector("form").reset());
confirmDeleteButton.addEventListener("click", deleteProduct);
cancelDeleteButton.addEventListener("click", hideDeleteDialog);

// Initial fetch
fetchProducts();
