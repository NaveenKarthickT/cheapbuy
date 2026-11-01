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
            <p class ="text-danger" id="stockmsg">low stock !!</p>
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
