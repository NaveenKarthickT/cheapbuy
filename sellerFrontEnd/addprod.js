const businessName = document.getElementById("Buisness-Name");

const businessNameValue = localStorage.getItem("businessName");

businessName.textContent = businessNameValue || "";

const container = document.getElementById("container")
const report = document.getElementById("report")
const viewproducts = document.getElementById("containerr")
const rcontent = document.getElementById("report-content")
function addprod(){
    window.location.href="addprod.html"
}


function viewprod(){
     window.location.href="sellerDashBoard.html"
    report.style.display="none"
    container.style.display="flex"
    viewproducts.style.display="none"

}

function viewreport(){
      window.location.href="sellerDashBoard.html"
    report.style.display="block"
    container.style.display="none"
    viewproducts.style.display="none"
}

function viewproduct(){
      window.location.href="sellerDashBoard.html"
    report.style.display="none"
    container.style.display="none"
    viewproducts.style.display="flex"
}


async function addproducts() {


    const prodname = document.getElementById("name").value.trim();
    const price = document.getElementById("price").value.trim();
    const description = document.getElementById("description").value.trim();
    const image = document.getElementById("image").files[0];
    const discount = document.getElementById("discount").value.trim();
    const availQuan = document.getElementById("availQuan").value.trim();



    const prodErrMsg = document.getElementById("prod-errmsg");
    const priceErrMsg = document.getElementById("price-errmsg");
    const desErrMsg = document.getElementById("des-errmsg");
    const imgErrMsg = document.getElementById("img-errmsg");
    const discountErr = document.getElementById("discount-err");
    const aqerr = document.getElementById("availQuantity-err");


    prodErrMsg.style.display = "none";
    priceErrMsg.style.display = "none";
    desErrMsg.style.display = "none";
    imgErrMsg.style.display = "none";
    discountErr.style.display = "none";
    aqerr.style.display = "none";


    let flag = false;


    if (prodname === "") {

        prodErrMsg.style.display = "block";
        prodErrMsg.textContent = "! Product Name Field is Required";

        flag = true;
    }


    if (price === "" || Number(price) <= 0) {

        priceErrMsg.style.display = "block";
        priceErrMsg.textContent = "! Enter a valid price";

        flag = true;
    }


    if (description === "") {

        desErrMsg.style.display = "block";
        desErrMsg.textContent = "! Description Field is Required";

        flag = true;
    }



    if (
        discount !== "" &&
        (Number(discount) < 0 || Number(discount) > 100)
    ) {

        discountErr.style.display = "block";
        discountErr.textContent =
            "! Discount must be between 0 and 100";

        flag = true;
    }


  
    if (availQuan === "" || Number(availQuan) < 1) {

        aqerr.style.display = "block";
        aqerr.textContent =
            "! Available quantity must be at least 1";

        flag = true;
    }



    if (!image) {

        imgErrMsg.style.display = "block";
        imgErrMsg.textContent = "! Please upload a product image";

        flag = true;
    }



    if (flag) {
        return;
    }


  
    const email = localStorage.getItem("email");


   
    const formData = new FormData();

    formData.append("prodname", prodname);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("image", image);
    formData.append("email", email);

   
    formData.append(
        "discount",
        discount === "" ? 0 : discount
    );

    formData.append("availQuan", availQuan);


    try {

        
        const response = await fetch(
            "http://localhost:5000/uploadphotos",
            {
                method: "POST",
                body: formData
            }
        );


        const data = await response.json();


        if (!response.ok) {

            alert(data.msg || "Failed to add product");

            return;
        }


      
        alert(data.msg || "Product added successfully");


        
        document.getElementById("productForm").reset();


    }
    catch (error) {

        console.log("Add Product Error:", error);

        alert("Unable to connect to the server");

    }

}


function backk() {

    window.location.href = "sellerDashBoard.html";

}

function toggleDarkMode() {

    document.body.classList.toggle("dark-mode");

    const button = document.getElementById("darkModeBtn");

    if (document.body.classList.contains("dark-mode")) {

        button.textContent = "light_mode";

        localStorage.setItem("dashboardTheme", "dark");

    } 
    else {

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

    }
    else {

        button.textContent = "dark_mode";

    }

}


loadTheme();