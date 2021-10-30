package document

import (
	"api/prisma/db"
	. "api/utils"
	. "api/v1/commons"
	"context"

	"github.com/gofiber/fiber/v2"
)

func Get(c *fiber.Ctx) error {
	/* Todo: Make editors an array of objects with username and Icon */

	var id = c.Params("id")
	var password = c.Query("password")
	client := GetPrisma()
	ctx := context.Background()

	document, err := client.Document.FindFirst(
		db.Document.ID.Equals(id),
	).With(
		db.Document.Settings.Fetch(),
	).Exec(ctx)

	if err != nil {
		return c.Status(404).JSON(Response{
			Success: false,
			Message: "We couldn't find that document!",
		})
	}
	/* When the psychopath decides that he would like to decrypt his document */
	var content = document.Content

	if document.Settings().Encrypted {
		if len(password) < 1 {
			return c.Status(400).JSON(Response{
				Success: false,
				Message: "password query (?password=documentPassword), was not provided!",
			})
		}

		encryptedIv, _ := document.EncryptedIv()
		content, err = Decrypt(password, document.Content, encryptedIv)

		if err != nil {
			return c.Status(401).JSON(Response{
				Success: false,
				Message: "You've provided the wrong password for this encrypted document!",
			})
		}
	}

	timestamps := Timestamps{
		Creation:   document.CreationDate.Unix(),
		Expiration: document.ExpirationDate.Unix(),
	}

	links := Links{
		Raw:       c.BaseURL() + "/r/" + document.ID,
		Formatted: c.BaseURL() + "/" + document.ID,
	}

	settings := CreatedDocumentSettingsStruct{
		Language:      document.Settings().Language,
		ImageEmbed:    document.Settings().ImageEmbed,
		InstantDelete: document.Settings().InstantDelete,
		Encrypted:     document.Settings().Encrypted,
		Public:        document.Settings().Public,
		Editors:       document.Settings().Editors,
	}

	if document.Settings().InstantDelete {
		deletedDocument, _ := client.Document.FindUnique(
			db.Document.ID.Equals(id),
		).Delete().Exec(ctx)

		client.DocumentSettings.FindUnique(
			db.DocumentSettings.ID.Equals(deletedDocument.DocumentSettingsID),
		).Delete().Exec(ctx)
	}

	/* Increase view count by one */
	client.Document.FindUnique(
		db.Document.ID.Equals(id),
	).Update(
		db.Document.Views.Increment(1),
	).Exec(ctx)

	var Creator, _ = document.Creator()

	return c.JSON(Response{
		Success: true,
		Data: &CreateDocumentData{
			ID:         document.ID,
			Content:    content,
			Creator:    Creator,
			Views:      document.Views + 1, /* We're + 1ing here because we incremented the value before we got the document */
			Links:      links,
			Timestamps: timestamps,
			Settings:   settings,
		},
	})
}
