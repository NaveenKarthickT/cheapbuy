const login_page = document.getElementById("login-page")
const register_page = document.getElementById("register-page")
const fpage=document.getElementById("fpage")

function register(){
     login_page.style.display = "none";
     register_page.style.display="block";
}
function loginpage(){
    login_page.style.display = "block";
    register_page.style.display="none";
     fpage.style.display="none";
}
function forget_page(){
     login_page.style.display = "none";
      fpage.style.display="block";
}

async function login(){
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;
    const errorMsg=document.getElementById("errormsg")
    const response = await fetch(`http://localhost:5000/seller/user?email=${email}`);

    
    const data = await response.json();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
          errorMsg.style.display="block"
           errorMsg.textContent ="Enter your mail id !"
        return;
    }

    if (!emailPattern.test(email)) {
         errorMsg.style.display="block"
        errorMsg.textContent ="Enter a Valid email Address!"
        return;
    }
    
    if (email =="" || pass ==""){
        errorMsg.style.display="block";
         errorMsg.textContent ="! Both email and password are required"
         document.getElementById("email").value="";
         document.getElementById("password").value="";
         console.log(`${email.value} console`)
         return;
    }
    if(response.ok){
        if(data.password == pass){
            localStorage.setItem("businessName",data.business_name) 
            localStorage.setItem("email", data.email);
            localStorage.setItem("name",data.name);
            window.location.href="dashBoard.html";
            
        }
        else{
            errorMsg.style.display="block"
           errorMsg.textContent ="! Wrong Password . Try Again"
            document.getElementById("email").value="";
             document.getElementById("password").value="";
        }
    }
    else{
         errorMsg.style.display="block"
        errorMsg.textContent=`! ${data.msg}`
         document.getElementById("email").value="";
          document.getElementById("password").value="";
    }

}



async function register_suc() {

    const username = document.getElementById("reg-name").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;
    const confirm = document.getElementById("reg-confirm").value;
    const buisnessName = document.getElementById("Buisness-Name").value;
    const phone = document.getElementById("ph-no").value;
    const errorMsg=document.getElementById("reg-error-msg")
    if(username == "" || email == "" || password == "" || confirm == "" || buisnessName=="" || phone ==""){
        register()
        errorMsg.style.display="block"
        errorMsg.textContent="! All the fields are required"
        return
    }

    let specialChars = "@#$%&*!1234567890";

    if (!([...specialChars].some(char => password.includes(char)))) {
         errorMsg.textContent ="!Your Password is Weak"
         errorMsg.style.display="block"
        return 
    }
    if(password.length < 8){
        errorMsg.textContent ="!Password should contain minimum of 8 character"
        errorMsg.style.display="block"
        return 
    } 

    if(password != confirm){
         errorMsg.style.display="block"
        errorMsg.textContent="Both password and confirm password should be same"
    }
    console.log(phone.length)

    if(phone.length >10 || phone.length<10){
        errorMsg.style.display="block"
        errorMsg.textContent="!invalid mobile number"
    }

    const userpresent = await fetch("http://localhost:5000/seller/userexist");
    
    const data = await userpresent.json()
    let visited = true
    data.forEach(element => {
        if (element.email == email){
            visited = false;
        }
    });
    if(!visited){
        return alert("user already exists")
    }

    if (username != "" && email != "" && password != "" && confirm != "") {

        if (password == confirm) {

            const response = await fetch("http://localhost:5000/seller/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    pass: password,
                    buis:buisnessName,
                    ph:phone
                })
            });

            if (response.ok) {
                alert("Registration Successful");
                    login_page.style.display = "block";
    register_page.style.display="none";
     fpage.style.display="none";
                
            }

        } else {
           errorMsg.textContent="! Enter Same Password In Both Field"
        }

    } else {
        alert("enter all details!!!");
    }
}