const REVENUE_API_URL = "http://localhost:3001/revenue";
const RATING_API_URL = "http://localhost:3001/ratings";

// DOM Elements for Revenue Report
const revenueForm = document.querySelector("#revenue-form");
const shopSelect = document.querySelector("#shop-select");
const startDate = document.querySelector("#start-date");
const endDate = document.querySelector("#end-date");
const revenueReport = document.querySelector("#revenue-report");
const totalRevenue = document.querySelector("#total-revenue");
const orderTable = document.querySelector("#order-table");

// DOM Elements for Rating Report
const ratingForm = document.querySelector("#rating-form");
const productIdInput = document.querySelector("#product-id");
const ratingReport = document.querySelector("#rating-report");
const averageRating = document.querySelector("#average-rating");
const ratingTable = document.querySelector("#rating-table");

// Fetch and display revenue report
const fetchRevenueReport = async (event) => {
  event.preventDefault();

  const shopId = shopSelect.value;
  const start = startDate.value;
  const end = endDate.value;

  if (!shopId || !start || !end) {
    alert("Vui lòng nhập đầy đủ thông tin báo cáo.");
    return;
  }

  const response = await fetch(`${REVENUE_API_URL}?shopId=${shopId}&startDate=${start}&endDate=${end}`);
  const data = await response.json();

  totalRevenue.textContent = `Tổng doanh thu: ${data.total_revenue} VND`;
  orderTable.innerHTML = "";

  if (data.orders.length === 0) {
    orderTable.innerHTML = '<tr><td colspan="3" class="text-center text-gray-500 py-4">Không có dữ liệu.</td></tr>';
    return;
  }

  data.orders.forEach((order) => {
    const row = `
      <tr>
        <td class="py-2 px-4 border-b">${order.id}</td>
        <td class="py-2 px-4 border-b">${order.value} VND</td>
        <td class="py-2 px-4 border-b">${order.date}</td>
      </tr>
    `;
    orderTable.innerHTML += row;
  });

  revenueReport.classList.remove("hidden");
};

// Fetch and display rating report
const fetchRatingReport = async (event) => {
  event.preventDefault();

  const productId = productIdInput.value;

  if (!productId) {
    alert("Vui lòng nhập ID sản phẩm.");
    return;
  }

  const response = await fetch(`${RATING_API_URL}?productId=${productId}`);
  const data = await response.json();

  averageRating.textContent = `Điểm trung bình: ${data.average_rating}`;
  ratingTable.innerHTML = "";

  if (data.reviews.length === 0) {
    ratingTable.innerHTML = '<tr><td colspan="4" class="text-center text-gray-500 py-4">Không có dữ liệu.</td></tr>';
    return;
  }

  data.reviews.forEach((review) => {
    const row = `
      <tr>
        <td class="py-2 px-4 border-b">${review.customer_id}</td>
        <td class="py-2 px-4 border-b">${review.rating}</td>
        <td class="py-2 px-4 border-b">${review.comment}</td>
        <td class="py-2 px-4 border-b">${review.date}</td>
      </tr>
    `;
    ratingTable.innerHTML += row;
  });

  ratingReport.classList.remove("hidden");
};

// Event Listeners
revenueForm.addEventListener("submit", fetchRevenueReport);
ratingForm.addEventListener("submit", fetchRatingReport);
