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

    case event.key === "a" && event.altKey:
      closeEverythingPlease();
      toggleAddUser();
      break;

    case event.key === "c" && event.altKey:
      closeEverythingPlease();
      openLanguageSelector();
      break;

    case event.key === "t" && event.altKey:
      if (location.pathname === "/") {
        window.open(
          `https://twitter.com/intent/tweet?text=IMPERIAL%20is%20a%20hastebin/pastebin%20alternative%20with%20user%20experience%20and%20UI%20design%20in%20mind.%20Try%20it%20out%20now%20at%20https://imperialb.in!`,
          "_blank"
        );
      }
      break;
    case event.key === "Escape":
      closeEverythingPlease();
  }
});

const closeEverythingPlease = () => {
  const elements = document.querySelectorAll(".pasteSettings");
  [].forEach.call(elements, function (el) {
    el.classList.remove("active");
  });
};

const openLanguageSelector = () => {
  const languageList = hljs.listLanguages();
  const languageListElement = document.getElementById("languageList");
  languageListElement.innerHTML = `<li class="languageItem" id="auto" onclick="changeLanguage('auto')"> <button class="languageBtn">Auto detect</button> </li>`;
  languageList.forEach((language) => {
    const languageItem = document.createElement("li");
    languageItem.className = "languageItem";
    languageItem.id = language;
    languageItem.setAttribute("onclick", `changeLanguage('${language}')`);
    languageItem.innerHTML = `
      <button class="languageBtn">${language}</button>
    `;
    languageListElement.append(languageItem);
  });
  document.getElementById("setLanguage").classList.add("active");
  document.querySelector(".searchBar").select();
};

const searchResults = async (string) => {
  const languageList = hljs.listLanguages();
  const languageListElement = document.getElementById("languageList");

  languageListElement.innerHTML = "";
  await languageList.forEach((language) => {
    if (language.startsWith(string)) {
      const languageItem = document.createElement("li");
      languageItem.className = "languageItem";
      languageItem.id = language;
      languageItem.setAttribute("onclick", `changeLanguage('${language}')`);

      languageItem.innerHTML = `
      <button class="languageBtn">${language}</button>
    `;
      languageListElement.append(languageItem);
    }
  });
};

const closeLanguageSelector = () => {
  const languageListElement = document.getElementById("languageList");
  languageListElement.innerHTML = "";
  document.getElementById("setLanguage").classList.remove("active");
};

const changeLanguage = (language) => {
  const languageBtn = document.querySelector(".changeLanguageBtn");
  if (language !== "auto") {
    languageBtn.textContent = language;
    window.editor.session.setMode(`ace/mode/${language}`);
  } else {
    languageBtn.innerHTML = '<i class="fas fa-minus"></i>';
  }

  localStorage.setItem("language", language);
  closeLanguageSelector();
};

const toggleAddUser = () => {
  const listCount = document
    .getElementById("editorArray")
    .getElementsByTagName("li").length;
  const editorArray = JSON.parse(localStorage.getItem("editorArray"));
  if (editorArray && listCount === 0) {
    editorArray.forEach((user) => {
      const list = document.getElementById("editorArray");
      const listItem = document.createElement("li");
      listItem.className = "editor-user";
      listItem.id = user.username;
      listItem.innerHTML = `
            <img src="${user.pfp}" class="editor-pfp" draggable="false">
            <span class="actualEditor">
              ${user.username}
            </span>
            <button class="editor-remove" onclick="removeUser('${user.username}')">
              <i class="fas fa-trash error"></i>
            </button>
          `;
      list.append(listItem);
    });
  }
  document.getElementById("addUser").classList.add("active");
};

const closeAddUser = () => {
  document.getElementById("addUser").classList.remove("active");
};

const clearUsers = () => {
  document.getElementById("addUser").classList.remove("active");
  document.getElementById("editorArray").innerHTML = "";
  localStorage.removeItem("editorArray");
};

const addUser = (userToAdd) => {
  const errorSpan = document.getElementById("editor-error");
  const existingEditors = JSON.parse(localStorage.getItem("editorArray"));
  if (
    existingEditors &&
    existingEditors.filter((stupid) => stupid.username === userToAdd).length > 0
  ) {
    errorSpan.innerHTML = "User is already added!";
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

          errorSpan.innerHTML = "";
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
            existingEditorArray.push({
              username: user.username,
              pfp: user.userPfp,
            });
            localStorage.setItem(
              "editorArray",
              JSON.stringify(existingEditorArray)
            );
          } else {
            const firstUserArray = [
              {
                username: user.username,
                pfp: user.userPfp,
              },
            ];
            localStorage.setItem("editorArray", JSON.stringify(firstUserArray));
          }
        } else {
          errorSpan.innerHTML = "User does not exist!";
        }
      });
  }
};

const removeUser = (userToRemove) => {
  const editorArray = JSON.parse(localStorage.getItem("editorArray"));
  const newArray = editorArray.filter((cum) => cum.username !== userToRemove);
  document.getElementById(userToRemove).remove();
  localStorage.setItem("editorArray", JSON.stringify(newArray));
};
