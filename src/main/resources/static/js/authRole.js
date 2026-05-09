// =========================
// ROLE авах
// =========================
function getRole() {
  return localStorage.getItem("userRole") || "CUSTOMER";
}

// =========================
// REMOVE function (hide биш)
// =========================
function removeAdminElements() {
  // Add Restaurant button
  document.querySelectorAll(".btn-add-main").forEach(el => {
    el.remove();
  });

  // Add Category button
  document.querySelectorAll(".admin-add-item").forEach(el => {
    el.remove();
  });
}

// =========================
// APPLY
// =========================
function applyRoleUI() {
  const role = getRole();

  if (role !== "ADMIN") {
    removeAdminElements();
  }
}

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {
  applyRoleUI();

  // 🔴 DOM өөрчлөгдөх бүрт дахин шалгана
  const observer = new MutationObserver(() => {
    applyRoleUI();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});