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
  const editorArray = JSON.parse(localStorage.getItem("editorArray"));

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
  const existingEditors = JSON.parse(localStorage.getItem("editorArray"));
  if (existingEditors && existingEditors.includes(userToAdd)) {
    console.log("user already added");
  } else {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userToAdd.toLowerCase(),
      }),
    };
    fetch("/api/checkUser", options)
      .then((parsePlease) => parsePlease.json())
      .then((user) => {
        if (user.success) {
          const input = document.getElementById("user");
          const list = document.getElementById("editorArray");
          const listItem = document.createElement("li");

          input.value = "";
          listItem.className = "editor-user";
          listItem.id = user.username;
          listItem.innerHTML = `
            <img src="${user.userPfp}" class="editor-pfp" draggable="false">
            <span class="actualEditor">
              ${user.username}
            </span>
            <button class="editor-remove" onclick="removeUser('${user.username}')">
              <i class="fas fa-trash error"></i>
            </button>
          `;
          list.appendChild(listItem);
          if (existingEditors) {
            const existingEditorArray = JSON.parse(
              localStorage.getItem("editorArray")
            );
            existingEditorArray.push(user.username);
            localStorage.setItem(
              "editorArray",
              JSON.stringify(existingEditorArray)
            );
          } else {
            const firstUserArray = [user.username];
            localStorage.setItem("editorArray", JSON.stringify(firstUserArray));
          }
        } else {
          console.error(res);
        }
      });
  }
}
function removeUser(userToRemove) {
  const editorArray = JSON.parse(localStorage.getItem("editorArray"));
  document.getElementById(userToRemove).remove();
  editorArray.splice(editorArray.indexOf(userToRemove));
  localStorage.setItem("editorArray", editorArray);
}
