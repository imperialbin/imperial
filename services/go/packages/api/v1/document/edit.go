package document

import (
	"api/prisma/db"
	. "api/utils"
	. "api/v1/commons"
	"context"

	"github.com/gofiber/fiber/v2"
)

func Edit(c *fiber.Ctx) error {
	req := new(EditDocument)
	client := GetPrisma()
	ctx := context.Background()

	if err := c.BodyParser(req); err != nil {
		return c.JSON(&fiber.Map{
			"success": false,
			"message": "You have a type error in your request!",
		})
	}

	errors := ValidateRequest(*req)

	if errors != nil {
		return c.Status(400).JSON(&fiber.Map{
			"success": false,
			"message": "You have a validation error in your request.",
			"errors":  errors,
		})
	}

	document, err := client.Document.FindFirst(
		db.Document.DocumentID.Equals(req.Id),
	).With(
		db.Document.DocumentSettings.Fetch(),
	).Exec(ctx)

	if err != nil {
		return c.Status(404).JSON(&fiber.Map{
			"success": false,
			"message": "We couldn't find that document!",
		})
	}

	user, err := GetUser(c)

	if err != nil {
		return c.Status(404).JSON(&fiber.Map{
			"success": false,
			"message": "There was an error trying to find your user.",
		})
	}

	/* Check if user is in editors and if not yeet them out */
	documentCreator, _ := document.Creator()

	if user.Username != documentCreator && !ArrayContains(document.DocumentSettings().Editors, user.Username) {
		return c.Status(401).JSON(&fiber.Map{
			"success": false,
			"message": "You are not authorized to edit this document!",
		})
	}

	if req.Settings.Encrypted != nil {
		return c.Status(400).JSON(&fiber.Map{
			"success": false,
			"message": "You can not set 'encrypted' after it has been made!",
		})
	}

	updatedDocument, _ := client.Document.FindUnique(
		db.Document.DocumentID.Equals(req.Id),
	).Update(
		db.Document.Content.SetIfPresent(req.Content),
	).Exec(ctx)

	updatedDocumentSettings, _ := client.DocumentSettings.FindUnique(
		db.DocumentSettings.ID.Equals(updatedDocument.DocumentSettingsID),
	).Update(
		db.DocumentSettings.Language.SetIfPresent(req.Settings.Language),
		db.DocumentSettings.ImageEmbed.SetIfPresent(req.Settings.ImageEmbed),
		db.DocumentSettings.InstantDelete.SetIfPresent(req.Settings.InstantDelete),
		db.DocumentSettings.Encrypted.SetIfPresent(req.Settings.Encrypted),
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

	return c.JSON(&fiber.Map{
		"success": true,
		"data": &CreateDocumentData{
			Id:         updatedDocument.DocumentID,
			Content:    updatedDocument.Content,
			Views:      updatedDocument.Views,
			Links:      links,
			Timestamps: timestamps,
			Settings:   settings,
		},
	})
}
