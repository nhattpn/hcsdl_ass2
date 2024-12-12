const API_URL = "http://localhost:5000/api/procedure/totalshoprevenue"; 
// DOM Elements
const productTable = document.querySelector("#product-table");
const searchInput = document.querySelector("#search-input");
const addShopButton = document.querySelector("#add-shop-btn"); // Giả sử có nút thêm cửa hàng
const notificationElement = document.querySelector("#notification");


const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  const start_date = params.get("start_Date"); // Lưu ý: start_Date với chữ cái "D" in hoa
  const end_date = params.get("end_Date"); // Lưu ý: end_Date với chữ cái "D" in hoa
  return { start_date, end_date};
};

// Hàm hiển thị thông báo
const showNotification = (message, isSuccess = true) => {
  notificationElement.textContent = message;
  notificationElement.classList.remove("hidden");
  notificationElement.classList.add(isSuccess ? "bg-green-500" : "bg-red-500");

  setTimeout(() => {
    notificationElement.classList.add("hidden");
  }, 3000);
};

// Fetch and render total shop revenue
const fetchTotalRevenue = async () => {
  const { start_date, end_date } = getQueryParams();
  console.log("Query Params:", start_date, end_date);

  try {
    const queryParams = {};
    if (start_date) queryParams.start_date = start_date;
    if (end_date) queryParams.end_date = end_date;

    const searchParams = new URLSearchParams(queryParams);
    const response = await fetch(`${API_URL}?${searchParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Raw Response:", response);


    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const revenueData = await response.json();
    renderRevenue(revenueData);
  } catch (error) {
    console.error("Error fetching revenue:", error);
    showNotification("Không thể tải doanh thu.", false);
  }
};

// Render revenue data to the table
const renderRevenue = (revenue) => {
  productTable.innerHTML = ""; // Clear previous data

  if (!revenue || revenue.length === 0) {
    productTable.innerHTML = '<tr><td colspan="3" class="text-center text-gray-500 py-4">Không có dữ liệu doanh thu.</td></tr>';
    return;
  }
  console.log("Revenue Data:", revenue);
  revenue.forEach((item) => {
    const row = `
      <tr>
      <td class="py-3 px-6 border-b">
      <a href="edit-shop.html?shopId=${item.sid}" class="text-blue-500 hover:underline">${item.shop_name}</a>
    </td>
        <td class="py-3 px-6 border-b text-center">${item.sid}</td>
        <td class="py-3 px-6 border-b text-center">${item.total_revenue} VND</td>
        <td class="py-3 px-6 border-b text-right">
          <button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition" onclick="deleteShop('${item.sid}')">Xóa</button>
        </td>
      </tr>
    `;
    productTable.innerHTML += row;
  });
};

// Delete shop function
const deleteShop = async (shopId) => {
  if (!confirm("Bạn có chắc chắn muốn xóa cửa hàng này?")) return;

  try {
    const response = await fetch(`http://localhost:5000/api/shop/delete/${shopId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Không thể xóa cửa hàng.");
    }

    showNotification("Cửa hàng đã được xóa.", true);
    fetchTotalRevenue(); // Refresh revenue data
  } catch (error) {
    console.error("Error deleting shop:", error);
    showNotification("Lỗi khi xóa cửa hàng. Vui lòng thử lại.", false);
  }
};

// Add new shop (POST request)
const addShop = async (shopData) => {
  try {
    const formData = new FormData();
    formData.append("sid", shopData.sid);
    formData.append("uid", shopData.uid);
    formData.append("name", shopData.name);
    formData.append("address", shopData.address);
    formData.append("logo", shopData.logo);
    formData.append("avg_rating", shopData.avg_rating);

    const response = await fetch("http://localhost:5000/api/shop/create", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Không thể thêm cửa hàng.");
    }

    showNotification("Cửa hàng đã được thêm thành công.", true);
    fetchTotalRevenue(); // Refresh revenue data
  } catch (error) {
    console.error("Error adding shop:", error);
    showNotification("Lỗi khi thêm cửa hàng.", false);
  }
};

// Event listener for search input
// searchInput.addEventListener("input", searchOrders);

// Initialize revenue data fetch
fetchTotalRevenue();
