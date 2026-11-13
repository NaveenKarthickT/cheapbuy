console.log("login.js")
const count = document.getElementById("count")
const email = localStorage.getItem("email")
let actualcount;
async function getCartCount() {

    

    const response = await fetch(`http://localhost:5000/user?email=${email}`);

    const data = await response.json();
    actualcount = data.cartCount
    if(response.ok){
         console.log(data,actualcount);
    }
    else{
        data.msg
    }
    
    if(actualcount=="" || actualcount == 0){
    count.style.display="none"
}
else{
    count.textContent=actualcount
    count.style.display="block"
}

localStorage.setItem("actualCount",actualcount)
   
}

getCartCount();  
console.log(`${actualcount}dnnnd`);            


let totalCount=Number(localStorage.getItem("totalCount")) || 0;
const inc = document.getElementById("inc")
const dec = document.getElementById("dec")
const inbbput =document.getElementById("inbput")

function addQuan() {
    let input = document.getElementById("inbput");

    input.value = Number(input.value) + 1;
}

function delQuan() {
    let input = document.getElementById("inbput");

    if (Number(input.value) > 1) {
        input.value = Number(input.value) - 1;
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const receivedUsername = localStorage.getItem("username");
    const usernameElement = document.getElementById("username");

    if (usernameElement) {
        if (receivedUsername) {
            usernameElement.textContent = receivedUsername;
        } else {
            usernameElement.textContent = "Guest"; 
        }
    }
});
const Username = localStorage.getItem("username");

const search = document.querySelector("#search");

search.addEventListener("input", function () {
    let value = search.value.trim().toLowerCase();
    const products = document.querySelectorAll(".prod-rows .col-md-3");
    products.forEach(function (product) {
        const name = product.querySelector("h5").textContent.toLowerCase();
        if (name.includes(value)) {
            product.style.display = "";
        } else {
            product.style.display = "none";
        }

    });

});

async function cart(btn){

     const parentElement=btn.parentElement
    productName = parentElement.querySelector("h5").textContent;
    quantity = parentElement.querySelector("input").value;
    console.log(quantity)
    const email = localStorage.getItem("email")
    const exists = await fetch(`http://localhost:5000/cart?email=${email}`)
    const existsRes = await exists.json()
    const flag=false
    existsRes.forEach(function(prod){
        if(prod.name==productName){
            alert("product already added to cart!")
            flag=true
        }
    })
    if(flag){
        return
    }
   
   const response=await fetch("http://localhost:5000/cart" , {
    method : "POST",
      headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email : email,
                    username : Username,
                    productName : productName,
                    quantity:quantity,
                    cartCount:quantity
                })
   })
   const data = await response.json()
   const msgBox = document.getElementById("msg-box")
   const count = document.getElementById("count")
   count.textContent=Number(totalCount)+1
   if(response.ok){
    const email = localStorage.getItem("email")

    await fetch(`http://localhost:5000/addquan?email=${email}`,{
        method : "POST",
        headers:{
            "Content-Type" : "application/json"
        }
    })
    msgBox.style.backgroundColor="rgb(44, 58, 44)"
    msgBox.style.display="block"
    msgBox.textContent="Item Added!"
    const get=(await fetch(`http://localhost:5000/getquan?email=${email}`))
    const responsed = await get.json();
    count.textContent=responsed.cartCount
    localStorage.setItem("totalCount",Number(totalCount)+1)
    count.style.display="block"
    console.log(`${responsed.cartCount}nnnfnfnnfnf`)
   }
   else{
    msgBox.style.backgroundColor="red"
    msgBox.style.display="block"
    msgBox.textContent=`${data.msg}`
   }

   setTimeout(()=>{
    msgBox.style.display="none"
   },1500)
}

async function getProducts() {

    const response = await fetch("http://localhost:5000/products");

    const data = await response.json();

    const container = document.getElementById("container");

    data.forEach(function(product) {
        const divouter = document.createElement("div")
        const divinner = document.createElement("div");
        divinner.className="product-card"
        divinner.addEventListener("click", function (event) {

    // Don't open popup when using existing controls
    if (
        event.target.closest("button") ||
        event.target.closest(".inc") ||
        event.target.closest(".dec") ||
        event.target.closest("input")
    ) {

        return;

    }

    showProductModal(product);

});
        divouter.className="col-md-3"
        divinner.innerHTML = `
            <img src="http://localhost:5000/${product.path}">

            <h5>${product.name}</h5>

            <p>Price: ₹${product.price}</p>
            
            <p>${product.description}</p>
            <p>⭐${product.rating}</p>
            <div class="text-secondary d-flex justify-content-between align-items-center m-2">
                <label>Quantity: </label>
                
                <label class="">
                    <span class="inc" onclick="addQuan()">+</span>
                    <input type="number" value=1 min=1 class="quan-input" id="inbput"/>
                    <span class="dec"  onclick="delQuan()">--</span>
                </label>
            </div>
            <button class="btn btn-primary" onclick="cart(this)">Add to Cart</button>
            <p class ="text-danger" id="stockmsg">only ${product.available_quantity} are left</p>
        `;
        divouter.appendChild(divinner)
        container.appendChild(divouter);
        console.log(product.path)
        const stockmsg = divinner.querySelector("#stockmsg")
        if(product.available_quantity <=5){
            stockmsg.style.display="block"
        }
        else{
            stockmsg.style.display="none"
        }

    });
    
}

getProducts();

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

    if (savedTheme === "dark") {

        document.body.classList.add("dark-mode");

        button.textContent = "light_mode";

    } else {

        button.textContent = "dark_mode";

    }

}


loadTheme();

let selectedProduct = null;


function showProductModal(product) {

    selectedProduct = product;

    const modal = document.getElementById("productModal");

    const details = document.getElementById("productDetails");


    details.innerHTML = `

        <div class="product-popup-main">

            <!-- Product Image -->

            <div class="product-popup-image">

                <img
                    src="http://localhost:5000/${product.path}"
                    alt="${product.name}"
                >

            </div>


            <!-- Product Details -->

            <div class="product-popup-info">

                <h2 class="product-popup-name">

                    ${product.name}

                </h2>


                <h3 class="product-popup-price">

                    ₹${product.price}

                </h3>


                <div class="product-popup-rating">

                    ⭐

                    <span>

                        ${product.rating || "4.5"} / 5

                    </span>

                </div>


                <div class="product-popup-description">

                    <strong>Description:</strong>

                    <p>

                        ${product.description || "No description available"}

                    </p>

                </div>


                <p>

                    <strong>Available Stock:</strong>

                    ${product.available_quantity}

                </p>


                <!-- Quantity -->

                <div class="popup-quantity">

                    <strong>Quantity:</strong>


                    <div class="quantity-control">

                        <button onclick="decreasePopupQuantity()">

                            −

                        </button>


                        <input
                            type="number"
                            id="popupQuantity"
                            value="1"
                            min="1"
                            max="${product.available_quantity}"
                        >


                        <button onclick="increasePopupQuantity()">

                            +

                        </button>

                    </div>

                </div>


                <!-- Buttons -->

                <div class="product-popup-buttons">

                    <button
                        class="popup-cart-btn btn btn-primary"
                        onclick="addPopupProductToCart()"
                    >

                         Add to Cart

                    </button>


                    <button
                        class="popup-order-btn btn btn-success"
                        onclick="placeOrderFromPopup()"
                    >

                         Place Order

                    </button>

                </div>

            </div>

        </div>


        <!-- Reviews -->

        <div class="product-reviews">

            <h3 class="review-title">

                ⭐ Customer Reviews

            </h3>


            <div class="review">

                <strong>Arun Kumar</strong>

                <span class="review-stars">

                    ★★★★★

                </span>

                <p>

                    Good quality product. Worth the price!

                </p>

            </div>


            <div class="review">

                <strong>Priya</strong>

                <span class="review-stars">

                    ★★★★☆

                </span>

                <p>

                    The product quality is good and delivery was fast.

                </p>

            </div>


            <div class="review">

                <strong>Rahul</strong>

                <span class="review-stars">

                    ★★★★★

                </span>

                <p>

                    Excellent product! I would recommend it.

                </p>

            </div>

        </div>

    `;


    modal.classList.add("show");

}

function increasePopupQuantity() {

    const input = document.getElementById("popupQuantity");

    const max = Number(input.max);

    if (Number(input.value) < max) {

        input.value = Number(input.value) + 1;

    }

}


function decreasePopupQuantity() {

    const input = document.getElementById("popupQuantity");

    if (Number(input.value) > 1) {

        input.value = Number(input.value) - 1;

    }

}

async function addPopupProductToCart() {

    if (!selectedProduct) {
        return;
    }


    const email = localStorage.getItem("email");

    const username = localStorage.getItem("username");

    const quantity = document.getElementById("popupQuantity").value;


    try {

        const response = await fetch(
            "http://localhost:5000/cart",
            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    email: email,

                    username: username,

                    productName: selectedProduct.name,

                    quantity: quantity,

                    cartCount: quantity

                })

            }
        );


        const data = await response.json();


        if (response.ok) {

            alert("Product added to cart successfully!");

            getCartCount();

            closeProductModal();

        }

        else {

            alert(data.msg || "Unable to add product to cart");

        }

    }

    catch (error) {

        console.log(error);

        alert("Something went wrong");

    }

}

async function placeOrderFromPopup() {

    await addPopupProductToCart();

    window.location.href = "cart.html";

}

function closeProductModal() {

    const modal = document.getElementById("productModal");

    modal.classList.remove("show");

}