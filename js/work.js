/* ============================================================
   Work page: project filter
   ============================================================ */
(function () {
  const chips = document.querySelectorAll(".chip");
  const cards = document.querySelectorAll(".work-card");

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      const filter = chip.dataset.filter;
      chips.forEach(function (c) { c.setAttribute("aria-pressed", c === chip); });
      cards.forEach(function (card) {
        const cats = card.dataset.cat.split(" ");
        card.classList.toggle("hidden", filter !== "all" && cats.indexOf(filter) === -1);
      });
    });
  });
})();
