/*
 * API.JS - API Communication Module
 * ==================================
 * This file handles all communication with the backend API server.
 * 
 * INTEGRATION:
 * - Used by dashboard.html to fetch user data
 * - Requires authentication token from localStorage (set by auth.js)
 * - All API calls include Bearer token in Authorization header
 * 
 * BASE URL:
 * - API_URL points to backend server at http://localhost:8000/api
 * - Change this URL if backend is hosted elsewhere
 * 
 * HOW TO USE:
 * 1. Import this file in your HTML: <script src="js/api.js"></script>
 * 2. Call api methods: api.getAllusers().then(data => { ... })
 * 3. All methods return Promises that resolve with JSON data
 */

// Base URL for all API endpoints
const API_URL ='http://localhost:8000/api';

// API object containing all API methods
const api = {
  /**
   * GET ALL USERS
   * =============
   * Fetches all registered users from the backend.
   * 
   * ENDPOINT: GET /api/getAllUsers
   * AUTHENTICATION: Required (Bearer token)
   * 
   * RETURNS: Promise that resolves to:
   * - Array of user objects, OR
   * - Object with 'users' or 'data' property containing array
   * 
   * USAGE:
   * api.getAllusers()
   *   .then(data => {
   *     console.log('Users:', data);
   *   })
   *   .catch(error => {
   *     console.error('Failed to fetch users');
   *   });
   * 
   * HOW IT WORKS:
   * 1. Gets JWT token from localStorage (saved during login)
   * 2. Sends GET request to /api/getAllUsers with Authorization header
   * 3. Backend validates token and returns user list
   * 4. Response is parsed as JSON and returned
   */
  getAllusers: async function () {
    return fetch(`${API_URL}/getAllUsers`, {
      method: "GET",
      headers: {
        // Include JWT token for authentication
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(function (res) {
      // Parse and return JSON response
      return res.json();
    });
  },

  /**
   * REMOVE USER (DELETE)
   * ====================
   * Deletes a user by their ID.
   * 
   * ENDPOINT: DELETE /api/deleteUser/:id
   * AUTHENTICATION: Required (Bearer token)
   * 
   * PARAMETERS:
   * @param {string} id - The user ID to delete
   * 
   * RETURNS: Promise that resolves when user is deleted
   * 
   * USAGE:
   * api.removeUser('user123')
   *   .then(() => {
   *     console.log('User deleted successfully');
   *   })
   *   .catch(error => {
   *     console.error('Failed to delete user');
   *   });
   * 
   * NOTE: This function is referenced in dashboard.html but needs to be implemented
   */
   removeUser: async function(id) {
     return fetch(`${API_URL}/deleteUser/${id}`, {
       method: "DELETE",
      headers: {
         Authorization: `Bearer ${localStorage.getItem("token")}`,
       },
     }).then(function (res) {
       return res.json();
     });
   },

  /**
   * CREATE SHOP
   * ============
   * Creates a new shop in the backend.
   * 
   * ENDPOINT: POST /api/shop/createShop
   * AUTHENTICATION: Required (Bearer token)
   * 
   * RETURNS: Promise that resolves to:
   * - Object with success message and shop data
   * 
   * USAGE:
   * api.createShop({ name: "My Shop", location: "My Location" })
   *   .then(data => {
   *     console.log('Shop created:', data);
   *   })
   *   .catch(error => {
   *     console.error('Failed to create shop');
   *   });
   * 
   * HOW IT WORKS:
   * 1. Gets JWT token from localStorage (saved during login)
   * 2. Sends POST request to /api/shop/createShop with Authorization header
   * 3. Backend validates token and creates shop
   * 4. Response includes shop ID and confirmation message
   */
  createShop: async function(shopData) {
    return fetch(`${API_URL}/shop/createShop`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Include JWT token for authentication
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(shopData),
    }).then(function (res) {
      return res.json();
    });
  },

  /**
   * GET ALL SHOPS
   * ==============
   * Fetches all shops from the backend.
   * 
   * ENDPOINT: GET /api/shop/getAllShop
   * AUTHENTICATION: Required (Bearer token)
   * 
   * RETURNS: Promise that resolves to:
   * - Array of shop objects, OR
   * - Object with 'shops' or 'data' property containing array
   * 
   * USAGE:
   * api.getAllShops()
   *   .then(data => {
   *     console.log('Shops:', data);
   *   })
   *   .catch(error => {
   *     console.error('Failed to fetch shops');
   *   });
   */
  getAllShops: async function() {
    return fetch(`${API_URL}/shop/getAllShop`, {
      method: "GET",
      headers: {
        // Include JWT token for authentication
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(function (res) {
      return res.json();
    });
  },

  /**
   * GET SINGLE SHOP
   * =================
   * Fetches a specific shop by ID.
   * 
   * ENDPOINT: GET /api/shop/getSingleShop/:id
   * AUTHENTICATION: Required (Bearer token)
   * 
   * PARAMETERS:
   * @param {string} id - The shop ID to fetch
   * 
   * RETURNS: Promise that resolves to:
   * - Single shop object
   * 
   * USAGE:
   * api.getSingleShop('shop123')
   *   .then(data => {
   *     console.log('Shop:', data);
   *   })
   *   .catch(error => {
   *     console.error('Failed to fetch shop');
   *   });
   */
  getSingleShop: async function(id) {
    return fetch(`${API_URL}/shop/getSingleShop/${id}`, {
      method: "GET",
      headers: {
        // Include JWT token for authentication
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(function (res) {
      return res.json();
    });
  },

  /**
   * UPDATE SHOP
   * ============
   * Updates an existing shop.
   * 
   * ENDPOINT: PUT /api/shop/updateShop/:id
   * AUTHENTICATION: Required (Bearer token)
   * 
   * PARAMETERS:
   * @param {string} id - The shop ID to update
   * @param {object} shopData - Updated shop information
   * 
   * RETURNS: Promise that resolves to:
   * - Object with success message and updated shop data
   * 
   * USAGE:
   * api.updateShop('shop123', { name: "Updated Shop", location: "New Location" })
   *   .then(data => {
   *     console.log('Shop updated:', data);
   *   })
   *   .catch(error => {
   *     console.error('Failed to update shop');
   *   });
   */
  updateShop: async function(id, shopData) {
    return fetch(`${API_URL}/shop/updateShop/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // Include JWT token for authentication
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(shopData),
    }).then(function (res) {
      return res.json();
    });
  },

  /**
   * DELETE SHOP
   * =============
   * Deletes a shop by ID.
   * 
   * ENDPOINT: DELETE /api/shop/deleteShop/:id
   * AUTHENTICATION: Required (Bearer token)
   * 
   * PARAMETERS:
   * @param {string} id - The shop ID to delete
   * 
   * RETURNS: Promise that resolves to:
   * - Object with success message
   * 
   * USAGE:
   * api.deleteShop('shop123')
   *   .then(() => {
   *     console.log('Shop deleted successfully');
   *   })
   *   .catch(error => {
   *     console.error('Failed to delete shop');
   *   });
   */
  deleteShop: async function(id) {
    return fetch(`${API_URL}/shop/deleteShop/${id}`, {
      method: "DELETE",
      headers: {
        // Include JWT token for authentication
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(function (res) {
      return res.json();
    });
  }
};