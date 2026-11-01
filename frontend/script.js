
const login_page = document.getElementById("login-page")
const register_page = document.getElementById("register-page")
const fpage=document.getElementById("fpage")


async function login(){
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;
    const errorMsg=document.getElementById("errormsg")
    const response = await fetch(`http://localhost:5000/user?email=${email}`);

    
    const data = await response.json();
    
    
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
            localStorage.setItem("username",data.names) 
            localStorage.setItem("email", data.email);
            window.location.href="login.html";
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
function register(){
     login_page.style.display = "none";
     register_page.style.display="block";
}
async function register_suc() {

    const username = document.getElementById("reg-name").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;
    const confirm = document.getElementById("reg-confirm").value;
    const errorMsg=document.getElementById("reg-error-msg")
    if(username == "" || email == "" || password == "" || confirm == ""){
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
    if (!(email.includes("@") && email.includes("."))) {
        errorMsg.textContent ="!invalid email"
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

    const userpresent = await fetch("http://localhost:5000/userexist");
    
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

            const response = await fetch("http://localhost:5000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    pass: password,
                    cartCount:0
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
function loginpage(){
    login_page.style.display = "block";
    register_page.style.display="none";
     fpage.style.display="none";
}
async function forgetpass(){
    const mail=document.getElementById("rs-email").value;
    const fpassword = document.getElementById("fpassword").value;
    const cpassword = document.getElementById("cpassword").value;
    const uname = document.getElementById("fmailid").value;
    const errorMsg=document.getElementById("rs-errormsg")
    if(fpassword=="" || cpassword=="" || mail==""){
        errorMsg.style.display="block"
        errorMsg.textContent="! All Fields Are Required"
    }
    if(fpassword!="" && cpassword!=""){
        if(fpassword==cpassword){
            const response = await fetch("http://localhost:5000/forgetpass",{
                method : "POST",
                headers:{
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({
                    newpass : fpassword,
                    uname : uname
                })

            })
            const data = await response.json()

            if(response.ok){
                alert("password changed successfully");
            }
            else{
                alert(data.msg)
            }

        }
        else{
            alert("enter same password in both field");
        }
    }
}
function forget_page(){
     login_page.style.display = "none";
      fpage.style.display="block";
}

 function adminlogin() {
    var adminLogin =document.getElementById('admin-login')
           
                login_page.style.display = "none";
                 adminLogin.style.display="block";
           
        }

function adminLoginsuc(){
    const email = document.getElementById("admin-email").value;
    const pass=document.getElementById("admin-password").value;
    if(email=="admin@gmail.com" && pass=="admin123"){
        window.location.href="admin.html"
    }
}

