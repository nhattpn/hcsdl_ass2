const API_URL = "http://localhost:5000/api/shop";

// DOM Elements
const shopForm = document.querySelector("#shop-form");
const imagePreview = document.querySelector("#image-preview");

let editshopId = null; // Biến để lưu trạng thái chỉnh sửa

// Load shop details to the form
const loadShopDetails = async () => {
  const params = new URLSearchParams(window.location.search);
  const shopId = params.get("shopId");

  if (!shopId) {
    alert("Không tìm thấy thông tin shop trong URL.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/getby?sid=${shopId}`);
    if (!response.ok) throw new Error("Không thể tải thông tin cửa hàng.");

    const shops = await response.json();
    if (!shops || shops.length === 0) throw new Error("Cửa hàng không tồn tại.");

    // Lấy thông tin cửa hàng đầu tiên từ API
    const shop = shops[0];

    // Điền thông tin vào form
    const shopIdInput = document.getElementById("shop-id");
    if (shopIdInput) shopIdInput.value = shop.sid;

    const shopNameInput = document.getElementById("shop-name");
    if (shopNameInput) shopNameInput.value = shop.name || "";

    const shopAddressInput = document.getElementById("shop-address");
    if (shopAddressInput) shopAddressInput.value = shop.address || "";

    const shopRatingInput = document.getElementById("shop-rating");
    if (shopRatingInput) shopRatingInput.value = shop.avg_rating || "N/A";

    // Hiển thị logo nếu có
    if (shop.logo) {
      imagePreview.src = shop.logo;
      imagePreview.style.display = "block";
    } else {
      imagePreview.src = "#";
      imagePreview.style.display = "none";
    }

    editshopId = shop.sid; // Lưu ID của shop đang chỉnh sửa
  } catch (error) {
    console.error("Lỗi khi tải thông tin cửa hàng:", error);
    alert("Không thể tải thông tin cửa hàng. Vui lòng thử lại.");
  }
};

// Save shop details
const saveShop = async (event) => {
  event.preventDefault();

  const name = document.getElementById("shop-name")?.value;
  const address = document.getElementById("shop-address")?.value;
  const rating = document.getElementById("shop-rating")?.value;
  const imageInput = document.getElementById("shop-image");

  // Validate required fields
  if (!name || !address) {
    alert("Vui lòng điền đầy đủ thông tin hợp lệ.");
    return;
  }

  const formData = new FormData();
  formData.append("sid", editshopId);
  formData.append("name", name);
  formData.append("address", address);
  formData.append("avg_rating", rating);

  // Thêm file hình ảnh nếu có
  if (imageInput?.files.length > 0) {
    formData.append("logo", imageInput.files[0]);
  }

  try {
    const response = await fetch(`${API_URL}/update`, {
      method: "PUT",
      body: formData,
    });

    if (response.ok) {
      alert("Cửa hàng đã được cập nhật thành công!");
      shopForm.reset();
      imagePreview.style.display = "none";
      editshopId = null;
      window.location.href = document.referrer || "report_procedures.html";

    } else {
      const errorText = await response.text();
      alert(`Cập nhật cửa hàng thất bại: ${errorText}`);
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật cửa hàng:", error);
    alert("Đã có lỗi xảy ra khi cập nhật cửa hàng.");
  }
};


const cancelButton = document.getElementById("cancel-button");


// Event Listeners
shopForm.addEventListener("submit", saveShop);

cancelButton.addEventListener("click", () => {
  // Quay lại trang trước đó
  window.location.href = document.referrer || "report_procedures.html"; // Nếu không có referrer, chuyển về report_procedures.html
});

// Load shop details on page load
document.addEventListener("DOMContentLoaded", loadShopDetails);
