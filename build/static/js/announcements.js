$(document).ready(function () {
  loadTable({
    id: "#announcementTable",
    controlsId: "#announcementControls",
    apiUrl: "/api/announcements",
    dateField: "Broadcast Date/Time",
    format: "dd-mmm-yyyy",
    nowrapColumns: ["Stock", "Attachment", "Time"]
  });
});
