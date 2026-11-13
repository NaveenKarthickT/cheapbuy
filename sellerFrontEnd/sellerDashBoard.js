const businessName = document.getElementById("Buisness-Name")
const name = localStorage.getItem("businessName")
const uname=localStorage.getItem("name")
const buname=document.getElementById("name")
businessName.textContent=name
buname.textContent=uname

function addprod(){
    window.location.href="addprod.html"
}

const email = localStorage.getItem("email")


async function getRecentOrders(){
    // const response =await fetch(`http://localhost:5000/seller/order?email=${email}`)
    
    // const data =await response.json()
    // const customerNames = data[0]
    const customer= localStorage.getItem("email")
    const res = await fetch(`http://localhost:5000/checkAddressSeller?email=${customer}`)
    const address = await res.json()
    console.log(address)
     const rec_order = document.getElementById("rec-order")
    if (address.length == 0){
        const msg= document.getElementById("err-msg")
        msg.style.display="block"
        rec_order.style.display="none"
        return
    }
    rec_order.style.display="block"
    
    const container =document.getElementById("container");
    
    address.forEach(function(product){
        console.log("Actual order object:", product);
        const divouter=document.createElement("div")
        const divinner=document.createElement("div")
        divinner.className="product-card"
        divouter.className="col-md-3"
        divinner.innerHTML=`
         <img src="http://localhost:5000/${product.path}">
        <h5 >Order By : <span class="text-secondary">${product.names} , ${product.address} </span>  </h5>
        <button
            class="btn btn-primary"
            data-order-id="${product.id}"
            data-product-name="${product.name}"
            data-customer="${product.names}"
            data-address="${product.address}"
            data-path="${product.path}"
            data-uemail="${product.uemail}"
            
            onclick="assignAgent(this)">
            Assign Agent
        </button>
        `
        divouter.appendChild(divinner)
        container.appendChild(divouter)
        console.log(product.path)
        
    })
   
}
getRecentOrders()

const container = document.getElementById("container")
const report = document.getElementById("report")
const viewproducts = document.getElementById("containerr")
const rcontent = document.getElementById("report-content")
async function search(){
    const sdate = document.getElementById("Start-Date").value;
    const edate = document.getElementById("End-Date").value;
    const fresult = document.getElementById("filter-result")
    const email=localStorage.getItem("email")
    let data;
    if(edate==""){
        const response= await fetch(`http://localhost:5000/seller/Filterorderstart?email=${email}&startDate=${sdate}`) 
         data = await response.json()
    }
   else{
     const response= await fetch(`http://localhost:5000/seller/Filterorder?email=${email}&startDate=${sdate}&endDate=${edate}`) 
      data = await response.json()
   }
    const ferr=document.getElementById("filter-err")
    if(data.length == 0){
        ferr.textContent="No Matched Result !!"
        
        rcontent.style.display="none"
        ferr.style.display="block"
        return
    }
    ferr.style.display="none"
    rcontent.style.display="block"

    console.log(data)
    
    fresult.innerHTML=""
     data.forEach(order => {
        fresult.innerHTML += `
            <tr>
                <td>${order.id}</td>
                <td>${order.productname}</td>
                <td>${order.quantity}</td>
                <td>${order.price}</td>
                <td>${order.date.split("T")[0]}</td>
            </tr>
        `;
    });
}

function viewprod(){
    report.style.display="none"
    container.style.display="flex"
    viewproducts.style.display="none"

}

function viewreport(){
    report.style.display="block"
    container.style.display="none"
    viewproducts.style.display="none"
}

function viewproduct(){
    report.style.display="none"
    container.style.display="none"
    viewproducts.style.display="flex"
}

// async function getProducts() {
//     const email=localStorage.getItem("email")
//     const response = await fetch(`http://localhost:5000/seller/products?email=${email}`);

//     const data = await response.json();

//     const container = document.getElementById("containerr");

//     data.forEach(function(product) {
//         const divouter = document.createElement("div")
//         const divinner = document.createElement("div");
//         divinner.className="product-card"
//         divouter.className="col-md-3"
//         divinner.innerHTML = `
//             <img src="http://localhost:5000/${product.path}">

//             <h5>${product.name}</h5>

//             <p>Price: ₹${product.price}</p>
            
//             <p>${product.description}</p>
//             <p>⭐${product.rating}</p>
//            <button class="btn btn-primary" onclick="edit(this)">Edit</button>
//             <p class ="text-danger" id="stockmsg">low stock !!</p>
 
//         `;
//         divouter.appendChild(divinner)
//         container.appendChild(divouter);
//         console.log(product.path)
//         const stockmsg = divinner.querySelector("#stockmsg")
//         if(product.available_quantity <=5){
//             stockmsg.style.display="block"
//         }
//         else{
//             stockmsg.style.display="none"
//         }
//     });
    
// }
// getProducts();

async function displayProducts() {
    const email = localStorage.getItem("email");
    const response = await fetch(`http://localhost:5000/seller/products?email=${email}`);
    const data = await response.json();

    const table = document.getElementById("product-table");

    table.innerHTML = "";

    data.forEach(product => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <img src="http://localhost:5000/${product.path}"
                     width="70"
                     height="70"
                     style="object-fit: cover;">
            </td>
            <td>${product.name}</td>
            <td>₹${product.price}</td>
            <td>${product.available_quantity}</td>
            <td>
                ${
                    product.available_quantity == 0
                        ? '<span class="text-danger">Out of stock</span>'
                        : product.available_quantity < 6
                            ? '<span class="text-warning">Low stock</span>'
                            : '<span class="text-success">Stock available</span>'
                }
            </td>
            <td>
                <button class="btn btn-primary" data-description="${product.description}" onclick="edit(this)">Add</button>
            </td>
        `;

        table.appendChild(row);
    });
}

displayProducts();



 let  selectedCard;

        function back(){
            const popup=document.getElementById("popup")
            const blur=document.getElementById("blur")
            popup.style.display="none"
            blur.style.display="none"
            
        }
 
let productName;



function edit(button) {
    const popup = document.getElementById("popup");
    const blur = document.getElementById("blur");
    const row = button.closest("tr");
     const quantity = row.cells[3].textContent;

    productName = row.cells[1].textContent;
    const price = row.cells[2].textContent.replace("₹", "");
    const description = button.dataset.description;

    document.getElementById("editProductName").value = productName;
    document.getElementById("editProductName").disabled = true;
    document.getElementById("editPrice").value = price;
    document.getElementById("editDescription").value = description;
    document.getElementById("editQuantity").value=quantity;

    popup.style.display = "block";
    blur.style.display = "block";

    document.querySelector(".blur-overlay").style.display = "block";
}

   
async function change() {
    const changedProdName =
        document.getElementById("editProductName").value.trim();

    const changedPrice =
        document.getElementById("editPrice").value;

    const changedDes =
        document.getElementById("editDescription").value.trim();

   
    if (
        changedProdName === "" ||
        changedPrice === "" ||
        changedDes === ""
    ) {
        alert("Please fill all fields");
        return;
    }

    if (Number(changedPrice) <= 0 ) {
        alert("Please enter a valid price");
        return;
    }


        const response = await fetch("http://localhost:5000/editProducts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                changedProdName: changedProdName,
                changedDes: changedDes,
                changedPrice: changedPrice,
                productName: productName
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.msg);
            back();
            await displayProducts();
        } else {
            alert(data.msg || "Failed to update product");
        }
    } 

    const btn =document.getElementById("btn")
    const sdate = document.getElementById("Start-Date")
    const ed = document.getElementById("ed")
    const edate=document.getElementById("End-Date")
    btn.disabled=true
    sdate.addEventListener("input" ,function(){
        if (sdate.value != ""){
            btn.disabled=false
            ed.style.display="inline-block"
            edate.style.display="inline-block"
        }
        else {
        ed.style.display = "none";
        edate.style.display = "none";
        btn.disabled = true;
    }
    } );

// async function lowstock(){
//     const email = localStorage.getItem("email")
//     const response = await fetch(`http://localhost:5000/seller/getremainingcount?email=${email}`)
//     const data = await response.json()
   
//     data.forEach(function(count){
//         if(count.available_quantity<=5){
//             const notification = document.getElementById("notification")
//             notification.style.display="block"
//             return
//         }
//     })
// }
// lowstock()
let selectedbtn = null;

async function assignAgent(button) {
    selectedbtn = button;

    const blur = document.getElementById("blur");
    const cAgent = document.getElementById("chooseAgent");
    const agentNames = document.getElementById("agent_names");

    blur.style.display = "block";
    cAgent.style.display = "block";

    const response = await fetch("http://localhost:5000/agent/allUser");
    const data = await response.json();

    if (response.ok) {
        agentNames.innerHTML =
            '<option value="">Select an agent</option>';

        data.forEach(function(agent) {
            const option = document.createElement("option");

            option.value = agent.fullname;
            option.textContent = agent.fullname;

            agentNames.appendChild(option);
        });
        console.log("Button data:", selectedbtn.dataset);
    } else {
        alert(data.msg || "Failed to load agents");
    }
}

function closeAgentList(){
    const blur =document.getElementById("blur")
    const cAgent = document.getElementById("chooseAgent")
    blur.style.display="none"
    cAgent.style.display="none"
}
async function assign() {
    const email = localStorage.getItem("email");
    const agentNames = document.getElementById("agent_names");

    const agentName = agentNames.value;

    const productName = selectedbtn.dataset.productName;
    const order_id = selectedbtn.dataset.orderId;
    const path = selectedbtn.dataset.path;
    const address = selectedbtn.dataset.address;
    const uemail = selectedbtn.dataset.uemail;
    console.log("Product:", productName);
    console.log("Order ID:", order_id);
    console.log("Agent:", agentName);
    if (!agentName) {
        alert("Please select an agent");
        return;
    }

    if (!productName || !order_id || order_id === "undefined" ||!path || !address) {
        console.log("Button data:", selectedbtn.dataset);
        alert("Product name or order ID is missing");
        return;
    }

    try {
        const response = await fetch(
            "http://localhost:5000/agent/assignitems",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    seller_email: email,
                    productName: productName,
                    order_id: order_id,
                    agentName: agentName,
                    path : path,
                    address : address
                })
            }
        );

        const data = await response.json();

        if (response.ok) {
            const res = await fetch(`http://localhost:5000/updateStatus?email=${uemail}&prod=${productName}`)
            const dataa = await res.json()
            console.log(dataa)
            alert("Agent assigned successfully");
            closeAgentList();
        } else {
            alert(data.msg || "Assignment failed");
        }
    } catch (error) {
        console.error("Assignment error:", error);
        alert("Unable to connect to the server");
    }
}

function toggleDarkMode() {

    document.body.classList.toggle("dark-mode");

    const button = document.getElementById("darkModeBtn");

    if (document.body.classList.contains("dark-mode")) {

        button.textContent = "light_mode";

        localStorage.setItem("dashboardTheme", "dark");

    } else {

        button.textContent = "dark_mode";

        localStorage.setItem("dashboardTheme", "light");

    }

}


function loadDashboardTheme() {

    const savedTheme = localStorage.getItem("dashboardTheme");

    const button = document.getElementById("darkModeBtn");

    if (savedTheme === "dark") {

        document.body.classList.add("dark-mode");

        button.textContent = "light_mode";

    } else {

        button.textContent = "dark_mode";

    }

}


loadDashboardTheme();