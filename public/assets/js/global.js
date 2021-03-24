// Tippy stuff
tippy(".tippy", {
  animation: "shift-away",
  arrow: false,
});

function duplicateDocument() {
  localStorage.setItem("duplicateDocument", window.editor.getValue());
  location.href = "/";
}

function newDocument() {
  location.href = "/";
}

function toggleCompareDocuments() {
  document.getElementById("compareDocuments").classList.add("active");
}

function cancelSettings() {
  document.getElementById("compareDocuments").classList.remove("active");
}

function copyLink() {
  const messages = document.getElementById("messages");
  navigator.clipboard
    .writeText(location.href)
    .then(
      () =>
        (messages.innerHTML += `<li class="message success"><i class="fas fa-check" style="padding-right: 9px;"></i> Copied link!</li>`)
    )
    .catch(
      (err) =>
        (messages.innerHTML += `<li class="message error"><i class="fas fa-times" style="padding-right: 9px;"></i> Failed to copy link!</li>`)
    );
}

function editDocument() {
  const actualBtn = document.querySelector(".editBtnFunc");
  const editBtn = document.getElementById("editBtn");
  const editMsg = document.querySelector(".editMsg");
  editBtn.classList.replace("fa-pencil-alt", "fa-check");
  actualBtn.setAttribute("onClick", "actuallyEditDocument()");
  window.editor.updateOptions({ readOnly: false });

  if (editMsg) editMsg.remove();
}

function actuallyEditDocument() {
  const actualBtn = document.querySelector(".editBtnFunc");
  const editBtn = document.getElementById("editBtn");
  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      document: document.getElementById("documentId").innerHTML,
      code: window.editor.getValue(),
    }),
  };
  editBtn.classList.replace("fa-check", "fa-minus");

  fetch("/api/document", options)
    .then((res) => res.json())
    .then((documentRes) => {
      if (documentRes.success) {
        actualBtn.setAttribute("onClick", "editDocument()");
        editBtn.classList.replace("fa-minus", "fa-pencil-alt");
        window.editor.updateOptions({ readOnly: true });

        if (!document.querySelector(".editMsg"))
          messages.innerHTML += `<li class="message success editMsg"><i class="fas fa-check" style="padding-right: 9px;"></i> Edited!</li>`;
      } else {
        editBtn.classList.replace("fa-minus", "fa-times");

        if (!document.querySelector(".editMsg"))
          messages.innerHTML += `<li class="message error editMsg"><i class="fas fa-times" style="padding-right: 9px;"></i> Error editing!</li>`;
      }
    })
    .catch((err) => {
      editBtn.classList.replace("fa-minus", "fa-times");

      if (!document.querySelector(".editMsg"))
        messages.innerHTML += `<li class="message error editMsg"><i class="fas fa-times" style="padding-right: 9px;"></i> Error editing!</li>`;
    });
}
