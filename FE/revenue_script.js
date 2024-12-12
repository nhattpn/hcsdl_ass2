const API_URL = "http://localhost:5000/api/procedure/totalshoprevenue"; // Thay đổi URL API 

// DOM Elements
const productTable = document.querySelector("#product-table");
const searchInput = document.querySelector("#search-input");
const sortOptions = document.querySelector("#sort-options");


// Lấy thông tin từ URL
const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    start_date: params.get("start_date"),
    end_date: params.get("end_date"),
  };
};

// Fetch and render orders
let currentOrders = [];

const fetchOrders = async () => {
  const { start_date, end_date } = getQueryParams();

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

    if (!response.ok) {
      throw new Error(`API error: ${response.endDateText}`);
    }

    currentOrders = await response.json();
    renderOrders(currentOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    alert("Danh sách trống");
  }
};

// Render orders to the DOM
const renderOrders = (orders) => {
  productTable.innerHTML = "";

  if (orders.length === 0) {
    productTable.innerHTML = '<tr><td colspan="8" class="text-center text-gray-500 py-4">Không có đơn hàng nào.</td></tr>';
    return;
  }
  console.log(orders); 
  orders.forEach((order) => {
    const row = `
    <tr data-oid="${order.OID}" data-name="${order.FULL_NAME}" data-store-name="${order.SHOP_NAME}" data-end_date="${order.ORDER_endDate}">
        <td class="py-3 px-6 border-b">${order.FULL_NAME}</td>
        <td class="py-3 px-6 border-b">${order.SHOP_NAME}</td>
        <td class="py-3 px-6 border-b">${order.ORDER_PRICE} VND</td>
        <td class="py-3 px-6 border-b">${order.ORDER_endDate}</td>
        <td class="py-3 px-6 border-b">${order.EMAIL}</td>
        <td class="py-3 px-6 border-b">${new Date(order.ORDER_DATE).toLocaleDateString()}</td>
        <td class="py-3 px-6 border-b">${order.OID}</td>
        <td class="py-3 px-6 border-b text-center">${order.LOYALTY_POINT}</td>
        <td class="py-3 px-6 border-b text-center">
          <button class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition" onclick="editOrder('${order.OID}')">Sửa</button>
          <button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition" onclick="deleteOrder('${order.OID}')">Xóa</button>
        </td>
      </tr>
    `;
    productTable.innerHTML += row;
  });
};

// Search functionality
const searchOrders = () => {
  const searchTerm = searchInput.value.toLowerCase();
  const rows = productTable.querySelectorAll("tr[data-oid]");

  rows.forEach((row) => {
    const orderId = row.getAttribute("data-oid").toLowerCase();
    const end_date = row.getAttribute("data-end_date").toLowerCase();
    const name = row.getAttribute("data-name").toLowerCase();
    const storeName = row.getAttribute("data-store-name").toLowerCase();

    if (
      orderId.includes(searchTerm) ||
      end_date.includes(searchTerm) ||
      name.includes(searchTerm) ||
      storeName.includes(searchTerm)
    ) {
      row.style.display = "table-row";
    } else {
      row.style.display = "none";
    }
  });
};
// Sorting functionality
const sortOrders = () => {
  const sortBy = sortOptions.value;
  const direction = sortDirection.value; // Lấy giá trị hướng sắp xếp
  const sortedOrders = [...currentOrders];

  sortedOrders.sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case "name":
        comparison = a.FULL_NAME.localeCompare(b.FULL_NAME);
        break;
      case "storeName":
        comparison = a.SHOP_NAME.localeCompare(b.SHOP_NAME);
        break;
      case "price":
        comparison = a.ORDER_PRICE - b.ORDER_PRICE;
        break;
      case "orderDate":
        comparison = new Date(a.ORDER_DATE) - new Date(b.ORDER_DATE);
        break;
      case "loyaltyPoints":
        comparison = a.LOYALTY_POINT - b.LOYALTY_POINT;
        break;
      default:
        break;
    }
    return direction === "asc" ? comparison : -comparison;
  });


  renderOrders(sortedOrders);
};

// Edit order
const editOrder = (orderId) => {
  alert(`Chỉnh sửa đơn hàng: ${orderId}`);
  // Logic để chỉnh sửa đơn hàng
};

// Delete order
const deleteOrder = async (orderId) => {
  if (!confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) return;

  try {
    const response = await fetch(`${API_URL}/${orderId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Không thể xóa đơn hàng.");
    }

    alert("Đơn hàng đã được xóa.");
    fetchOrders();
  } catch (error) {
    console.error("Error deleting order:", error);
    alert("Lỗi khi xóa đơn hàng. Vui lòng thử lại.");
  }
};

// Event listeners
searchInput.addEventListener("input", searchOrders);
if (sortOptions) {
  sortOptions.addEventListener("change", sortOrders);}
  if (sortDirection) {
    sortDirection.addEventListener("change", sortOrders);}
// Initialize
fetchOrders();
