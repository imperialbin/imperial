// Tippy stuff
tippy(".tippy", {
  animation: "shift-away",
  arrow: false,
});

const duplicateDocument = () => {
  localStorage.setItem("duplicateDocument", window.editor.getValue());
  location.href = "/";
};

const newDocument = () => (location.href = "/");

const toggleCompareDocuments = () =>
  document.getElementById("compareDocuments").classList.add("active");

const cancelSettings = () =>
  document.getElementById("compareDocuments").classList.remove("active");

const deleteDocument = (documentId) => {
  fetch(`/api/document/${documentId}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((actualRes) => {
      if (actualRes.success) {
        location.reload();
      } else {
        console.log(actualRes);
      }
    });
};

const copyLink = () => {
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
};

const editDocument = () => {
  const actualBtn = document.querySelector(".editBtnFunc");
  const editBtn = document.getElementById("editBtn");
  const editMsg = document.querySelector(".editMsg");

  editBtn.classList.replace("fa-pencil-alt", "fa-check");
  actualBtn.setAttribute("onClick", "actuallyEditDocument()");
  editor.setReadOnly(false);

  if (editMsg) editMsg.remove();
};

const actuallyEditDocument = () => {
  if (editor.getValue() === "" || !editor.getValue().trim()) return;
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
        editor.setReadOnly(true);

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
};
