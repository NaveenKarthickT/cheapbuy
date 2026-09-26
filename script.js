
const login_page = document.getElementById("login-page")
const register_page = document.getElementById("register-page")
const fpage=document.getElementById("fpage")

function login(){
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;
   
    if (email !="" && pass=="1234"){
       window.location.href = "login.html"
    }
    else if(email==""){
        alert("enter proper mail id")
    }

    else{
        alert("invalid password or mail id")
    }
}
function register(){
     login_page.style.display = "none";
     register_page.style.display="block";
}
function register_suc() {
    const name = document.getElementById("reg-name").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;
    const confirm = document.getElementById("reg-confirm").value;
    if (name!="" && email!="" && password!="" && confirm !="") {
        if (password==confirm) {
            alert("Registration successful!");
            loginpage();
        } else {
            alert("wrong pass");
        }
    }
     else {
        alert("enter all details!!!");
    }
}
function loginpage(){
    login_page.style.display = "block";
    register_page.style.display="none";
     fpage.style.display="none";
}
function forgetpass(){
    const fpassword = document.getElementById("fpassword").value;
    const cpassword = document.getElementById("cpassword").value;
    if(fpassword!="" && cpassword!=""){
        if(fpassword==cpassword){
            alert("password changed")
            loginpage();
        }
    }
}
function forget_page(){
     login_page.style.display = "none";
      fpage.style.display="block";
}