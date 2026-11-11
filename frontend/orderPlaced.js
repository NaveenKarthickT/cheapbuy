async function displayOrders() {
    const email = localStorage.getItem("email")
    const response = await fetch(`http://localhost:5000/getOrders?email=${email}`)
    const data=await response.json()
    
    data.forEach(element => {
        const container = document.createElement("div");

container.className = "container mt-4";

container.innerHTML = `
    

    <div class="card p-3">

        <div class="row align-items-center">

            <div class="col-md-2">
               <img src="http://localhost:5000/${element.path}"
                     class="img-fluid"
                      style="width: 100px; height: 100px; object-fit: contain;"
                     alt="Product Image">
            </div>

            <div class="col-md-6">
                <h4>${element.productname}</h4>

                <p class="mb-1">
                    Quantity: <b>${element.quantity}</b>
                </p>

                <p class="mb-1">
                    Order ID: <b>${element.id}</b>
                </p>

            </div>

            <div class="col-md-4 text-md-end">

                <h5 class="text-success">
                    Order Placed
                </h5>

                <p>
                    Your order will be processed soon.
                </p>

                <button class="btn btn-primary" data-prod = ${element.productname}  onclick="openTracking(this)">
                    Track Order
                </button>

            </div>

        </div>

    </div>
`;

document.body.appendChild(container);
    });
}
displayOrders()


// <p class="mb-0">
//     Ordered Date: <b></b>
// </p>

const op = document.getElementById("orderPlaced")
const c = document.getElementById("Confirmed")
const s = document.getElementById("Shipped")
const ofd = document.getElementById("OutForDelivery")
const d = document.getElementById("Delivered")

async function status() {
   
}

status()
 function closeTracking() {

            
            
            document.getElementById("tracking").style.display = "none";
            document.getElementById("blur").style.display = "none";
        }
async function openTracking(button) {

    const prod = button.dataset.prod;
    const email = localStorage.getItem("email");

    const response = await fetch(
        `http://localhost:5000/getOrdersStatus?email=${encodeURIComponent(email)}&prod=${encodeURIComponent(prod)}`
    );

     const data = await response.json();

       document.querySelectorAll(".step").forEach(step => {
        step.classList.remove("active");
    });

    if (data.status === "order placed") {
        document.getElementById("placed").classList.add("active");
        document.getElementById("status").textContent="Placed"
    }
    else if (data.status === "shipped") {
        document.getElementById("shipped").classList.add("active");
        document.getElementById("status").textContent="Shipped"
    }
    else if (data.status === "out for delivery") {
        document.getElementById("out").classList.add("active");
        document.getElementById("status").textContent="Out For Delivery"
    }
    else if (data.status === "delivered") {
        document.getElementById("delivered").classList.add("active");
        document.getElementById("status").textContent="Delivered"
    }

    // const currentStatus = document.getElementById("currentStatus");
    // console.log(data)
    // if (data.status == "placed") {
    //     currentStatus.innerHTML = "🟢 Order Placed";
    // }
    // else if (data.status == "shipped") {
    //     currentStatus.innerHTML = "🚚 Shipped";
    // }
    // else if (data.status == "outfordelivery") {
    //     currentStatus.innerHTML = "🚚 Out for Delivery";
    // }
    // else if (data.status == "delivered") {
    //     currentStatus.innerHTML = "📦 Delivered";
    // }
    // else {
    //     currentStatus.innerHTML = "Status not available";
    // }

    document.getElementById("tracking").style.display = "block";
    document.getElementById("blur").style.display = "block";
}
