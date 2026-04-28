/*
 * HELPER.JS - UI Utility Functions
 * ==================================
 * This file provides reusable UI functions for:
 * - Toast notifications (success/error messages)
 * - Modal dialogs (open/close)
 * - Active navigation link highlighting
 * 
 * INTEGRATION:
 * - Used by all pages that need UI feedback
 * - No dependencies on other JS files
 * - Works with CSS classes defined in style.css
 * 
 * HOW TO USE:
 * 1. Import this file: <script src="js/helper.js"></script>
 * 2. Call functions: showToast('Success!', 'success')
 * 3. Functions work automatically (no initialization needed)
 */

/**
 * SHOW TOAST NOTIFICATION
 * Displays a temporary notification message at bottom-right of screen
 * 
 * PARAMETERS:
 * @param {string} message - Text to display in toast
 * @param {string} type - 'success' or 'error' (default: 'success')
 * 
 * HOW IT WORKS:
 * 1. Creates or finds toast-wrap container
 * 2. Creates new toast element with message
 * 3. Adds success (✓) or error (✕) icon
 * 4. Displays toast for 3 seconds
 * 5. Fades out and removes toast
 * 
 * USAGE EXAMPLES:
 * showToast('User deleted successfully', 'success');
 * showToast('Failed to save changes', 'error');
 * showToast('Changes saved'); // defaults to success
 */
function showToast(message, type) {
  type = type || "success"; // Default to success if not specified

  // Find or create toast container
  var wrap = document.getElementById("toast-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.id = "toast-wrap";
    wrap.className = "toast-wrap";
    document.body.appendChild(wrap);
  }

  // Create toast element
  var toast = document.createElement("div");
  toast.className = "toast " + type;
  // Add icon based on type (✓ for success, ✕ for error)
  toast.innerHTML = (type === "success" ? "✓ " : "✕ ") + message;
  wrap.appendChild(toast);

  // Auto-remove toast after 3 seconds with fade animation
  setTimeout(function () {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s";
    setTimeout(function () {
      toast.remove();
    }, 300);
  }, 3000);
}

/*
 * MODAL FUNCTIONS
 * ===============
 * Functions to show and hide modal dialogs
 */

/**
 * OPEN MODAL
 * Shows a modal dialog by adding 'open' class
 * 
 * @param {string} id - ID of modal element to open
 * 
 * HOW IT WORKS:
 * 1. Finds modal element by ID
 * 2. Adds 'open' class which triggers CSS to display modal
 * 3. Modal appears with backdrop overlay
 * 
 * USAGE:
 * openModal('edit-modal'); // Shows modal with id="edit-modal"
 */
function openModal(id) {
  document.getElementById(id).classList.add("open");
}

/**
 * CLOSE MODAL
 * Hides a modal dialog by removing 'open' class
 * 
 * @param {string} id - ID of modal element to close
 * 
 * USAGE:
 * closeModal('edit-modal'); // Hides modal with id="edit-modal"
 */
function closeModal(id) {
  document.getElementById(id).classList.remove("open");
}

/**
 * CLOSE MODAL ON BACKDROP CLICK
 * Automatically closes modal when user clicks outside modal content
 * 
 * HOW IT WORKS:
 * 1. Listens for clicks anywhere on page
 * 2. If click target is modal-overlay (backdrop), close modal
 * 3. Clicking inside modal content does not close modal
 */
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("modal-overlay")) {
    e.target.classList.remove("open");
  }
});

// ── Active nav link ────────────
document.addEventListener("DOMContentLoaded", function () {
  var page = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".navbar-links a").forEach(function (a) {
    var href = a.getAttribute("href").split("/").pop();
    if (href === page) a.classList.add("active");
  });
});
