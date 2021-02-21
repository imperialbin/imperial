const routes = require("express").Router();
const fs = require("fs");
const Users = require("../models/Users");
const Datastore = require("nedb");

// Utilities
const decrypt = require("../utilities/decrypt");

const db = {
  link: new Datastore({ filename: "./databases/links" }),
};

routes.get("/", (req, res) => {
  res.redirect(`/p/${req.originalUrl.split("/")[1]}/${req.originalUrl.split("/")[2]}`);
});

routes.get(
  ["/:documentId", "/:slug/:documentId", "/:slug/:slugTwo/:documentId", "/:slug/:slugTwo/slugThree/:documentId"],
  (req, res) => {
    const documentId = req.params.documentId;
    db.link.loadDatabase();
    try {
      db.link.findOne({ URL: documentId }, (err, document) => {
        if (err)
          return res.render("error.ejs", {
            error: "An error occurred whilst getting that document!",
          });
        if (!document)
          return res.render("error.ejs", {
            error: "We couldn't find that document!",
          });
        // Check if the document is encrypted
        if (document.encrypted) {
          return res.render("enterPassword.ejs", { error: false, documentId });
        }

        let deleteDate;

        if (document.instantDelete) {
          if (!req.isCrawler()) {
            setTimeout(() => {
              db.link.remove({ URL: document.URL });
            }, 1000);
          }
          deleteDate = "Deletes after being viewed.";
        } else {
          const documentDate = new Date(document.deleteDate);
          const date = {
            year: documentDate.getFullYear(),
            month: documentDate.getMonth() + 1,
            day: documentDate.getDate(),
          };
          deleteDate = `Deletes on ${date.day}/${date.month}/${date.year}.`;
        }

        let enableImageEmbed = !!(document.imageEmbed && fs.existsSync(`./public/assets/img/${document.URL}.jpg`));

        if (req.isAuthenticated()) {
          const userId = req.user.toString();
          Users.findOne({ _id: userId }, (err, user) => {
            // If there's some sort of error just return the Guest paste.
            if (err)
              return res.render("pasted.ejs", {
                documentName: documentId,
                imageEmbed: enableImageEmbed,
                code: document.code,
                loggedIn: false,
                deleteDate: deleteDate,
                creator: false,
              });

            const editorArray = document.allowedEditor;

            const isCreator = userId === document.creator || editorArray.includes(userId);

            return res.render("pasted.ejs", {
              documentName: documentId,
              imageEmbed: enableImageEmbed,
              code: document.code,
              loggedIn: true,
              pfp: user.icon,
              deleteDate: deleteDate,
              creator: isCreator,
              originalCreator: document.creator,
              incomingUser: userId,
            });
          });
        } else
          return res.render("pasted.ejs", {
            documentName: documentId,
            imageEmbed: enableImageEmbed,
            code: document.code,
            loggedIn: false,
            deleteDate: deleteDate,
            creator: false,
          });
      });
    } catch (_) {
      return res.render("error.ejs", {
        error: "An error occurred whilst getting that document!",
      });
    }
  }
);

routes.post("/getDocumentAccess/:documentId", (req, res) => {
  const password = req.body.password;
  const documentId = req.params.documentId;
  let code;
  db.link.loadDatabase();
  db.link.findOne({ URL: documentId }, (err, document) => {
    if (!document)
      return res.render("error.ejs", {
        error: "We couldn't find that document!",
      });
    try {
      code = decrypt(password, document.code, document.encryptedIv);
      let deleteDate;

      if (document.instantDelete) {
        if (!req.isCrawler()) {
          setTimeout(() => {
            db.link.remove({ URL: document.URL });
          }, 1000);
        }
        deleteDate = "Deletes after being viewed.";
      } else {
        const documentDate = new Date(document.deleteDate);
        const date = {
          year: documentDate.getFullYear(),
          month: documentDate.getMonth() + 1,
          day: documentDate.getDate(),
        };
        deleteDate = `Deletes on ${date.day}/${date.month}/${date.year}.`;
      }

      let enableImageEmbed = !!(document.imageEmbed && fs.existsSync(`./public/assets/img/${document.URL}.jpg`));

      if (req.isAuthenticated()) {
        const userId = req.user.toString();
        Users.findOne({ _id: userId }, (err, user) => {
          // If there's some sort of error just return the Guest paste.
          if (err)
            return res.render("pasted.ejs", {
              documentName: documentId,
              imageEmbed: enableImageEmbed,
              code: code,
              loggedIn: false,
              deleteDate: deleteDate,
              creator: false,
            });

          const editorArray = document.allowedEditor;

          const isCreator = userId === document.creator || editorArray.includes(userId);

          return res.render("pasted.ejs", {
            documentName: documentId,
            imageEmbed: enableImageEmbed,
            code: code,
            loggedIn: true,
            pfp: user.icon,
            deleteDate: deleteDate,
            creator: isCreator,
            originalCreator: document.creator,
            incomingUser: userId,
            encrypted: true
          });
        });
      } else
        return res.render("pasted.ejs", {
          documentName: documentId,
          imageEmbed: enableImageEmbed,
          code: code,
          loggedIn: false,
          deleteDate: deleteDate,
          creator: false,
        });
    } catch {
      return res.render("enterPassword.ejs", { error: "Incorrect password", documentId });
    }
  });
});

module.exports = routes;
