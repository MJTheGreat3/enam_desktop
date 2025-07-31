$(document).ready(function () {
  let portfolio = [];
  let allSymbols = [];

  async function fetchPortfolio() {
    try {
      const res = await fetch("/api/portfolio");
      portfolio = await res.json();
      console.log("[DEBUG] Portfolio loaded:", portfolio);
      renderPortfolio();
    } catch (err) {
      console.error("[ERROR] Failed to fetch portfolio:", err);
    }
  }

  async function fetchSymbols() {
    try {
      const res = await fetch("/api/symbols");
      allSymbols = await res.json();

      // Normalize symbol keys
      allSymbols = allSymbols.map(item => ({
        Symbol: (item.Symbol || item.symbol || "").trim(),
        Name: (item.Name || item.name || "").trim()
      }));

      console.log("[DEBUG] Symbols loaded:", allSymbols.length);
    } catch (err) {
      console.error("[ERROR] Failed to fetch symbols:", err);
    }
  }

  async function addSymbol(symbol, name) {
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, name }),
      });
      if (res.ok) {
        await fetchPortfolio();
      } else {
        const error = await res.json();
        alert("Add failed: " + (error.error || "Unknown error"));
      }
    } catch (err) {
      console.error("[ERROR] Add symbol failed:", err);
    }
  }

  async function removeSymbol(symbol) {
    try {
      const res = await fetch("/api/portfolio", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol }),
      });
      if (res.ok) {
        await fetchPortfolio();
      } else {
        const error = await res.json();
        alert("Remove failed: " + (error.error || "Unknown error"));
      }
    } catch (err) {
      console.error("[ERROR] Remove symbol failed:", err);
    }
  }

  function renderPortfolio() {
    const list = $("#companyList").empty();
    if (!portfolio.length) {
      list.append('<div class="text-muted text-center">No companies added yet</div>');
    }

    portfolio.forEach((item) => {
      const symbol = item.symbol || item.Symbol;
      const name = item.name || item.Name;
      list.append(`
        <div class="portfolio-badge">
          <span class="symbol">${symbol}</span>
          <span class="name">${name}</span>
          <button class="portfolio-remove" data-symbol="${symbol}">
            <img src="/static/assets/img/close.svg" alt="Remove" class="close-icon">
          </button>
        </div>
      `);
    });

    $(".portfolio-remove").on("click", function () {
      const sym = $(this).data("symbol");
      removeSymbol(sym);
    });
  }

  function sortResults(results, query) {
    const q = query.toLowerCase();

    function rank(item) {
      const symbol = item.Symbol.toLowerCase();
      const name = item.Name.toLowerCase();
      if (symbol.startsWith(q)) return 1;
      if (name.startsWith(q)) return 2;
      if (symbol.includes(q)) return 3;
      if (name.includes(q)) return 4;
      return 5;
    }

    return results.sort((a, b) => rank(a) - rank(b));
  }

  let searchTimeout;
  $("#companySearch").on("input", function () {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const val = $(this).val().toLowerCase();
      const results = $("#searchResults").empty().toggle(val.length >= 2);
      if (val.length < 2) return;

      let matches = allSymbols.filter(r =>
        r.Symbol && (r.Symbol.toLowerCase().includes(val) || r.Name.toLowerCase().includes(val))
      );

      matches = sortResults(matches, val);

      if (!matches.length) {
        results.append(`<div class="list-group-item text-muted">No matches found</div>`);
      }

      matches.forEach((c) => {
        results.append(`
          <a href="#" class="list-group-item company-option">
            <b>${c.Symbol}</b><br>
            <small>${c.Name}</small>
          </a>
        `);
      });
    }, 200);
  });

  $("#searchResults").on("click", ".company-option", function (e) {
    e.preventDefault();
    const symbol = $(this).find("b").text();
    const name = $(this).find("small").text();
    addSymbol(symbol, name);
    $("#companySearch").val("");
    $("#searchResults").hide();
  });

  $(document).on("click", (e) => {
    if (!$(e.target).closest("#companySearch, #searchResults").length) {
      $("#searchResults").hide();
    }
  });

  $("#applyChangesBtn").on("click", async function () {
    $(this).prop("disabled", true).text("Applying...");
    try {
      const res = await fetch("/api/portfolio/apply", { method: "POST" });
      if (res.ok) {
        alert("Changes applied successfully!");
        await fetchPortfolio();
      } else {
        const error = await res.json();
        alert("Error applying changes: " + (error.error || "Unknown error"));
      }
    } catch (err) {
      console.error("[ERROR] Apply Changes:", err);
      alert("Error applying changes!");
    } finally {
      $(this).prop("disabled", false).text("Apply Changes");
    }
  });

  // Initial load
  fetchSymbols().then(fetchPortfolio);
});
