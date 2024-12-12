const API_URL = "http://localhost:3001/products";

// DOM Elements
const searchInput = document.querySelector("#search-input");
const filterCategory = document.querySelector("#filter-category");
const filterBrand = document.querySelector("#filter-brand");
const sortButton = document.querySelector("#sort-button");
const productTable = document.querySelector("#product-table");

let products = [];
let isSortedAscending = true;

// Fetch and render products
const fetchProducts = async () => {
  const response = await fetch(API_URL);
  products = await response.json();
  renderProducts(products);
};

const renderProducts = (filteredProducts) => {
  productTable.innerHTML = "";
  if (filteredProducts.length === 0) {
    productTable.innerHTML = '<tr><td colspan="7" class="text-center text-gray-500 py-4">Không có sản phẩm nào.</td></tr>';
    return;
  }

  filteredProducts.forEach((product) => {
    const row = `
      <tr>
        <td class="py-2 px-4 border-b">${product.id}</td>
        <td class="py-2 px-4 border-b">${product.name}</td>
        <td class="py-2 px-4 border-b">${product.price} VND</td>
        <td class="py-2 px-4 border-b">${product.quantity}</td>
        <td class="py-2 px-4 border-b">${product.category}</td>
        <td class="py-2 px-4 border-b">${product.brand}</td>
        <td class="py-2 px-4 border-b">
          <button class="text-blue-500 hover:text-blue-700">Sửa</button>
          <button class="text-red-500 hover:text-red-700 ml-2">Xóa</button>
        </td>
      </tr>
    `;
    productTable.innerHTML += row;
  });
};

const searchProductByPid = async () => {
  const pid = document.getElementById("search-input").value.trim(); // Lấy pid từ ô input

  if (!pid) {
    alert("Vui lòng nhập PID để tìm kiếm.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/product/getby`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pid }),
    });
    

    if (response.ok) {
      const product = await response.json(); // Chuyển đổi phản hồi từ API thành JSON
      renderProductDetails(product); // Hàm để hiển thị thông tin sản phẩm
    } else {
      alert("Không tìm thấy sản phẩm với PID đã nhập.");
    }
  } catch (error) {
    console.error("Lỗi khi tìm kiếm sản phẩm:", error);
    alert("Đã xảy ra lỗi khi tìm kiếm sản phẩm.");
  }
};

// Hàm hiển thị thông tin sản phẩm
const renderProductDetails = (product) => {
  const productContainer = document.getElementById("product-details");

  // Xóa nội dung cũ
  productContainer.innerHTML = "";

  // Tạo giao diện hiển thị thông tin sản phẩm
  const productHTML = `
    <div>
      <h3>Tên sản phẩm: ${product.name}</h3>
      <p>Mô tả: ${product.description}</p>
      <p>Giá: ${product.current_price}</p>
      <p>Số lượng còn lại: ${product.remain_quantity}</p>
      <p>Ngày sản xuất: ${product.manufacturer_date}</p>
      <p>PID: ${product.pid}</p>
      <p>Thương hiệu (BID): ${product.bid}</p>
      <p>Danh mục (CID): ${product.cid}</p>
      <p>Nhà cung cấp (SID): ${product.sid}</p>
      <img src="${product.image}" alt="Hình ảnh sản phẩm" style="max-width: 200px;" />
    </div>
  `;
  productContainer.innerHTML = productHTML;
};


// Filter products
const filterProducts = () => {
  const category = filterCategory.value;
  const brand = filterBrand.value;

  const filteredProducts = products.filter((product) => {
    return (
      (category === "" || product.category === category) &&
      (brand === "" || product.brand === brand)
    );
  });

  renderProducts(filteredProducts);
};

// Sort products by price
const sortProducts = () => {
  const sortedProducts = [...products].sort((a, b) => {
    return isSortedAscending ? a.price - b.price : b.price - a.price;
  });

  isSortedAscending = !isSortedAscending;
  renderProducts(sortedProducts);
};

// Event Listeners
searchInput.addEventListener("input", searchProducts);
filterCategory.addEventListener("change", filterProducts);
filterBrand.addEventListener("change", filterProducts);
sortButton.addEventListener("click", sortProducts);

// Initialize
fetchProducts();
