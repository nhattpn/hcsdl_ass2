const API_URL = "http://localhost:5000/api/procedure/totalshoprevenue";

// DOM Elements
const productTable = document.querySelector("#product-table");
const searchInput = document.querySelector("#search-input");
const notificationElement = document.querySelector("#notification");

let currentSortColumn = "";
let currentSortOrder = "ASC";

const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  const start_date = params.get("start_Date");
  const end_date = params.get("end_Date");
  const shop_name = params.get("shop_name");
  return { start_date, end_date, shop_name };
};

// Show notification
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
  const { start_date, end_date, shop_name } = getQueryParams();

  try {
    const queryParams = { start_date, end_date };
    if (shop_name) queryParams.shop_name = shop_name;
    if (currentSortColumn) {
      queryParams.sort_column = currentSortColumn;
      queryParams.sort_order = currentSortOrder;
    }

    const searchParams = new URLSearchParams(queryParams);
    const response = await fetch(`${API_URL}?${searchParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

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
    productTable.innerHTML = '<tr><td colspan="4" class="text-center text-gray-500 py-4">Không có dữ liệu doanh thu.</td></tr>';
    return;
  }

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

// Sort table function
const sortTable = (column) => {
  if (currentSortColumn === column) {
    currentSortOrder = currentSortOrder === "ASC" ? "DESC" : "ASC";
  } else {
    currentSortColumn = column;
    currentSortOrder = "ASC";
  }

  fetchTotalRevenue();
};

// Search shop by name
searchInput.addEventListener("input", (event) => {
  const searchValue = event.target.value;
  const params = new URLSearchParams(window.location.search);
  if (searchValue) {
    params.set("shop_name", searchValue);
  } else {
    params.delete("shop_name");
  }
  window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
  fetchTotalRevenue();
});

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

// Initialize revenue data fetch
fetchTotalRevenue();
