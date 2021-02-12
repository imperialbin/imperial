import { CodeJar } from "./codeJar.js";

const editor = document.querySelector("#codeThing");
const codeBox = CodeJar(editor, hljs.highlightBlock(editor));

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
    $("#codeThing").val(duplicate);
    localStorage.removeItem("duplicatePaste");
  } else {
    navigator.clipboard
      .readText()
      .then((copiedText) => {
        if (localStorage.getItem("clipboard") === "true") {
          $("#codeThing").val(copiedText);
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
    }),
  };
  fetch("/saveCode", options)
    .then((res) => res.json())
    .then((json) => {
      if (json.status === "success") {
        if (instantDelete === "true") {
          $("#codeThing").attr("readonly", true);
          const lines = codeBox.toString().split("\n");
          document.getElementById("lines").textContent = "";

          const $lines = $("#lines");
          for (let i = 1; i <= lines.length; i++) {
            $lines.append(`${i.toString()} <br>`);
          }

          document.getElementById("submitCode").textContent = code;
          codeBox.updateCode("");
          if (localStorage.getItem("customURL") !== "p") {
            window.history.pushState(
              {},
              null,
              `${localStorage.getItem("customURL")}/${json.link.substring(3)}`
            );
          } else {
            window.history.pushState({}, null, json.link);
          }
          const link = json.link.substring(3);
          document.title = `Document ${link}`;
          copyLink();
          $("#messages").append(
            '<li class="message success"><i class="fas fa-check" style="padding-right: 4px;"></i> Copied link!</li>'
          );
          document.querySelectorAll("pre code").forEach((block) => {
            hljs.highlightBlock(block);
          });
          localStorage.removeItem("addUser");
        } else {
          if ($.trim(codeBox.toString())) {
            localStorage.removeItem("addUser");
            location.href =
              localStorage.getItem("customURL") +
              "/" +
              json.link.substring(3) +
              "?copyLink=true";
          } else {
            $("#codeThing").focus();
          }
        }
      }
    });
}

function copyLink() {
  const linkBox = document.createElement("textarea");
  linkBox.value = location.href;
  document.body.appendChild(linkBox);
  linkBox.select();
  document.execCommand("copy");
  document.body.removeChild(linkBox);
}
