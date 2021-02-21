const highlight = (editor) => {
  // This is a bug in HighlightJS
  // eslint-disable-next-line no-self-assign
  editor.textContent = editor.textContent;
  hljs.highlightBlock(editor);
};
const editor = document.querySelector("#codeThing");
const codeBox = CodeJar(editor, highlight);

window.addEventListener("popstate", () => {
  if (location.pathname === "/" || location.pathname === "/p/") {
    $("#submitCode").text("");
    $("#lines").text(">");
    $("#codeThing").focus();
  } else {
    location.reload();
  }
});

$(document).ready(() => {
  $("#codeThing").focus();
  const duplicate = localStorage.getItem("duplicatePaste");
  if (duplicate) {
    codeBox.updateCode(duplicate);
    localStorage.removeItem("duplicatePaste");
  } else {
    navigator.clipboard
      .readText()
      .then((copiedText) => {
        if (localStorage.getItem("clipboard") === "true") {
          codeBox.updateCode(copiedText);
        }
      })
      .catch(() => {
        console.log("denied paste capabilities");
      });
  }
});
$(window).on("keydown", (e) => {
  switch (true) {
    case e.key === "s" && e.ctrlKey:
      e.preventDefault();
      uploadCode();
      break;
    case e.key === "o" && e.ctrlKey:
      e.preventDefault();
      newDocument();
      break;
    case e.key === "t" && e.altKey:
      if (location.pathname === "/") {
        window.open(
          `https://twitter.com/intent/tweet?text=I%20use%20Imperialbin!%20An%20advanced%20and%20feature%20rich%20pastebin,%20start%20using%20it%20today%20at%20https://www.imperialb.in/!`,
          "_blank"
        );
      } else {
        window.open(
          `https://twitter.com/intent/tweet?text=Here%20is%20a%20document%20I%20made%20on%20Imperialbin%20https://www.imperialb.in${location.pathname}`,
          "_blank"
        );
      }
      break;
  }
});

function toggleAddUser() {
  $("#addUser").addClass("active");
  const getUsers = localStorage.getItem("addUser");
  if (getUsers === "undefined") {
    localStorage.removeItem("addUser");
  }
  if (getUsers !== null && getUsers !== "") {
    for (var users = 0; users < getUsers.split(",").length; users++) {
      const user = getUsers.split(",")[users];
      $(".users").append(
        `<div class="user" id="${user}"> <input id="token" type="text" value="${user}" readonly> <button class="deleteUser" onclick="removeUser('${user}')"><i class="fas fa-trash"></i></button> </div>`
      );
    }
  }
  document.getElementById("user").focus();
}

function removeUser(user) {
  const getUsers = localStorage.getItem("addUser");
  $(`#${user}`).remove();
  localStorage.setItem("addUser", getUsers.replace(user, ""));
  if (getUsers == "" || getUsers === undefined) {
    localStorage.removeItem("addUsers");
  }
}

function addUser(user) {
  const users = localStorage.getItem("addUser");
  if (!$.trim(user) == "") {
    // checks if input has an actual user or just spaces, those sneaky bastards.
    const regex = /^[,"]+|[,"]+$/g;
    const formattedUser = user.replace(regex, "");
    if (users !== null && !users == "") {
      const newUsers = `${users},${formattedUser}`;
      $(".users").append(
        `<div class="user" id="${formattedUser}"> <input id="token" type="text" value="${formattedUser}" readonly> <button class="deleteUser" onclick="removeUser('${formattedUser}')"><i class="fas fa-trash"></i></button> </div>`
      );
      localStorage.setItem("addUser", newUsers);
      document.getElementById("user").value = "";
      document.getElementById("user").focus();
    } else {
      localStorage.setItem("addUser", formattedUser);
      $(".users").append(
        `<div class="user" id="${formattedUser}"> <input id="token" type="text" value="${formattedUser}" readonly> <button class="deleteUser" onclick="removeUser('${formattedUser}')"><i class="fas fa-trash"></i></button> </div>`
      );
      document.getElementById("user").value = "";
      document.getElementById("user").focus();
    }
  }
}

function setPaste() {
  const clipboardCheck = $("#clipCheck2").is(":checked");
  localStorage.setItem("securedUrls", false);
  localStorage.setItem("clipboard", clipboardCheck);
  localStorage.setItem("deleteTime", "7");
  localStorage.setItem("instantDelete", "false");
  localStorage.setItem("imageEmbeds", "true");
  localStorage.setItem("customURL", "p");
  localStorage.setItem("encrypted", "false");
  localStorage.setItem("password", "none");
  $(".pasteSettings").removeClass("active");
}

const getUsers = localStorage.getItem("addUser");
if (getUsers !== null && !getUsers == "") {
  if (getUsers[0] == ",") {
    const regex = /^[,]+|[,]+$/g;
    localStorage.setItem("addUser", getUsers.replace(regex, ""));
  }
}

function newDocument() {
  location.href = "/";
}

async function uploadCode() {
  const code = codeBox.toString();
  const securedUrls = localStorage.getItem("securedUrls");
  const time = localStorage.getItem("deleteTime");
  const instantDelete = localStorage.getItem("instantDelete");
  const allowedEditor = localStorage.getItem("addUser");
  const imageEmbeds = localStorage.getItem("imageEmbeds");
  const encrypted = localStorage.getItem("encrypted");
  var options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
      time,
      securedUrls,
      instantDelete,
      allowedEditor,
      imageEmbeds,
      encrypted,
    }),
  };
  fetch("/saveCode", options)
    .then((res) => res.json())
    .then((json) => {
      if (json.status === "success") {
        if (instantDelete === "true" || json.password) {
          editor.style.display = "none";
          const lines = codeBox.toString().split("\n");
          document.getElementById("lines").textContent = "";

          const $lines = $("#lines");
          for (let i = 1; i <= lines.length; i++) {
            $lines.append(`${i.toString()} <br>`);
          }

          document.getElementById("submitCode").textContent = code;
          codeBox.updateCode("");
          if (localStorage.getItem("customURL") !== "p") {
            window.history.pushState({}, null, `${localStorage.getItem("customURL")}/${json.link.substring(3)}`);
          } else {
            window.history.pushState({}, null, json.link);
          }
          const link = json.link.substring(3);
          document.title = `Document ${link}`;
          if (json.password) {
            window.history.pushState({}, null, `${json.link}?password=${json.password}`);
            copyLink(json.password);
            $("#messages").append(
              '<li class="message success"><i class="fas fa-check" style="padding-right: 4px;"></i> Copied link and password!</li>'
            );
          } else {
            copyLink();
            $("#messages").append(
              '<li class="message success"><i class="fas fa-check" style="padding-right: 4px;"></i> Copied link!</li>'
            );
          }
          document.querySelectorAll("pre code").forEach((block) => {
            hljs.highlightBlock(block);
          });
          localStorage.removeItem("addUser");
        } else {
          if ($.trim(codeBox.toString())) {
            localStorage.removeItem("addUser");
            location.href = localStorage.getItem("customURL") + "/" + json.link.substring(3) + "?copyLink=true";
          } else {
            $("#codeThing").focus();
          }
        }
      }
    });
}

function copyLink(password) {
  const linkBox = document.createElement("textarea");
  linkBox.value = password ? `${location.href}?password=${password}` : location.href;
  document.body.appendChild(linkBox);
  linkBox.select();
  document.execCommand("copy");
  document.body.removeChild(linkBox);
}
