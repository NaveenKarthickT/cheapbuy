const businessName = document.getElementById("Buisness-Name")
const name = localStorage.getItem("businessName")
const uname = localStorage.getItem("name")
const buname = document.getElementById("name")
businessName.textContent = name




async function showStockProducts(type) {

    const modal = document.getElementById("outOfStockModal");
    const tableBody = document.getElementById("outOfStockTableBody");
    const title = document.getElementById("stockModalTitle");
    const option = document.getElementById("option")

    option.textContent = "option"

    const email = localStorage.getItem("email");

    let url = "";

    if (type === "out") {
        title.textContent = "Out of Stock Products";
        url = `http://localhost:5000/seller/oosCount?email=${email}`;
    }

    else if (type === "low") {
        title.textContent = "Low Stock Products";
        url = `http://localhost:5000/seller/lowCount?email=${email}`;
    }

    else if (type === "available") {
        title.textContent = "Available Products";
        url = `http://localhost:5000/seller/availableCount?email=${email}`;
    }

    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to load products");
        }

        const data = await response.json();

        tableBody.innerHTML = "";

        if (data.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">
                        No products found
                    </td>
                </tr>
            `;

        }

        data.forEach((element, index) => {

            tableBody.innerHTML += `

                <tr>

                    <td>${index + 1}</td>

                    <td>${element.id}</td>

                    <td>${element.name}</td>

                    <td>₹${element.price}</td>

                    <td>

                        <div class="d-flex justify-content-center gap-2">

                            <input
                                type="number"
                                min="1"
                                id="quantity-${element.id}"
                                class="form-control"
                                style="width: 80px;"
                                placeholder="Qty">

                            <button
                                class="btn btn-success btn-sm"
                                onclick="addQuantity(${element.id})">

                                Add

                            </button>

                        </div>

                    </td>

                </tr>

            `;
        });

        modal.style.display = "flex";

    }

    catch (error) {

        console.log(error);
        alert("Unable to load products");

    }

}


function showOutOfStock() {

    showStockProducts("out");

}


function showLowStock() {

    showStockProducts("low");

}


function showAvailable() {

    showStockProducts2();

}


async function showStockProducts2() {

    const modal = document.getElementById("outOfStockModal");
    const tableBody = document.getElementById("outOfStockTableBody");
    const title = document.getElementById("stockModalTitle");
    const option = document.getElementById("option")

    option.textContent = "Available Quantity"

    const email = localStorage.getItem("email");

    title.textContent = "Available Products";

    let url = `http://localhost:5000/seller/availableCount?email=${email}`;

    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to load products");
        }

        const data = await response.json();

        tableBody.innerHTML = "";

        if (data.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">
                        No products found
                    </td>
                </tr>
            `;

        }

        data.forEach((element, index) => {

            tableBody.innerHTML += `

                <tr>

                    <td>${index + 1}</td>

                    <td>${element.id}</td>

                    <td>${element.name}</td>

                    <td>₹${element.price}</td>

                    <td class="text-success">${element.available_quantity}</td>

                </tr>

            `;
        });

        modal.style.display = "flex";

    }

    catch (error) {

        console.log(error);
        alert("Unable to load products");

    }

}


async function addQuantity(productId) {

    const email = localStorage.getItem("email")

    const quantityInput = document.getElementById(`quantity-${productId}`);

    const quantity = Number(quantityInput.value);

    if (!quantity || quantity <= 0) {

        alert("Please enter a valid quantity");

        return;
    }

    const response = await fetch(
        `http://localhost:5000/seller/addQuantity?email=${email}&id=${productId}&quan=${quantity}`
    )

    console.log("Product ID:", productId);
    console.log("Quantity to add:", quantity);

    const data = await response.json();

    console.log(data);

    if (response.ok) {
        alert("addded")
    }

}


function closeOutOfStock() {

    const modal = document.getElementById("outOfStockModal");

    modal.style.display = "none";

}




async function dayrevenue() {

    const email = localStorage.getItem("email")

    const res1 = await fetch(
        `http://localhost:5000/seller/getDayRevenue?email=${email}`
    )

    const data1 = await res1.json();

    const dr = document.getElementById("dayRevenue");

    let t = 0;

    console.log(data1)

    data1.forEach(element => {

        t = t + Number(element.price);

    });

    dr.textContent = t

}

dayrevenue()


async function Monthrevenue() {

    const email = localStorage.getItem("email")

    const res1 = await fetch(
        `http://localhost:5000/seller/getMonthRevenue?email=${email}`
    )

    const data1 = await res1.json();

    const Mr = document.getElementById("MonthRevenue");

    let t = 0;

    console.log(data1)

    data1.forEach(element => {

        t = t + Number(element.price);

    });

    Mr.textContent = t

}

Monthrevenue()


async function Yearrevenue() {

    const email = localStorage.getItem("email")

    const res1 = await fetch(
        `http://localhost:5000/seller/getYearRevenue?email=${email}`
    )

    const data1 = await res1.json();

    const Yr = document.getElementById("YearRevenue");

    let t = 0;

    console.log(data1)

    data1.forEach(element => {

        t = t + Number(element.price);

    });

    Yr.textContent = t


    const oosCount = document.getElementById("oosCount")
    const lowCount = document.getElementById("lowCount")


    const res2 = await fetch(
        `http://localhost:5000/seller/oosCount?email=${email}`
    )

    const data2 = await res2.json()

    let c = 0;

    data2.forEach((element) => {

        c = c + 1

    })

    oosCount.textContent = c


    const res3 = await fetch(
        `http://localhost:5000/seller/lowCount?email=${email}`
    )

    const data3 = await res3.json()

    let d = 0;

    data3.forEach((element) => {

        d = d + 1

    })

    lowCount.textContent = d


    const availCount = document.getElementById("availCount")


    const res4 = await fetch(
        `http://localhost:5000/seller/availableCount?email=${email}`
    )

    const data4 = await res4.json()

    let e = 0;

    data4.forEach((element) => {

        e = e + 1

    })

    availCount.textContent = e

}

Yearrevenue()




async function loadTopSellingProducts() {

    const email = localStorage.getItem("email");

    try {

        const response = await fetch(
            `http://localhost:5000/seller/topSellingProducts?email=${email}`
        );

        const data = await response.json();

        const tbody = document.getElementById("topSellingBody");

        tbody.innerHTML = "";

        data.forEach((product, index) => {

            let rank = index + 1;

            if (rank === 1) {
                rank = "🥇 1";
            }

            else if (rank === 2) {
                rank = "🥈 2";
            }

            else if (rank === 3) {
                rank = "🥉 3";
            }

            tbody.innerHTML += `
                <tr>
                    <td>${rank}</td>
                    <td>${product.productname}</td>
                    <td>${product.totalSold}</td>
                </tr>
            `;

        });

    }

    catch (error) {

        console.log("Error:", error);

    }

}

loadTopSellingProducts();




let products = [];
let currentPage = 1;

const rowsPerPage = 2;




async function loadProductReport() {

    try {

        const email = localStorage.getItem("email");

        const response = await fetch(
            `http://localhost:5000/seller/prodReport?email=${encodeURIComponent(email)}`
        );

        if (!response.ok) {
            throw new Error("Failed to load product report");
        }

        products = await response.json();

        console.log(products);

        currentPage = 1;

        displayProducts();

    }

    catch (error) {

        console.log("Error:", error);

    }

}




function displayProducts() {

    const tbody = document.getElementById("ProductReort");

    tbody.innerHTML = "";

    const start = (currentPage - 1) * rowsPerPage;

    const end = start + rowsPerPage;

    const currentProducts = products.slice(start, end);


    if (currentProducts.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5">No products found</td>
            </tr>
        `;

        return;
    }


    currentProducts.forEach((product, index) => {

        const serialNumber = start + index + 1;

        let availability = "";

        if (product.available_quantity == 0) {

            availability = `
                <span class="text-danger">
                    Out of Stock
                </span>
            `;

        }

        else if (product.available_quantity < 6) {

            availability = `
                <span class="text-warning">
                    Low Stock
                </span>
            `;

        }

        else {

            availability = `
                <span class="text-success">
                    Available
                </span>
            `;

        }


        tbody.innerHTML += `

            <tr>

                <td>${serialNumber}</td>

                <td>${product.name}</td>

                <td>₹${product.price}</td>

                <td>${availability}</td>

            </tr>

        `;

    });


    createPagination();

}




function createPagination() {

    const pagination = document.getElementById("pagination");

    pagination.innerHTML = "";

    const totalPages = Math.ceil(products.length / rowsPerPage);


    if (totalPages <= 1) {
        return;
    }


    pagination.innerHTML += `

        <li class="page-item ${currentPage === 1 ? "disabled" : ""}">

            <button
                class="page-link"
                onclick="changePage(${currentPage - 1})">

                Previous

            </button>

        </li>

    `;


    for (let i = 1; i <= totalPages; i++) {

        pagination.innerHTML += `

            <li class="page-item ${currentPage === i ? "active" : ""}">

                <button
                    class="page-link"
                    onclick="changePage(${i})">

                    ${i}

                </button>

            </li>

        `;

    }


    pagination.innerHTML += `

        <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">

            <button
                class="page-link"
                onclick="changePage(${currentPage + 1})">

                Next

            </button>

        </li>

    `;

}




function changePage(page) {

    const totalPages = Math.ceil(products.length / rowsPerPage);


    if (page < 1 || page > totalPages) {
        return;
    }


    currentPage = page;

    displayProducts();

}



loadProductReport();



function addprod() {

    window.location.href = "addprod.html"

}


function viewprod() {

    window.location.href = "sellerDashBoard.html"

    report.style.display = "none"

    container.style.display = "flex"

    viewproducts.style.display = "none"

}


function viewreport() {

    window.location.href = "sellerDashBoard.html"

    report.style.display = "block"

    container.style.display = "none"

    viewproducts.style.display = "none"

}


function viewproduct() {

    window.location.href = "sellerDashBoard.html"

    report.style.display = "none"

    container.style.display = "none"

    viewproducts.style.display = "flex"

}




// ================= CHART VARIABLES =================

let revenueChart = null;

let topSellingChart = null;




// ================= REVENUE CHART =================

async function loadRevenueChart() {

    const email = localStorage.getItem("email");

    try {

        const response = await fetch(
            `http://localhost:5000/seller/chartRevenue?email=${email}`
        );

        const data = await response.json();

        console.log("Month Wise Chart Data:", data);


        const months = [

            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"

        ];


        const labels = months;


        const revenue = new Array(12).fill(0);


        data.forEach((element) => {

            const monthIndex = months.indexOf(element.month);

            if (monthIndex !== -1) {

                revenue[monthIndex] = Number(element.revenue);

            }

        });


        const backgroundColors = [

            "#4CAF50",
            "#2196F3",
            "#FF9800",
            "#E91E63",
            "#9C27B0",
            "#00BCD4",
            "#FF5722",
            "#795548",
            "#3F51B5",
            "#8BC34A",
            "#FFC107",
            "#607D8B"

        ];


        if (revenueChart) {

            revenueChart.destroy();

        }


        const ctx = document.getElementById("myChart");


        const isDarkMode =
            document.body.classList.contains("dark-mode");


        const textColor =
            isDarkMode ? "#ffffff" : "#333333";


        const gridColor =
            isDarkMode ? "#444444" : "#dddddd";


        revenueChart = new Chart(ctx, {

            type: "bar",

            data: {

                labels: labels,

                datasets: [{

                    label: "Monthly Sales Revenue",

                    data: revenue,

                    backgroundColor: backgroundColors,

                    borderRadius: 6

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        display: true,

                        labels: {

                            color: textColor

                        }

                    }

                },

                scales: {

                    x: {

                        ticks: {

                            color: textColor

                        },

                        grid: {

                            color: gridColor

                        }

                    },

                    y: {

                        beginAtZero: true,

                        ticks: {

                            color: textColor,

                            callback: function (value) {

                                return "₹" + value;

                            }

                        },

                        grid: {

                            color: gridColor

                        }

                    }

                }

            }

        });

    }

    catch (error) {

        console.log("Chart Error:", error);

    }

}




// ================= TOP SELLING CHART =================

async function loadTopSellingChart() {

    const email = localStorage.getItem("email");

    try {

        const response = await fetch(
            `http://localhost:5000/seller/topSellingProducts?email=${email}`
        );

        if (!response.ok) {

            throw new Error("Failed to load top selling products");

        }

        const data = await response.json();

        console.log("Top Selling Products:", data);


        const topThree = data.slice(0, 3);


        const productNames = [];

        const quantitySold = [];


        topThree.forEach(product => {

            productNames.push(product.productname);

            quantitySold.push(Number(product.totalSold));

        });


        const ctx = document.getElementById("topSellingChart");


        const isDarkMode =
            document.body.classList.contains("dark-mode");


        const textColor =
            isDarkMode ? "#ffffff" : "#333333";


        if (topSellingChart) {

            topSellingChart.destroy();

        }


        topSellingChart = new Chart(ctx, {

            type: "pie",

            data: {

                labels: productNames,

                datasets: [{

                    label: "Quantity Sold",

                    data: quantitySold,

                    borderWidth: 1

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        labels: {

                            color: textColor

                        }

                    }

                }

            }

        });

    }

    catch (error) {

        console.log("Top Selling Chart Error:", error);

    }

}




// ================= UPDATE CHART COLOURS =================

function updateChartColors(chart) {

    if (!chart) {

        return;

    }


    const isDarkMode =
        document.body.classList.contains("dark-mode");


    const textColor =
        isDarkMode ? "#ffffff" : "#333333";


    const gridColor =
        isDarkMode ? "#444444" : "#dddddd";


    // Legend

    if (chart.options.plugins &&
        chart.options.plugins.legend) {

        chart.options.plugins.legend.labels.color = textColor;

    }


    // X Axis

    if (chart.options.scales &&
        chart.options.scales.x) {

        chart.options.scales.x.ticks.color = textColor;

        chart.options.scales.x.grid.color = gridColor;

    }


    // Y Axis

    if (chart.options.scales &&
        chart.options.scales.y) {

        chart.options.scales.y.ticks.color = textColor;

        chart.options.scales.y.grid.color = gridColor;

    }


    chart.update();

}




// ================= DARK MODE =================

function toggleDarkMode() {

    document.body.classList.toggle("dark-mode");


    const button =
        document.getElementById("darkModeBtn");


    if (document.body.classList.contains("dark-mode")) {

        button.innerHTML = "☀️";

        localStorage.setItem(
            "dashboardTheme",
            "dark"
        );

    }

    else {

        button.innerHTML = "🌙";

        localStorage.setItem(
            "dashboardTheme",
            "light"
        );

    }


    // Update chart text colours

    updateChartColors(revenueChart);

    updateChartColors(topSellingChart);

}




// ================= LOAD SAVED THEME =================

function loadDashboardTheme() {

    const savedTheme =
        localStorage.getItem("dashboardTheme");


    const button =
        document.getElementById("darkModeBtn");


    if (savedTheme === "dark") {

        document.body.classList.add("dark-mode");

        button.innerHTML = "☀️";

    }

    else {

        button.innerHTML = "🌙";

    }

}




// ================= INITIAL LOAD =================

loadDashboardTheme();

loadRevenueChart();

loadTopSellingChart();