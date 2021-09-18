package document

import (
	"api/prisma/db"
	. "api/utils"
	. "api/v1/commons"
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
)

func Edit(c *fiber.Ctx) error {
	req := new(EditDocument)
	client := GetPrisma()
	ctx := context.Background()

	if err := c.BodyParser(req); err != nil {
		return c.JSON(Response{
			Success: false,
			Message: "You have a type error in your request!",
		})
	}

	errors := ValidateRequest(*req)

	if errors != nil {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "You have a validation error in your request.",
			Errors:  errors,
		})
	}

	document, err := client.Document.FindFirst(
		db.Document.DocumentID.Equals(req.ID),
	).With(
		db.Document.Settings.Fetch(),
	).Exec(ctx)

	if err != nil {
		return c.Status(404).JSON(Response{
			Success: false,
			Message: "We couldn't find that document!",
		})
	}

	user, err := GetUser(c)

	if err != nil {
		return c.Status(404).JSON(Response{
			Success: false,
			Message: "There was an error trying to find your user.",
		})
	}

	/* Check if user is in editors and if not yeet them out */
	documentCreator, _ := document.Creator()

	if user.Username != documentCreator && !ArrayContains(document.Settings().Editors, user.Username) {
		return c.Status(401).JSON(Response{
			Success: false,
			Message: "You are not authorized to edit this document!",
		})
	}

	if document.Settings().Encrypted {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "You can not edit an encrypted document yet!",
		})
	}

	if req.Settings.Encrypted != nil {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "You can not set 'encrypted' after it has been made!",
		})
	}

	var expiration time.Time
	if req.Settings.Expiration != nil {
		expiration = time.Now().UTC().AddDate(0, 0, int(*req.Settings.Expiration))
	}

	updatedDocument, _ := client.Document.FindUnique(
		db.Document.DocumentID.Equals(req.ID),
	).Update(
		db.Document.Content.SetIfPresent(req.Content),
		db.Document.ExpirationDate.SetIfPresent(&expiration),
	).Exec(ctx)

	updatedDocumentSettings, _ := client.DocumentSettings.FindUnique(
		db.DocumentSettings.ID.Equals(updatedDocument.DocumentSettingsID),
	).Update(
		db.DocumentSettings.Language.SetIfPresent(req.Settings.Language),
		db.DocumentSettings.ImageEmbed.SetIfPresent(req.Settings.ImageEmbed),
		db.DocumentSettings.InstantDelete.SetIfPresent(req.Settings.InstantDelete),
		db.DocumentSettings.Public.SetIfPresent(req.Settings.Public),
		db.DocumentSettings.Editors.SetIfPresent(req.Settings.Editors),
	).Exec(ctx)

	/* Setup Response */
	timestamps := Timestamps{
		Creation:   updatedDocument.CreationDate.Unix(),
		Expiration: updatedDocument.ExpirationDate.Unix(),
	}

	links := Links{
		Raw:       c.BaseURL() + "/r/" + updatedDocument.DocumentID,
		Formatted: c.BaseURL() + "/p/" + updatedDocument.DocumentID,
	}

	settings := CreatedDocumentSettingsStruct{
		Language:      updatedDocumentSettings.Language,
		ImageEmbed:    updatedDocumentSettings.ImageEmbed,
		InstantDelete: updatedDocumentSettings.InstantDelete,
		Encrypted:     updatedDocumentSettings.Encrypted,
		Public:        updatedDocumentSettings.Public,
		Editors:       updatedDocumentSettings.Editors,
	}

	gist, _ := document.Gist()

	print(gist)

	if len(gist) > 0 {
		if len(*req.Content) > 0 {
			_, err := EditGist(user, gist, *req.Content)

			if err != nil {
				println(err)
			}
		}
	}

	return c.JSON(Response{
		Success: true,
		Data: &CreateDocumentData{
			ID:         updatedDocument.DocumentID,
			Content:    updatedDocument.Content,
			Views:      updatedDocument.Views,
			Links:      links,
			Timestamps: timestamps,
			Settings:   settings,
		},
	})
}
