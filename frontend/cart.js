console.log("cart.js")

let receivedUsername;
let receivedEmail;
receivedEmail = localStorage.getItem("email");
receivedUsername = localStorage.getItem("username");

const Name = document.getElementById("name");
Name.textContent = `HI ${receivedUsername}`;

console.log(receivedUsername);

async function cart(btn){
    console.log("running");
    const parentElement = btn.parentElement;
    const productName = parentElement.querySelector("h5").textContent;

    const response = await fetch("http://localhost:5000/cart", {
        method : "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username : receivedUsername,
            email : receivedEmail,
            productName : productName,
            quantity : 1,
            cartCount : 1
        })
    });

    const data = await response.json();

    if(response.ok){
        alert(data.msg);
    }
    else{
        alert(data.msg);
    }
}

async function getProducts() {
    console.log("hi");

    const email = localStorage.getItem("email");
    const response = await fetch(`http://localhost:5000/cart?email=${encodeURIComponent(email)}`);
    const data = await response.json();

    const container = document.getElementById("container");
    container.innerHTML = "";

    data.forEach(function(product) {
        const divouter = document.createElement("div");
        const divinner1 = document.createElement("div");
        const divinner2 = document.createElement("div");

        divinner1.className = "img col-md-4";
        divouter.className = "row prod-cart container mb-3";
        divinner2.className = "content col-md-8";

        divinner1.innerHTML = `
            <img src="http://localhost:5000/${product.path}" alt="img">
        `;

        divinner2.innerHTML = `
            <h1 class="prodname text-secondary">${product.name}</h1>

            <p class="mt-3">
                <span class="d-price text-secondary ms-2 me-2">
                    ₹${product.price - (product.price * (product.discount)/100)}
                </span>
                <span class="o-price">₹${product.price}</span>
                <span class="text-success">${product.discount}% off</span>
            </p>

            <p class="msg">All issue easy return! 7 days return policy</p>
            <p>Quantity: ${product.quantity}</p>
            <button class="btn btn-danger" onclick="deletecart(this)">Remove From Cart</button>
        `;

        divouter.appendChild(divinner1);
        divouter.appendChild(divinner2);
        container.appendChild(divouter);
    });
}

getProducts();

let data;

async function deletecart(btn){
    const parentElement = btn.parentElement;
    const productname = parentElement.querySelector("h1").textContent;

    const response = await fetch("http://localhost:5000/deletecart", {
        method : "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username : receivedUsername,
            productName : productname
        })
    });

    data = await response.json();

    const msgBox = document.getElementById("msg-box");

    if(response.ok){

        msgBox.style.display = "block";
        msgBox.style.backgroundColor = "green";
        msgBox.textContent = "Item Removed From Cart";

        const email = localStorage.getItem("email");

        await fetch(`http://localhost:5000/delquan?email=${encodeURIComponent(email)}`, {
            method : "POST",
            headers : {
                "Content-Type":"application/json"
            }
        });

        localStorage.setItem("totalCount", Number(localStorage.getItem("totalCount")) - 1);

    }
    else{

        msgBox.style.display = "block";
        msgBox.style.backgroundColor = "red";
        msgBox.textContent = `${data.msg}`;

        setTimeout(()=>{
            msgBox.style.display = "none";
        },5000);

        return;
    }

    setTimeout(()=>{
        msgBox.style.display = "none";
    },5000);

    const email = localStorage.getItem("email");
    const emptycart = document.getElementById("empty-cart");
    const Details = document.getElementById("Details");
    const payBtn = document.getElementById("pay-btn");

    const act = await fetch(`http://localhost:5000/getquan?email=${encodeURIComponent(email)}`);
    const actCount = await act.json();

    if(actCount.cartCount <= 0){

        Details.style.display = "none";
        emptycart.style.display = "block";
        payBtn.style.display = "none";
    }
    else{

        Details.style.display = "block";
        emptycart.style.display = "none";
        payBtn.style.display = "block";
    }

    await getPriceDetails();
    await getProducts();

    setTimeout(()=>{
        location.reload();
    },500);
}

let dataa;

async function getPriceDetails(){
    const email = localStorage.getItem("email");
    const response = await fetch(`http://localhost:5000/cart?email=${encodeURIComponent(email)}`);

    dataa = await response.json();
    console.log(dataa,email);

    const productPrice = document.getElementById("Product-price");
    const totalDiscount = document.getElementById("totalDiscount");
    const orderTotal = document.getElementById("order-total");

    let pprice = 0;
    let tDis = 0;
    let oTotal = 0;

    dataa.forEach(element => {

        const quantity = Number(element.quantity) || 1;
        const price = Number(element.price) || 0;
        const discount = Number(element.discount) || 0;

        pprice = pprice + (price * quantity);
        tDis = tDis + (price * (discount/100) * quantity);
        oTotal = oTotal + ((price - (price * (discount/100))) * quantity);

        console.log(pprice,tDis,oTotal);
    });

    productPrice.textContent = `₹${pprice}`;
    totalDiscount.style.color = "green";
    totalDiscount.textContent = `+₹${tDis}`;
    orderTotal.textContent = `₹${oTotal}`;

    localStorage.setItem("totalpay", oTotal);
    localStorage.setItem("totaldiscount", tDis);

    const savMsgCash = document.getElementById("sav-cash");
    const savMsgOnl = document.getElementById("sav-online");
    const payamount = document.getElementById("amount");
    const onlinepay = document.getElementById("online-amount");
    const onlineO = document.getElementById("online-o");

    payamount.textContent = `₹${oTotal}`;
    onlinepay.textContent = `₹${oTotal - (oTotal * 0.1)}`;
    onlinepay.style.color = "green";
    onlineO.textContent = `₹${oTotal}`;
    savMsgCash.textContent = `You have saved ₹${tDis} 🎉`;
    savMsgOnl.textContent = `You have saved ₹${tDis} + 10% 🎉`;
    savMsgCash.style.color = "green";
    savMsgOnl.style.color = "green";
}

getPriceDetails();

const paymentPop = document.getElementById("payment-popup");
const blurr = document.getElementById("blur-overlay");
const addAddress = document.getElementById("add-address");
const saveaddbtn = document.getElementById("saveaddbtn");
const updatebtn = document.getElementById("updatebtn");

async function payy(){

    paymentPop.style.display = "block";
    blurr.style.display = "block";

    const email = localStorage.getItem("email");

    const res1 = await fetch(`http://localhost:5000/checkAddress?email=${encodeURIComponent(email)}`);
    const data2 = await res1.json();

    console.log(data2);

    const paddressLine = document.getElementById("payment-address-line");
    const cbtn = document.getElementById("changebtn");

    if(res1.ok){

        paddressLine.textContent = `${data2.fullname}, ${data2.address}, ${data2.city} - ${data2.pincode}`;
        cbtn.style.display = "block";

    }
    else{

        paddressLine.textContent = "Please add your delivery address";
        cbtn.style.display = "none";

        addaddress();
    }
}

function cloose(){
    paymentPop.style.display = "none";
    blurr.style.display = "none";
    addAddress.style.display = "none";
}

function addaddress(){

    paymentPop.style.display = "none";
    addAddress.style.display = "block";
    blurr.style.display = "block";

    saveaddbtn.style.display = "block";
    updatebtn.style.display = "none";

    document.getElementById("fullname").disabled = false;
}

function closee(){
    addAddress.style.display = "none";
    blurr.style.display = "block";
    paymentPop.style.display = "block";
}

async function saveAddress(){

    const email = localStorage.getItem("email");
    const fullname = document.getElementById("fullname").value;
    const phno = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    const pincode = document.getElementById("pincode").value;

    if(!fullname || !phno || !address || !city || !pincode){
        alert("Please fill all address fields");
        return;
    }

    const response = await fetch("http://localhost:5000/addAddress", {
        method : "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            fullname : fullname,
            phno : phno,
            address : address,
            city : city,
            pincode : pincode
        })
    });

    const data = await response.json();

    if(response.ok){

        alert(data.msg);

        addAddress.style.display = "none";
        paymentPop.style.display = "block";
        blurr.style.display = "block";

        await payy();

    }
    else{
        alert(data.msg);
    }
}

async function changeAddress(){

    addAddress.style.display = "block";
    paymentPop.style.display = "none";
    blurr.style.display = "block";

    saveaddbtn.style.display = "none";
    updatebtn.style.display = "block";

    const email = localStorage.getItem("email");

    const response = await fetch(`http://localhost:5000/checkAddress?email=${encodeURIComponent(email)}`);
    const data = await response.json();

    if(response.ok){

        document.getElementById("fullname").value = data.fullname;
        document.getElementById("phone").value = data.phone;
        document.getElementById("address").value = data.address;
        document.getElementById("city").value = data.city;
        document.getElementById("pincode").value = data.pincode;

        document.getElementById("fullname").disabled = true;

    }
    else{
        alert(data.msg || "Address not found");
    }
}

async function updateAddress(){

    const email = localStorage.getItem("email");
    const fullname = document.getElementById("fullname").value;
    const phno = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    const pincode = document.getElementById("pincode").value;

    if(!fullname || !phno || !address || !city || !pincode){
        alert("Please fill all address fields");
        return;
    }

    const response = await fetch("http://localhost:5000/updateAddress", {
        method : "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            fullname : fullname,
            phno : phno,
            address : address,
            city : city,
            pincode : pincode
        })
    });

    const data = await response.json();

    if(response.ok){

        alert(data.msg);

        addAddress.style.display = "none";
        paymentPop.style.display = "block";
        blurr.style.display = "block";

        await payy();

    }
    else{
        alert(data.msg);
    }
}

async function placeOrder(){

    const email = localStorage.getItem("email");

    const addressResponse = await fetch(`http://localhost:5000/checkAddress?email=${encodeURIComponent(email)}`);
    const addressData = await addressResponse.json();

    if(!addressResponse.ok || !addressData){
        alert("Please add your delivery address before placing the order");
        addaddress();
        return;
    }

    const cartResponse = await fetch(`http://localhost:5000/cart?email=${encodeURIComponent(email)}`);

    if(!cartResponse.ok){
        alert("Failed to fetch cart products");
        return;
    }

    const products = await cartResponse.json();

    if(products.length === 0){
        alert("Your cart is empty!");
        return;
    }

    const response = await fetch("http://localhost:5000/seller/order", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            products: products
        })
    });

    const data = await response.json();

    if(!response.ok){
        alert(data.msg || "Order failed");
        return;
    }

    alert(data.msg);

    const delQuanRes = await fetch("http://localhost:5000/seller/decreaseQuan", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            products: products
        })
    });

    const res = await delQuanRes.json();

    if(delQuanRes.ok){
        console.log(res.msg);
    }
    else{
        console.log(res.msg || "Quantity update failed");
    }
}

async function msgdisplay(){

    const emptycart = document.getElementById("empty-cart");
    const Details = document.getElementById("Details");
    const payBtn = document.getElementById("pay-btn");
    const email = localStorage.getItem("email");

    const act = await fetch(`http://localhost:5000/getquan?email=${encodeURIComponent(email)}`);
    const actCount = await act.json();

    console.log(actCount);

    if(!actCount || actCount.cartCount <= 0){

        Details.style.display = "none";
        emptycart.style.display = "block";
        payBtn.style.display = "none";

    }
    else{

        Details.style.display = "block";
        emptycart.style.display = "none";
        payBtn.style.display = "block";

    }
}

msgdisplay();

// async function checkcart(){
//      const email = localStorage.getItem("email");
//     const response = await fetch(`http://localhost:5000/cartitem?email=${encodeURIComponent(email)}`);
//     const data = await response.json()
//     if(data.length == 0){
//         const myorders = document.getElementById("myorders")
//         myorders.style.display="none"
//     }
//     else{
//          const myorders = document.getElementById("myorders")
//         myorders.style.display="none"
//     }
// }
// checkcart()

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


function loadTheme() {

    const savedTheme = localStorage.getItem("dashboardTheme");

    const button = document.getElementById("darkModeBtn");

    if (!button) return;

    if (savedTheme === "dark") {

        document.body.classList.add("dark-mode");

        button.textContent = "light_mode";

    } else {

        button.textContent = "dark_mode";

    }

}


loadTheme();