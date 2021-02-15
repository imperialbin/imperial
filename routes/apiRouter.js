const routes = require("express").Router();
const Datastore = require("nedb");
const fs = require("fs");
const Users = require("../models/Users");

const db = {
  link: new Datastore({ filename: "./databases/links" }),
};

// Possibly in the future make a config
// to easily edit mass used strings like this?
const internalError = (res) => {
  throwApiError(res, "Sorry! There was a internal server error, please contact a administrator!");
};

// Utilites
const throwApiError = require("../utilities/throwApiError");
const screenshotDocument = require("../utilities/screenshotDocument");
const generateString = require("../utilities/generateString");

routes.get("/", (req, res) => res.json({ message: "Welcome to Imperial Bin's API!" }));

routes.post(["/document", "/postCode", "/paste"], (req, res) => {
  db.link.loadDatabase();
  const code = req.body.code;
  // Anon function to quickly make a guest paste.
  const guestPaste = () => {
    createPaste(Math.random().toString(36).substring(2), false, false, 5, "NONE");
  };

  if (!req.headers.authorization) return guestPaste();
  const apiToken = req.headers.authorization || req.body.apiToken;
  Users.findOne({ apiToken }, (err, user) => {
    if (err) return internalError(res);
    if (!user) return guestPaste();

    const creator = user._id.toString();
    // All settings related to the document,
    // should be a nice interface if we were using TS :)
    const documentSettings = {
      longerUrls: req.body.longerUrls || false,
      imageEmbed: req.body.imageEmbed || false,
      expiration: req.body.expiration || 5,
      instantDelete: req.body.instantDelete || false,
      quality: !user.memberPlus ? 73 : 100,
    };
    // Short URLs are 8 characters long.
    let str = generateString(8);
    // Long URLs are 15 characters long. edit: WRONG they're like 26 characters now lololololol
    if (documentSettings.longerUrls) str = generateString(26);
    // The max duration is 31 days.
    if (documentSettings.expiration > 31) documentSettings.expiration = 31;

    return createPaste(
      str,
      documentSettings.imageEmbed,
      documentSettings.instantDelete,
      documentSettings.expiration,
      creator,
      documentSettings.quality
    );
  });

  function createPaste(str, imageEmbed, instantDelete, expiration, creator, quality) {
    if (!code) return throwApiError(res, "You need to post code! No code was submitted.");
    try {
      db.link.insert(
        {
          URL: str,
          imageEmbed,
          instantDelete,
          creator,
          code,
          dateCreated: new Date().getTime(),
          deleteDate: new Date().setDate(new Date().getDate() + Number(expiration)),
          allowedEditor: [],
        },
        async (err, doc) => {
          if (err) return internalError(res);
          // Make sure this is not a guest paste.
          if (creator !== "NONE") await Users.updateOne({ _id: creator }, { $inc: { documentsMade: 1 } });

          if (quality && !instantDelete && imageEmbed) screenshotDocument(str, quality);
          return res.json({
            success: true,
            documentId: str,
            rawLink: `https://www.imperialb.in/r/${str}`,
            formattedLink: `https://www.imperialb.in/p/${str}`,
            expiresIn: new Date(doc.deleteDate),
            instantDelete: instantDelete,
          });
        }
      );
    } catch {
      return internalError(res);
    }
  }
});

routes.patch(["/document", "/editCode", "/paste"], (req, res) => {
  const apiToken = req.headers.authorization;
  if (!apiToken) return throwApiError(res, "An invalid API token was provided.");

  const document = req.body.document;
  const code = req.body.newCode || req.body.code;

  Users.findOne({ apiToken }, (err, user) => {
    if (err) return internalError(res);
    if (!user) return throwApiError(res, "Please put in an API token!");
    const userId = user._id.toString();

    db.link.loadDatabase();
    db.link.findOne({ URL: document }, (err, documentInfo) => {
      if (err) return throwApiError("Sorry! We couldn't find that document.");
      if (!documentInfo) return throwApiError("Sorry! We couldn't find that document.");

      const editors = documentInfo.allowedEditor;
      // Make sure user is actually allowed to edit the document.
      if (documentInfo.creator !== userId || editors.indexOf(userId) == -1)
        return throwApiError("Sorry! You aren't allowed to edit this document.");

      db.link.update({ URL: document }, { $set: { code } }, (err) => {
        if (err) return throwApiError("Sorry! You aren't allowed to edit this document.");

        return res.json({
          success: true,
          message: "Successfully edited the document!",
          documentId: document,
          rawLink: `https://www.imperialb.in/r/${document}`,
          formattedLink: `https://www.imperialb.in/p/${document}`,
          expiresIn: new Date(documentInfo.deleteDate),
          instantDelete: documentInfo.instantDelete,
        });
      });
    });
  });
});

routes.delete("/purgeDocuments", async (req, res) => {
  // If coming from outside
  var index = { apiToken: req.headers.authorization };
  // If coming from inside Imperial
  if (req.isAuthenticated()) {
    const authedUser = await Users.findOne({ _id: req.user.toString() });
    index = { _id: authedUser._id };
  }

  if (!index) return throwApiError(res, "Please put in an API token!");
  Users.findOne(index, (err, user) => {
    if (err) return internalError(res);
    if (!user) return throwApiError(res, "Please put in a valid API token!");
    const creator = user._id.toString();

    db.link.loadDatabase();
    db.findOne({ creator }, (err, documents) => {
      if (err) return internalError(res);
      if (documents.length == 0) return throwApiError(res, "There was no documents to delete!");
      // Go through every document to delete it.
      for (const document of documents) {
        const documentID = document._id;
        db.link.remove({ documentID });

        if (document.imageEmbed && fs.existsSync(`./public/assets/img/${document.URL}.jpg`))
          fs.unlinkSync(`./public/assets/img/${document.URL}.jpg`);
      }
      // (Tech) - I don't see a point in doing this again when
      // it's already loaded once above? Something i'm missing like
      // do the new values not update until you load this again?
      db.link.loadDatabase();
      // If the user is logged in redirect to the account page.
      if (Object.keys(index).indexOf("_id") > -1) return res.redirect("account");
      return res.json({
        success: true,
        message: `Deleted a total of ${documents.length} documents!`,
        numberDeleted: documents.length,
      });
    });
  });
});

//                                             (Tech) - I hate cods.
routes.delete(["/document/:slug", "/deleteCode/:slug", "/deleteCod/:slug", "/paste/:slug"], async (req, res) => {
  var index = { apiToken: req.headers.authorization };
  if (req.isAuthenticated()) {
    const authedUser = await Users.findOne({ _id: req.user.toString() });
    index = { _id: authedUser._id };
  }

  if (!index) return throwApiError(res, "Please put in an API token!");
  const document = req.params.slug;

  Users.findOne(index, (err, user) => {
    if (err) return internalError(res);
    if (!user) return throwApiError(res, "Please put in a valid API token!");
    const userId = user._id.toString();

    db.link.loadDatabase();
    db.link.findOne({ URL: document }, (err, documentInfo) => {
      if (!documentInfo) return throwApiError("Sorry! That document doesn't exist.");
      if (documentInfo.creator !== userId) return throwApiError("Sorry! You aren't allowed to modify this document.");
      // Delete specific document.
      db.link.remove({ _id: documentInfo._id }, (err) => {
        if (err) return internalError(res);
        if (documentInfo.imageEmbed && fs.existsSync(`./public/assets/img/${documentInfo.URL}.jpg`))
          fs.unlinkSync(`./public/assets/img/${documentInfo.URL}.jpg`);
      });

      if (Object.keys(index).indexOf("_id") > -1) return res.redirect("/account");
      return res.json({
        success: true,
        message: "Successfully delete the document!",
      });
    });
  });
});

routes.get(["/document/:slug", "/getCode/:slug", "/paste/:slug"], (req, res) => {
  const document = req.params.slug;
  db.link.loadDatabase();
  db.link.findOne({ URL: document }, (err, documentInfo) => {
    if (err) return internalError(res);
    if (!documentInfo) return throwApiError(res, "Sorry! There was no document with that ID.");

    const rawData = documentInfo.code;
    return res.json({
      success: true,
      document: rawData,
    });
  });
});

routes.get("/checkApiToken/:apiToken", (req, res) => {
  const apiToken = req.headers.authorization || req.params.apiToken;
  if (!apiToken) return throwApiError(res, "Please put in an API token!");

  Users.findOne({ apiToken }, (err, actuallyExists) => {
    if (err) return internalError(res);
    return res.json({
      success: actuallyExists ? true : false,
      message: actuallyExists ? "API token is valid!" : "API token is invalid!",
    });
  });
});

routes.get("/getShareXConfig/:apiToken", (req, res) => {
  const apiToken = req.headers.authorization || req.params.apiToken;
  res.attachment("imperialbin.sxcu").send({
    Version: "13.4.0",
    DestinationType: "TextUploader",
    RequestMethod: "POST",
    RequestURL: "https://imperialb.in/api/postCode/",
    Headers: {
      Authorization: apiToken,
    },
    Body: "JSON",
    Data: '{\n  "code": "$input$",\n  "longerUrls": false,\n  "imageEmbed": true,\n  "instantDelete": false\n}',
    URL: "$json:formattedLink$",
  });
});

module.exports = routes;
