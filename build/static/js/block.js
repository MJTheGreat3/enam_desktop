$(document).ready(() => {
  loadTable({
    id: "#blockDealsTable",
    api: "/api/block-deals",
    dateField: "Deal Date",
    format: "dd/mm/yyyy"
  });
});
