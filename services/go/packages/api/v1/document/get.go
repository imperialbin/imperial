package document

import (
	"api/prisma/db"
	"api/utils"
	. "api/v1/commons"
	"context"

	"github.com/gofiber/fiber/v2"
)

func Get(c *fiber.Ctx) error {
	/* Todo: Make editors an array of objects with username and Icon */

	var id = c.Params("id")
	var password = c.Query("password")
	client := utils.GetPrisma()
	ctx := context.Background()

	document, err := client.Document.FindFirst(
		db.Document.DocumentID.Equals(id),
	).With(
		db.Document.DocumentSettings.Fetch(),
	).Exec(ctx)

	if err != nil {
		return c.Status(404).JSON(&fiber.Map{
			"success": false,
			"message": "We couldn't find that document!",
		})
	}

	/* When the psychopath decides that he would like to decrypt his document */
	var content = document.Content
	if document.DocumentSettings().Encrypted {
		if len(password) < 1 {
			return c.Status(400).JSON(&fiber.Map{
				"success": false,
				"message": "password query (?password=documentPassword), was not provided!",
			})
		}
		encryptedIv, _ := document.EncryptedIv()
		content, err = utils.Decrypt(password, document.Content, encryptedIv)

		if err != nil {
			return c.Status(401).JSON(&fiber.Map{
				"success": false,
				"message": "You've provided the wrong password for this encrypted document!",
			})
		}
	}

	timestamps := Timestamps{
		Creation:   document.CreationDate.Unix(),
		Expiration: document.ExpirationDate.Unix(),
	}

	links := Links{
		Raw:       c.BaseURL() + "/r/" + document.DocumentID,
		Formatted: c.BaseURL() + "/p/" + document.DocumentID,
	}

	settings := CreatedDocumentSettingsStruct{
		Language:      document.DocumentSettings().Language,
		ImageEmbed:    document.DocumentSettings().ImageEmbed,
		InstantDelete: document.DocumentSettings().InstantDelete,
		Encrypted:     document.DocumentSettings().Encrypted,
		Public:        document.DocumentSettings().Public,
		Editors:       document.DocumentSettings().Editors,
	}

	if document.DocumentSettings().InstantDelete {
		deletedDocument, _ := client.Document.FindUnique(
			db.Document.DocumentID.Equals(id),
		).Delete().Exec(ctx)

		client.DocumentSettings.FindUnique(
			db.DocumentSettings.ID.Equals(deletedDocument.DocumentSettingsID),
		).Delete().Exec(ctx)
	}

	/* Increase view count by one */
	client.Document.FindUnique(
		db.Document.DocumentID.Equals(id),
	).Update(
		db.Document.Views.Increment(1),
	).Exec(ctx)

	return c.JSON(&fiber.Map{
		"success": true,
		"data": &CreateDocumentData{
			Id:         document.DocumentID,
			Content:    content,
			Views:      document.Views + 1, /* We're + 1ing here because we incremented the value before we got the document */
			Links:      links,
			Timestamps: timestamps,
			Settings:   settings,
		},
	})
}
