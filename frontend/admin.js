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
           <button class="btn btn-primary" onclick="edit(this)">Edit</button>
        `;
        divouter.appendChild(divinner)
        container.appendChild(divouter);
        console.log(product.path)
    });
    
}

getProducts();

 let  selectedCard;
 let productName;
        function addprod(){
            window.location.href="uploadphotos.html"
        }
        function back(){
            const popup=document.getElementById("popup")
            const blur=document.getElementById("blur")
            popup.style.display="none"
            blur.style.display="none"
            
        }
        function edit(button){
            const popup=document.getElementById("popup")
            const blur=document.getElementById("blur")
            popup.style.display="block"
            blur.style.display="block"

             selectedCard = button.parentElement;

    
     productName = selectedCard.querySelector("h5").textContent;

    const paragraphs = selectedCard.querySelectorAll("p");

    const price = paragraphs[0].textContent.replace("Price: ₹", "");
    const description = paragraphs[1].textContent;
   console.log(productName)
    
    document.getElementById("editProductName").value = productName;
    document.getElementById("editPrice").value = price;
    document.getElementById("editDescription").value = description;

  
    document.querySelector(".blur-overlay").style.display = "block";
    document.getElementById("popup").style.display = "block";
        }

    async function change(){
        const changedProdName = document.getElementById("editProductName").value
        const changedPrice= document.getElementById("editPrice").value 
       const changedDes =document.getElementById("editDescription").value 
        console.log(productName)
       const response =await fetch("http://localhost:5000/editProducts", {
            method : "POST",
            headers:{
                    "Content-Type" : "application/json"
                },
            body : JSON.stringify({
                changedProdName : changedProdName ,
                changedDes : changedDes,
                changedPrice : changedPrice,
                productName:productName
            })
        })
        const data = await response.json()
        if(response.ok){
            alert(data.msg)
        }
        else{
            alert(data.msg)
        }
        
    }