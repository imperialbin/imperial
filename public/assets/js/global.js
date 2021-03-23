// Tippy stuff
tippy(".tippy", {
  animation: "shift-away",
  arrow: false,
});

function duplicate() {
  localStorage.setItem("duplicatePaste", $("#codeThing").val());
  location.href = "/";
}

function toggleCompareDocuments() {
  $("#compareDocuments").addClass("active");
}
