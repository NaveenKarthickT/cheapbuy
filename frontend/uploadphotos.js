async function addproducts(){
    const prodname = document.getElementById("name").value;
const price = document.getElementById("price").value;
const description = document.getElementById("description").value;
const image = document.getElementById("image").files[0];

const prodErrMsg = document.getElementById("prod-errmsg");
const priceErrMsg=document.getElementById("price-errmsg");
const desErrMsg=document.getElementById("des-errmsg");
const imgErrMsg=document.getElementById("img-errmsg")
var flag = 0
if(price ==""){
    priceErrMsg.style.display="block"
    priceErrMsg.textContent="! Price Field is Required"
    flag=1
}
if (prodname==""){
    prodErrMsg.style.display="block"
    prodErrMsg.textContent="! ProductName Field is Required"
    flag=1
}

if(description==""){
    desErrMsg.style.display="block"
    desErrMsg.textContent="! Description Field is Required"
    flag=1
    
}
if(!image){
    imgErrMsg.style.display="block";
    imgErrMsg.textContent="! Upload The Image"
    flag=1
}
if(flag==1){
    return
}
else{
    priceErrMsg.style.display="none"
     prodErrMsg.style.display="none"
      desErrMsg.style.display="none"
       imgErrMsg.style.display="none";
    document.getElementById("name").value=""
    document.getElementById("price").value="";
    document.getElementById("description").value=""
   document.getElementById("image").value = "";
    
}

const formData = new FormData();

formData.append("prodname", prodname);
formData.append("price", price);
formData.append("description", description);
formData.append("image", image);

const response = await fetch("http://localhost:5000/uploadphotos", {
    method: "POST",
    body: formData
});
const data = await response.json();
alert(data.msg)

}