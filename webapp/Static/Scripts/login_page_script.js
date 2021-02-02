var form = document.getElementById("login_form");
var psw = document.getElementById("psw");
var email = document.getElementById("email");

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function submit_onclick () {

    if (psw.value.trim() === '')
    {
        alert("All fields must be filled!");
        return;
    }
    
    if (email.value.trim() === '')
    {
        alert("All fields must be filled!");
        return;
    }

    if (!validateEmail(email.value.trim()))
    {
        alert("Invalid email!");
        return;
    }

    form.submit();
};

document.getElementById("submit_button").addEventListener("click", (e) => {
    e.preventDefault();
    submit_onclick();
});