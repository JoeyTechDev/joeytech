/* ============================================================
   Joey Technology: shared behaviour (runs on every page)
   Requires config.js to be loaded first.
   ============================================================ */
(function () {
  // Highlight the current page in the main navigation
  const page = document.body.dataset.page;
  document.querySelectorAll("[data-nav]").forEach(function (a) {
    if (a.dataset.nav === page) a.setAttribute("aria-current", "page");
  });

  // Mobile menu
  const menuBtn = document.getElementById("menuBtn");
  const panel = document.getElementById("mobilePanel");
  function closeMenu() {
    panel.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open menu");
  }
  if (menuBtn && panel) {
    menuBtn.addEventListener("click", function () {
      const open = panel.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open);
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  // WhatsApp and email links
  const waMsg = "?text=" + encodeURIComponent("Hello Joey Technology, I'd like to discuss a project.");
  ["waLink", "footWa", "waFloat"].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.href = WA_BASE + waMsg;
  });
  ["emailLink", "footEmail"].forEach(function (id) {
    const a = document.getElementById(id);
    if (a) { a.href = "mailto:" + CONFIG.email; a.textContent = CONFIG.email; }
  });

  // Footer year
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Social links (only those with a URL in config.js)
  const socialList = document.getElementById("socialList");
  if (socialList) {
    Object.entries(CONFIG.socials).forEach(function (entry) {
      if (!entry[1]) return;
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = entry[1]; a.textContent = entry[0];
      a.target = "_blank"; a.rel = "noopener me";
      li.appendChild(a); socialList.appendChild(li);
    });
  }
})();
