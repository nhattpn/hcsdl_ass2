const API_URL = "http://localhost:5000/api/product";
import { v4 as uuidv4 } from 'https://cdn.jsdelivr.net/npm/uuid@9.0.0/dist/esm-browser/index.js';

// DOM Elements
const productForm = document.querySelector("#product-form");
const productList = document.querySelector("#product-list");
const imagePreview = document.querySelector("#image-preview");

let isEditing = false;
let editProductId = null;

let pid = uuidv4();


window.loadProductToForm = async (id) => {
  try {
    // Gửi yêu cầu để lấy chi tiết sản phẩm từ API với query string
    const response = await fetch(`http://localhost:5000/api/product/getby?pid=${id}`);
    if (!response.ok) throw new Error("Không thể tải thông tin sản phẩm.");
    
    const products = await response.json();
    if (!products || products.length === 0) throw new Error("Sản phẩm không tồn tại.");
    
    // API trả về một mảng, lấy phần tử đầu tiên
    const product = products[0];
    console.log(product);
    document.getElementById("product-id").textContent = product.pid;


    // Điền thông tin vào form
    document.getElementById("product-name").value = product.name || "";
    document.getElementById("product-price").value = product.current_price || 0;
    document.getElementById("product-quantity").value = product.remain_quantity || 0;

    // Định dạng ngày để phù hợp với input type="date"
    const manufactorDate = new Date(product.manufactor_date).toISOString().split("T")[0];
    document.getElementById("manufacturing-date").value = manufactorDate || "";

    // Lấy tên danh mục và thương hiệu từ ID
    const categoryName = getCategoryName(product.cid);
    const brandName = getBrandName(product.bid);

    document.getElementById("category-select").value = categoryName || "";
    document.getElementById("brand-select").value = brandName || "";
    document.getElementById("product-description").value = product.description || "";

    // Hiển thị ảnh nếu có
    const preview = document.getElementById("image-preview");
    if (product.image) {
      preview.src = product.image;
      preview.style.display = "block";
    } else {
      preview.src = "#";
      preview.style.display = "none";
    }

    // Gán trạng thái chỉnh sửa
    isEditing = true;
    editProductId = id;

  } catch (error) {
    console.error("Lỗi khi tải sản phẩm:", error);
    alert("Không thể tải thông tin sản phẩm. Vui lòng thử lại.");
  }
};

// Hàm lấy tên danh mục từ ID
function getCategoryName(cid) {
  const categoryMapping = {
    "C441AED9-A223-4831-9F51-15DAFADF8931": "Thời trang nam",
    "A33CC19A-0F97-4CFF-BABE-36CC322B98FF": "Máy ảnh kỹ thuật số",
    "B0272D2D-9EBA-43C1-B46E-48D0791A35ED": "Điện thoại & Phụ kiện",
    "DDA13EAC-76FF-4F8D-AFE6-5AB52FDC5A8B": "Laptop chơi game",
    "47A48B3D-1564-4F52-88D0-7EC6A6D7738B": "Thời trang nữ",
    "A4AA3274-AD0B-4356-A21A-9D462A123FAF": "Laptop văn phòng",
    "0017D0D1-C089-4466-8A6F-A1AE9778FAC8": "Phụ kiện điện thoại",
    "1D055A43-F012-4141-BCED-A658B38451A1": "Điện thoại thông minh",
    "01C13221-835B-4635-98F4-BF215E7232C3": "Laptop & Máy tính bảng",
    "5F0C5C8C-51DA-458E-A519-C77896458630": "Đồ điện tử",
    "35A97685-06B2-4E5F-BF1C-DD26673659E1": "Tivi",
    "E6D017C3-5C0D-4E6E-8438-F3731ABC9889": "Thời trang",
  };
  return Object.keys(categoryMapping).find((key) => categoryMapping[key] === cid);
}

// Hàm lấy tên thương hiệu từ ID
function getBrandName(bid) {
  const brandMapping = {
    "AA818D6E-1F46-442E-84E8-096934E0DAC1": "Apple",
    "DA41A459-2BB6-42E4-BC17-88E4CB9ED434": "ASUS",
    "885CD347-61ED-4315-8E0C-8F1F48F496E6": "Sony",
    "0E71583F-7857-43FD-8DDF-F3BECF7AE357": "Nike",
  };
  return Object.keys(brandMapping).find((key) => brandMapping[key] === bid);
}





// Fetch and render products
const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/getall`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response);
    if (!response.ok) {
      throw new Error(`Lỗi API: ${response.statusText}`);
    }

    const products = await response.json();
    console.log(products);
    renderProducts(products);
  } catch (error) {
    console.error("Lỗi khi gọi API fetchProducts:", error);
    alert("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
  }
};

const renderProducts = (products) => {
  productList.innerHTML = "";
  if (products.length === 0) {
    productList.innerHTML = '<li class="p-4 text-center text-gray-500">Không có sản phẩm nào.</li>';
    return;
  }

  products.forEach((product) => {//////////////////////////////////////////////////////////////////////////////////////////
    const item = `
      <li class="grid grid-cols-6 items-center p-4">
        <div class="col-span-2 flex items-center space-x-4">
          <img src="${product.image }" alt="Hình sản phẩm" class="w-16 h-16 object-cover rounded">
          <div>
          <span class="text-gray-800 font-medium">${product.name}</span>
          <span class="text-xs text-gray-500 block">${product.pid}</span>
          </div>
        </div>
        <div class=" text-gray-600">${product.current_price} VNĐ</div>
        <div class=" text-gray-600">${product.remain_quantity}</div>
        <div class=" text-gray-600">${product.avg_rating}</div>
        <div class=" flex justify-end space-x-2">
          <button class="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-200" onclick="loadProductToForm('${product.pid}')">Sửa</button>
          <button class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200" onclick="deleteProduct('${product.pid}')">Xóa</button>
        </div>
      </li>
    `;
    productList.innerHTML += item;
  });
};


// Delete product
window.deleteProduct = async (id) => {
  if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) { 
    const response = await fetch(`${API_URL}/delete`, {
      method: "DELETE", 
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify({ pid: id }), 
    });

    if (response.ok) {
      alert("Sản phẩm đã được xóa.");
      fetchProducts(); // Làm mới danh sách sản phẩm
    } else {
      alert("Xóa sản phẩm thất bại.");
    }
  }
};



// add product 

const brandMapping = {
  "Apple": "AA818D6E-1F46-442E-84E8-096934E0DAC1",
  "ASUS": "DA41A459-2BB6-42E4-BC17-88E4CB9ED434",
  "Sony": "885CD347-61ED-4315-8E0C-8F1F48F496E6",
  "Nike": "0E71583F-7857-43FD-8DDF-F3BECF7AE357"
};


const categoryMapping = {
  "Thời trang nam": "C441AED9-A223-4831-9F51-15DAFADF8931",
  "Máy ảnh kỹ thuật số": "A33CC19A-0F97-4CFF-BABE-36CC322B98FF",
  "Điện thoại & Phụ kiện":"B0272D2D-9EBA-43C1-B46E-48D0791A35ED",
  "Laptop chơi game" : "DDA13EAC-76FF-4F8D-AFE6-5AB52FDC5A8B",
  "Thời trang nữ" : "47A48B3D-1564-4F52-88D0-7EC6A6D7738B",
  "Laptop văn phòng": "A4AA3274-AD0B-4356-A21A-9D462A123FAF",
  "Phụ kiện điện thoại": "0017D0D1-C089-4466-8A6F-A1AE9778FAC8",
  "Điện thoại thông minh":"1D055A43-F012-4141-BCED-A658B38451A1",
  "Laptop & Máy tính bảng":"01C13221-835B-4635-98F4-BF215E7232C3",
  "Đồ điện tử":"5F0C5C8C-51DA-458E-A519-C77896458630",
  "Tivi":"35A97685-06B2-4E5F-BF1C-DD26673659E1",
  "Thời trang": "E6D017C3-5C0D-4E6E-8438-F3731ABC9889"
};
function getCategoryID(categoryName) {
  return categoryMapping[categoryName] || null;
}

function getBrandID(brandName) {
  return brandMapping[brandName] || null;  
}
const saveProduct = async (event) => {
  event.preventDefault();

  const productForm = document.getElementById("product-form");
  const imageInput = document.getElementById("product-image");

  // Lấy thông tin từ form
  const name = document.getElementById("product-name").value;
  const price = parseFloat(document.getElementById("product-price").value);
  const quantity = parseInt(document.getElementById("product-quantity").value, 10);
  const manufactorDate = document.getElementById("manufacturing-date").value;
  const description = document.getElementById("product-description").value;
  const brandName = document.getElementById("brand-select").value;
  const categoryName = document.getElementById("category-select").value;

  // Lấy `bid` và `cid` dựa trên tên thương hiệu và danh mục
  const bid = getBrandID(brandName);
  const cid = getCategoryID(categoryName);

  if (!bid || !cid) {
    alert("Vui lòng chọn thương hiệu và danh mục hợp lệ!");
    return;
  }

  // Tạo FormData
  const formData = new FormData();
  formData.append("name", name);
  formData.append("current_price", price);
  formData.append("remain_quantity", quantity);
  formData.append("manufactor_date", manufactorDate);
  formData.append("description", description);
  formData.append("bid", bid);
  formData.append("cid", cid);
  formData.append("sid", "324C2D1B-C56D-4FE0-B512-3B311C973CEF"); // Static supplier ID

  if (imageInput.files.length > 0) {
    formData.append("image", imageInput.files[0]);
  }

  if (isEditing) {
    // Chỉnh sửa sản phẩm
    formData.append("pid", editProductId);

    try {
      const response = await fetch(`http://localhost:5000/api/product/update`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        alert("Sản phẩm đã được cập nhật thành công!");
        fetchProducts(); // Làm mới danh sách sản phẩm
        productForm.reset();
        document.getElementById("image-preview").style.display = "none";
        isEditing = false;
        editProductId = null;
      } else {
        const errorText = await response.text();
        alert(`Cập nhật sản phẩm thất bại: ${errorText}`);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      alert("Đã có lỗi xảy ra khi cập nhật sản phẩm.");
    }
  } else {
    // Tạo mới sản phẩm
    formData.append("pid", pid);
    formData.append("avg_rating", 5);

    try {
      const response = await fetch("http://localhost:5000/api/product/create", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Sản phẩm đã được tạo thành công!");
        fetchProducts(); // Làm mới danh sách sản phẩm
        productForm.reset();
        document.getElementById("image-preview").style.display = "none";
      } else {
        const errorText = await response.text();
        alert(`Tạo sản phẩm thất bại: ${errorText}`);
      }
    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm:", error);
      alert("Đã có lỗi xảy ra khi tạo sản phẩm.");
    }
  }
};



// Khi nhấn nút Lưu trong modal
document.getElementById("editProductForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const productData = {
    pid: editProductId,
    name: document.getElementById("product-name").value,
    description: document.getElementById("product-description").value,
    current_price: parseFloat(document.getElementById("product-price").value),
    remain_quantity: parseInt(document.getElementById("product-quantity").value),
    manufactor_date: document.getElementById("manufacturing-date").value,
    category: document.getElementById("product-category").value,
    brand: document.getElementById("product-brand").value,
    image: document.getElementById("image").value || null
  };

  const response = await fetch('http://localhost:5000/api/product/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });

  if (response.ok) {
    alert("Sản phẩm đã được cập nhật thành công!");
    fetchProducts(); // Cập nhật lại danh sách sản phẩm
    closeModal(); // Đóng modal
  } else {
    alert("Cập nhật sản phẩm thất bại.");
  }
});

// Đóng modal khi nhấn nút "Đóng"
document.getElementById("closeModal").addEventListener("click", () => {
  closeModal();
});

// Hàm đóng modal
const closeModal = () => {
  document.getElementById("editModal").classList.add("hidden");
  isEditing = false;
  editProductId = null;
};




// Event Listeners
productForm.addEventListener("submit", saveProduct);


document.getElementById("product-form").addEventListener("reset", () => {
  isEditing = false;
  editProductId = null;
});

const displayPidOnLoad = () => {
  document.getElementById("product-id").value = pid;
};


document.addEventListener("DOMContentLoaded", displayPidOnLoad);

// Initialize
fetchProducts();
