/**
 * Utility: convert a datetime string to "x minutes ago" etc.
 */
function timeAgo(dateString) {
  if (!dateString) return 'N/A';
  const now = new Date();
  const updated = new Date(dateString.replace(' ', 'T'));

  if (isNaN(updated.getTime())) return dateString;

  const diffSec = Math.floor((now - updated) / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffSec < 30) return "just now";
  if (diffSec < 60) return `${diffSec} seconds ago`;
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
  if (diffHrs < 24) return `${diffHrs} hour${diffHrs === 1 ? '' : 's'} ago`;
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return updated.toLocaleString();
}

/**
 * Load last-updated time from backend and show as relative time
 */
function loadLastUpdated() {
  fetch('/api/last-updated-data')
    .then(res => res.json())
    .then(data => {
      const raw = data.last_updated_data || '';
      $("#lastUpdated").text(timeAgo(raw));
    })
    .catch(err => console.error("[ERROR] Fetching last updated:", err));
}

/**
 * Handle clicking the refresh icon
 */
$(document).on("click", "#refreshBtn", function () {
  if (confirm("Run data refresh? This will fetch new data from sources.")) {
    fetch('/api/refresh-data-sync', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        const raw = data.last_updated || '';
        $("#lastUpdated").text(timeAgo(raw));
      })
      .catch(err => alert("Error triggering refresh: " + err));
  }
});

/**
 * Load deals table with filtering and exchange selection
 */
function loadTable({ id, api, dateField, format }) {
  fetch(api)
    .then(res => res.json())
    .then(json => {
      const data = Array.isArray(json) ? json : [];
      let currentRange = "all_time";
      let selectedExchange = "BOTH";

      const parseDate = (str) => {
        if (!str) return null;
        if (format === "dd/mm/yyyy") {
          const [d, m, y] = str.split("/");
          return new Date(`${y}-${m}-${d}`);
        }
        return new Date(str);
      };

      function filterData() {
        const now = new Date();
        let cutoff = new Date();
        if (currentRange === "1day") cutoff.setDate(now.getDate() - 2);
        else if (currentRange === "1week") cutoff.setDate(now.getDate() - 8);
        else if (currentRange === "1month") cutoff.setMonth(now.getMonth() - 1);

        return data.filter(row => {
          const date = parseDate(row[dateField]);
          const dateValid = currentRange === "all_time" || (date && date >= cutoff);
          const exchangeValid = !selectedExchange || selectedExchange === "BOTH" || row["Source"] === selectedExchange;
          return dateValid && exchangeValid;
        });
      }

      function renderTable(filtered) {
        if (!filtered.length) {
          $(id).html(`<div class="text-center text-muted">No data available</div>`);
          return;
        }

        const allKeys = Array.from(new Set(filtered.flatMap(obj => Object.keys(obj))));
        const columns = allKeys.map(key => ({
          title: key,
          data: key,
          className: "text-center"
        }));

        if ($.fn.DataTable.isDataTable(id)) {
          const table = $(id).DataTable();
          table.clear().rows.add(filtered).draw();
        } else {
          $(id).DataTable({
            data: filtered,
            columns,
            order: [[columns.findIndex(col => col.data === dateField), 'asc']],
            createdRow: function (row) {
              $(row).addClass('text-center');
            },
            headerCallback: function (thead) {
              $(thead).find('th').addClass('text-center');
            }
          });
        }
      }

      const exchangeButtons = $(`
        <div class="exchange-button-group text-center mb-2">
          <button class="exchange-btn active" data-exchange="BOTH">Both</button>
          <button class="exchange-btn" data-exchange="NSE">NSE</button>
          <button class="exchange-btn" data-exchange="BSE">BSE</button>
        </div>
      `);
      exchangeButtons.on("click", ".exchange-btn", function () {
        exchangeButtons.find("button").removeClass("active");
        $(this).addClass("active");
        selectedExchange = $(this).data("exchange");
        updateFiltered();
      });
      $(id).before(exchangeButtons);

      const dateButtons = $(`
        <div class="date-button-group text-center mb-2">
          <button class="filter-btn" data-range="1day">1 Day</button>
          <button class="filter-btn" data-range="1week">1 Week</button>
          <button class="filter-btn" data-range="1month">1 Month</button>
          <button class="filter-btn active" data-range="all_time">All Time</button>
        </div>
      `);
      dateButtons.on("click", ".filter-btn", function () {
        dateButtons.find("button").removeClass("active");
        $(this).addClass("active");
        currentRange = $(this).data("range");
        updateFiltered();
      });
      $(id).before(dateButtons);

      function updateFiltered() {
        const filtered = filterData();
        renderTable(filtered);
      }

      updateFiltered();
    })
    .catch(err => console.error("[ERROR] Loading deals table:", err));
}
function loadTable({ id, api, dateField, format }) {
  fetch(api)
    .then(res => res.json())
    .then(json => {
      const data = Array.isArray(json) ? json : [];
      let currentRange = "all_time";
      let selectedExchange = "BOTH";

      const parseDate = (str) => {
        if (!str) return null;
        if (format === "dd/mm/yyyy") {
          const [d, m, y] = str.split("/");
          return new Date(`${y}-${m}-${d}`);
        }
        return new Date(str);
      };

      function filterData() {
        const now = new Date();
        let cutoff = new Date();
        if (currentRange === "1day") cutoff.setDate(now.getDate() - 2);
        else if (currentRange === "1week") cutoff.setDate(now.getDate() - 8);
        else if (currentRange === "1month") cutoff.setMonth(now.getMonth() - 1);

        return data.filter(row => {
          const date = parseDate(row[dateField]);
          const dateValid = currentRange === "all_time" || (date && date >= cutoff);
          const exchangeValid = !selectedExchange || selectedExchange === "BOTH" || row["Source"] === selectedExchange;
          return dateValid && exchangeValid;
        });
      }

      function renderTable(filtered) {
        if (!filtered.length) {
          $(id).html(`<div class="text-center text-muted">No data available</div>`);
          return;
        }

        const allKeys = Array.from(new Set(filtered.flatMap(obj => Object.keys(obj))));
        const columns = allKeys.map(key => ({
          title: key,
          data: key,
          className: "text-center"
        }));

        if ($.fn.DataTable.isDataTable(id)) {
          const table = $(id).DataTable();
          table.clear().rows.add(filtered).draw();
        } else {
          $(id).DataTable({
            data: filtered,
            columns,
            order: [[columns.findIndex(col => col.data === dateField), 'asc']],
            createdRow: function (row) {
              $(row).addClass('text-center');
            },
            headerCallback: function (thead) {
              $(thead).find('th').addClass('text-center');
            }
          });
        }
      }

      const exchangeButtons = $(`
        <div class="exchange-button-group text-center mb-2">
          <button class="exchange-btn active" data-exchange="BOTH">Both</button>
          <button class="exchange-btn" data-exchange="NSE">NSE</button>
          <button class="exchange-btn" data-exchange="BSE">BSE</button>
        </div>
      `);
      exchangeButtons.on("click", ".exchange-btn", function () {
        exchangeButtons.find("button").removeClass("active");
        $(this).addClass("active");
        selectedExchange = $(this).data("exchange");
        updateFiltered();
      });
      $(id).before(exchangeButtons);

      const dateButtons = $(`
        <div class="date-button-group text-center mb-2">
          <button class="filter-btn" data-range="1day">1 Day</button>
          <button class="filter-btn" data-range="1week">1 Week</button>
          <button class="filter-btn" data-range="1month">1 Month</button>
          <button class="filter-btn active" data-range="all_time">All Time</button>
        </div>
      `);
      dateButtons.on("click", ".filter-btn", function () {
        dateButtons.find("button").removeClass("active");
        $(this).addClass("active");
        currentRange = $(this).data("range");
        updateFiltered();
      });
      $(id).before(dateButtons);

      function updateFiltered() {
        const filtered = filterData();
        renderTable(filtered);
      }

      updateFiltered();
    })
    .catch(err => console.error("[ERROR] Loading deals table:", err));
}

/**
 * Run loadLastUpdated once on page load
 */
$(document).ready(() => {
  loadLastUpdated();
});
