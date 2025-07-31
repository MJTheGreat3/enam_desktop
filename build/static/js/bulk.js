$(document).ready(() => {
  loadTable({
    id: "#bulkDealsTable",
    api: "/api/bulk-deals",
    dateField: "Deal Date",
    format: "dd/mm/yyyy"
  });
});
