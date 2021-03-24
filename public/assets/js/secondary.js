window.addEventListener("popstate", () => {
  if (location.pathname == "/" || location.pathname == "/p/") {
    location.reload();
  }
});
$(window).on("keydown", (e) => {
  switch (true) {
    case e.key === "s" && e.ctrlKey:
      e.preventDefault();
      if (document.querySelector(".editButtonActive") !== null) {
        postEditPaste();
        emitEditPost();
      }
      break;
    case e.key === "o" && e.ctrlKey:
      e.preventDefault();
      newDocument();
      break;
  }
});
