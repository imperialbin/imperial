// Tippy stuff
tippy(".tippy", {
  animation: "shift-away",
  arrow: false,
});

function duplicateDocument() {
  localStorage.setItem("duplicateDocument", window.editor.getValue());
  location.href = "/";
}

function toggleCompareDocuments() {
  $("#compareDocuments").addClass("active");
}
