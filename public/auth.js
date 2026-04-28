async function register() {
  const userData = {
    name: document.getElementById("reg-name").value,
    email: document.getElementById("reg-email").value,
    phoneNumber: document.getElementById("reg-phone").value,
    location: document.getElementById("reg-location").value,
    age: document.getElementById("reg-age").value,
    date_of_birth: document.getElementById("reg-dob").value,
    gender: document.getElementById("reg-gender").value,
    type: document.getElementById("reg-type").value,
    password: document.getElementById("reg-password").value
  };

  const res = await fetch("/api/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Registration failed");
  }

  alert("User Registered Successfully!");
  window.location.href = "login.html";
}

function requireGuest(){}

window.register = register;
window.requireGuest = requireGuest;