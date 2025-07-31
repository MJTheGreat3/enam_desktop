$(document).ready(function () {
  loadTable({
    id: "#insiderTable",
    controlsId: "#insiderControls",
    apiUrl: "/api/insider_deals",
    dateField: "Broadcast Date/Time",
    format: "dd-mmm-yyyy",
    nowrapColumns: ["Stock", "Amount", "Value", "Attachment", "Time"]
  });
});
