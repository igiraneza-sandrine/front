/*
 * AUTH.JS - Authentication Module
 * ================================
 * This file handles all user authentication functionality including:
 * - Login and registration
 * - Token management (JWT)
 * - User session management
 * - Route protection (requireLogin, requireGuest)
 * 
 * INTEGRATION:
 * - Used by login.html, register.html, dashboard.html, and index.html
 * - Stores JWT token and user info in browser's localStorage
 * - Provides functions to check authentication status
 * 
 * HOW IT WORKS:
 * 1. User logs in via login() function
 * 2. Backend returns JWT token
 * 3. Token is saved to localStorage via saveToken()
 * 4. Token is included in all API requests (see api.js)
 * 5. Pages use requireLogin() to protect authenticated routes
 */

// Backend API endpoints for authentication
var AUTH_URL = "http://localhost:8000/api/auth/login";      // Login endpoint
var USER_url = "http://localhost:8000/api/auth/register";   // Registration endpoint

/*
 * LOCAL STORAGE MANAGEMENT
 * =========================
 * These functions handle storing and retrieving authentication data
 * from browser's localStorage (persists across page refreshes)
 */

/**
 * SAVE TOKEN
 * Stores JWT token in localStorage for future API requests
 * @param {string} token - JWT Bearer token from backend
 */
function saveToken(token) {
  localStorage.setItem("token", token);
}

/**
 * GET TOKEN
 * Retrieves stored JWT token from localStorage
 * @returns {string|null} JWT token or null if not logged in
 */
function getToken() {
  return localStorage.getItem("token");
}

/**
 * SAVE USER
 * Stores user information in localStorage as JSON string
 * @param {object} user - User object with email, username, etc.
 */
function saveUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

/**
 * GET USER
 * Retrieves and parses user information from localStorage
 * @returns {object|null} User object or null if not logged in
 */
function getUser() {
  var u = localStorage.getItem("user");
  return u ? JSON.parse(u) : null;
}

/**
 * CLEAR AUTH
 * Removes all authentication data from localStorage (used during logout)
 * Clears both token and user information
 */
function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

/*
 * ROUTE PROTECTION FUNCTIONS
 * ===========================
 * These functions control access to pages based on authentication status
 */

/**
 * REQUIRE GUEST
 * Redirects to dashboard if user is already logged in
 * Use on login.html and register.html to prevent logged-in users from accessing
 * 
 * HOW IT WORKS:
 * 1. Checks if token exists in localStorage
 * 2. If token exists (user is logged in), redirect to dashboard
 * 3. If no token, allow access to page
 */
function requireGuest() {
  if (getToken()) {
    window.location.href = getIndexPath();
  }
}

/**
 * GET LOGIN PATH
 * Returns correct path to login.html based on current page location
 * Handles both root-level pages and pages in /pages/ folder
 * @returns {string} Relative path to login.html
 */
function getLoginPath() {
  // If current page is in /pages/ folder, go up one level
  var depth = window.location.pathname.includes("/pages/") ? "../" : "";
  return depth + "pages/login.html";
}

/**
 * GET INDEX PATH
 * Returns correct path to dashboard.html based on current page location
 * @returns {string} Relative path to dashboard.html
 */
function getIndexPath() {
  var depth = window.location.pathname.includes("/pages/") ? "../" : "";
  return depth + "pages/dashboard.html";
}

/**
 * REQUIRE LOGIN
 * Redirects to login page if user is not authenticated
 * Use on protected pages like dashboard.html and index.html
 * 
 * HOW IT WORKS:
 * 1. Checks if token exists in localStorage
 * 2. If no token (user not logged in), redirect to login page
 * 3. If token exists, allow access to page
 */
function requireLogin() {
  if (!getToken()) {
    window.location.href = getLoginPath();
  }
}

/*
 * AUTHENTICATION FUNCTIONS
 * =========================
 * These functions handle user login and registration
 */

/**
 * LOGIN FUNCTION
 * Authenticates user with email and password
 * 
 * USED BY: login.html
 * ENDPOINT: POST /api/login
 * 
 * HOW IT WORKS:
 * 1. Gets email and password from form inputs
 * 2. Validates that both fields are filled
 * 3. Sends POST request to backend with credentials
 * 4. Backend validates credentials and returns JWT token
 * 5. Token and user info are saved to localStorage
 * 6. User is redirected to dashboard
 * 
 * ERROR HANDLING:
 * - Shows error if fields are empty
 * - Shows error if credentials are invalid
 * - Re-enables button on failure
 */
function login() {
  // Get form values and remove whitespace
  var email = document.getElementById("email").value.trim();
  var password = document.getElementById("password").value.trim();

  // Validate that both fields are filled
  if (!email || !password) {
    showFormError("login-error", "Please enter email and password.");
    return;
  }

  // Disable button and show loading state
  var btn = document.getElementById("btn-login");
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Logging in...';
  hideFormError("login-error");

  // Send login request to backend
  fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email, password: password }),
  })
    .then(function (res) {
      // Check if response is successful
      if (!res.ok) throw new Error("Invalid credentials");
      return res.json();
    })
    .then(function (data) {
      // Save token and user info to localStorage
      saveToken(data.token);
      saveUser({ email: email, username: email.split("@")[0] });
      // Redirect to dashboard
      window.location.href = getIndexPath();
    })
    .catch(function (err) {
      // Show error message and re-enable button
      showFormError("login-error", "Invalid credentials. Please try again.");
      btn.disabled = false;
      btn.textContent = "Log In";
    });
}

/**
 * REGISTER FUNCTION
 * Creates a new user account
 * 
 * USED BY: register.html
 * ENDPOINT: POST /api/register
 * 
 * HOW IT WORKS:
 * 1. Collects all form field values
 * 2. Validates that all required fields are filled
 * 3. Validates password length (minimum 4 characters)
 * 4. Sends POST request to backend with user data
 * 5. Backend creates new user account
 * 6. User is redirected to login page with success message
 * 
 * REQUIRED FIELDS:
 * - fullName, email, password, phoneNumber, location
 * - gender, age, date_of_birth
 * - type (customer/seller) - has default value
 * 
 * ERROR HANDLING:
 * - Shows error if any required field is empty
 * - Shows error if password is less than 4 characters
 * - Shows error if registration fails on backend
 */
function register() {
  // Collect all form values
  var fullName = document.getElementById("reg-name").value.trim();
  var email = document.getElementById("reg-email").value.trim();
  var password = document.getElementById("reg-password").value.trim();
  var phoneNumber = document.getElementById("reg-phone").value.trim();
  var location = document.getElementById("reg-location").value.trim();
  var gender = document.getElementById("reg-gender").value;
  var age = parseInt(document.getElementById("reg-age").value, 10);
  var date_of_birth = document.getElementById("reg-dob").value;
  var type = document.getElementById("reg-type").value;

  // Validate all required fields are filled
  if (
    !fullName ||
    !email ||
    !password ||
    !phoneNumber ||
    !location ||
    !gender ||
    !age ||
    !date_of_birth
  ) {
    showFormError("reg-error", "All fields are required.");
    return;
  }

  // Validate password length
  if (password.length < 4) {
    showFormError("reg-error", "Password must be at least 4 characters.");
    return;
  }

  // Disable button and show loading state
  var btn = document.getElementById("btn-register");
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Creating account...';
  hideFormError("reg-error");

  // Send registration request to backend
  fetch(USER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName,
      email,
      password,
      phoneNumber,
      location,
      gender,
      age,
      date_of_birth,
      type,
    }),
  })
    .then(function (res) {
      return res.json();
    })
    .then(function () {
      // Redirect to login page with success indicator
      window.location.href = "login.html?registered=1";
    })
    .catch(function () {
      // Show error and re-enable button
      showFormError("reg-error", "Registration failed. Please try again.");
      btn.disabled = false;
      btn.textContent = "Create Account";
    });
}

/**
 * LOGOUT FUNCTION
 * Logs out current user and redirects to login page
 * 
 * HOW IT WORKS:
 * 1. Calls clearAuth() to remove token and user data from localStorage
 * 2. Redirects to login page
 * 3. User must log in again to access protected pages
 */
function logout() {
  clearAuth();
  window.location.href = getLoginPath();
}

/*
 * UI HELPER FUNCTIONS
 * ====================
 * These functions update the user interface
 */

/**
 * UPDATE NAVBAR
 * Updates navigation bar to show user info or login button
 * 
 * USED BY: All pages with navbar
 * 
 * HOW IT WORKS:
 * 1. Gets current user from localStorage
 * 2. Finds nav-user-area element in navbar
 * 3. If user is logged in: shows email and logout button
 * 4. If not logged in: shows login button
 * 
 * CALL THIS FUNCTION:
 * - After page loads to show current auth status
 * - After login/logout to update navbar
 */
function updateNavbar() {
  var user = getUser();
  var userArea = document.getElementById("nav-user-area");
  if (!userArea) return; // Exit if navbar element doesn't exist

  if (user && getToken()) {
    // User is logged in - show email and logout button
    userArea.innerHTML =
      '<span style="color:rgba(255,255,255,0.5);font-size:0.82rem;margin-right:6px;">Hi, <strong style="color:#68d391;">' +
      user.email +
      "</strong></span>" +
      '<button class="btn btn-sm" style="background:rgba(255,255,255,0.1);color:#fff;border:none;" onclick="logout()">Log Out</button>';
  } else {
    // User is not logged in - show login button
    userArea.innerHTML =
      '<a href="' + getLoginPath() + '" class="btn btn-sm btn-blue">Log In</a>';
  }
}

/**
 * SHOW FORM ERROR
 * Displays error message in a form error element
 * @param {string} id - ID of error message element
 * @param {string} msg - Error message to display
 */
function showFormError(id, msg) {
  var el = document.getElementById(id);
  if (el) {
    el.textContent = msg;
    el.style.display = "block";
  }
}

/**
 * HIDE FORM ERROR
 * Hides error message element
 * @param {string} id - ID of error message element to hide
 */
function hideFormError(id) {
  var el = document.getElementById(id);
  if (el) {
    el.style.display = "none";
  }
}