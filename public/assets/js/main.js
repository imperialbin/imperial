window.addEventListener("keydown", (event) => {
  switch (true) {
    case event.key === "s" && event.ctrlKey:
      event.preventDefault();
      createDocument();
      break;
    case event.key === "o" && event.ctrlKey:
      event.preventDefault();
      newDocument();
      break;
    case event.key === "t" && event.altKey:
      if (location.pathname === "/") {
        window.open(
          `https://twitter.com/intent/tweet?text=IMPERIAL%20is%20a%20hastebin/pastebin%20alternative%20with%20user%20experience%20and%20UI%20design%20in%20mind.%20Try%20it%20out%20now%20at%20https://imperialb.in!`,
          "_blank"
        );
      }
  }
});

function toggleAddUser() {
  document.getElementById("addUser").classList.add("active");
}

function closeAddUser() {
  document.getElementById("addUser").classList.remove("active");
}

function clearUsers() {
  document.getElementById("addUser").classList.remove("active");
  localStorage.removeItem("editorArray");
}

function addUser(userToAdd) {
  console.log(userToAdd);
}
function removeUser(userToRemove) {
  console.log(userToRemove);
}
