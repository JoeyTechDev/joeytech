/* ============================================================
   Contact page: dropdowns, validation, and submission
   Requires config.js (CONFIG, WA_BASE).
   ============================================================ */
(function () {
  const form = document.getElementById("leadForm");
  if (!form) return;
  const statusBox = document.getElementById("formStatus");

  function fillSelect(id, items) {
    const el = document.getElementById(id);
    items.forEach(function (t, i) {
      const o = document.createElement("option");
      o.value = i === 0 ? "" : t;
      o.textContent = t;
      el.appendChild(o);
    });
  }
  fillSelect("industry", CONFIG.industries);
  fillSelect("need", CONFIG.needs);
  fillSelect("budget", CONFIG.budgets);
  fillSelect("timeline", CONFIG.timelines);

  // Preselect the service when a visitor arrives from a package CTA.
  const requestedService = new URLSearchParams(window.location.search).get("service");
  const serviceMap = {
    "starter-website": "New business website",
    "growth-website": "New business website",
    "automation": "AI / business automation",
    "website-redesign": "Website redesign",
    "free-website-review": "Free website review",
    "seo-growth": "SEO & website growth"
  };
  if (requestedService && serviceMap[requestedService]) {
    document.getElementById("need").value = serviceMap[requestedService];
    const details = document.getElementById("details");
    if (details && !details.value) details.value = "I'm interested in the " + requestedService.replaceAll("-", " ") + " package. Please contact me to discuss the scope.";
  }

  function setErr(id, show) {
    const f = document.getElementById(id);
    const e = document.getElementById(id + "-err");
    f.setAttribute("aria-invalid", show);
    e.classList.toggle("show", show);
    return !show;
  }
  function showStatus(msg, ok) {
    statusBox.textContent = msg;
    statusBox.className = "form-status show " + (ok ? "ok" : "bad");
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form).entries());
    if (d.company) return; // honeypot caught a bot

    let valid = true;
    valid = setErr("name", !d.name.trim()) && valid;
    valid = setErr("email", !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) && valid;
    valid = setErr("need", !d.need) && valid;
    valid = setErr("details", !d.details.trim()) && valid;
    if (!valid) {
      showStatus("Please fix the highlighted fields and try again.", false);
      form.querySelector('[aria-invalid="true"]').focus();
      return;
    }

    const btn = document.getElementById("submitBtn");
    btn.disabled = true;
    btn.textContent = "Sending…";
    try {
      if (CONFIG.webhookUrl) {
        const res = await fetch(CONFIG.webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Object.assign({}, d, { source: "website", submittedAt: new Date().toISOString() }))
        });
        if (!res.ok) throw new Error("Request failed");
        showStatus("Thank you. We've received your details and will reply soon.", true);
        form.reset();
      } else if (CONFIG.web3formsKey) {
        const payload = Object.assign({}, d, {
          access_key: CONFIG.web3formsKey,
          subject: "New website enquiry from " + d.name,
          from_name: "Joey Technology Website"
        });
        delete payload["form-name"];
        delete payload.company;
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(payload)
        });
        const out = await res.json();
        if (!res.ok || !out.success) throw new Error("Request failed");
        showStatus("Thank you. We've received your details and will reply soon.", true);
        form.reset();
      } else if (CONFIG.useNetlifyForms) {
        const res = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(new FormData(form)).toString()
        });
        if (!res.ok) throw new Error("Request failed");
        showStatus("Thank you. We've received your details and will reply soon.", true);
        form.reset();
      } else {
        // No backend configured: open WhatsApp with the details pre-filled.
        const msg = [
          "New project enquiry",
          "Name: " + d.name,
          "Business: " + (d.business || "-"),
          "Email: " + d.email,
          "Phone: " + (d.phone || "-"),
          "Website: " + (d.website || "-"),
          "Industry: " + (d.industry || "-"),
          "Need: " + d.need,
          "Budget: " + (d.budget || "-"),
          "Timeline: " + (d.timeline || "-"),
          "Details: " + d.details
        ].join("\n");
        window.open(WA_BASE + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
        showStatus("WhatsApp is opening with your details. Press send there to reach us.", true);
      }
    } catch (err) {
      showStatus("Something went wrong sending your details. Please try again, or email " + CONFIG.email + ".", false);
    } finally {
      btn.disabled = false;
      btn.textContent = "Send Project Details";
    }
  });
})();
