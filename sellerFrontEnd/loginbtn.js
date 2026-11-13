const lname = document.getElementById("login-name");

const email = localStorage.getItem("email");


async function dname() {

    try {

        const response = await fetch(
            `http://localhost:5000/seller/uname?email=${encodeURIComponent(email)}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch username");
        }

        const data = await response.json();

        console.log(data);

        lname.textContent = data.name;

    }

    catch (error) {

        console.log("Error:", error);

        lname.textContent = "User";

    }

}


dname();


// Show / Hide popup

lname.addEventListener("click", function (event) {

    event.stopPropagation();

    const popup = document.getElementById("userPopup");

    popup.classList.toggle("show");

});


// Close popup when clicking outside

document.addEventListener("click", function () {

    const popup = document.getElementById("userPopup");

    if (popup) {
        popup.classList.remove("show");
    }

});


// Logout

function logout() {

    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("businessName");

    window.location.href = "sellerLoginPage.html";

}


// Reset Password
const login_page = document.getElementById("login-page")

const fpage=document.getElementById("fpage")

function resetPassword() {

    window.location.href = "sellerLoginPage.html";

    localStorage.setItem("openResetPassword", "true");
}