package document

import (
	"api/prisma/db"
	"api/utils"
	. "api/v1/commons"
	"context"

	"github.com/gofiber/fiber/v2"
)

func Get(c *fiber.Ctx) error {
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
	var content string
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
		Raw:       "https://imperialb.in/r/" + document.DocumentID,
		Formatted: "https://imperialb.in/p/" + document.DocumentID,
	}

	settings := CreatedDocumentSettingsStruct{
		Language:      document.DocumentSettings().Language,
		ImageEmbed:    document.DocumentSettings().ImageEmbed,
		InstantDelete: document.DocumentSettings().InstantDelete,
		Encrypted:     document.DocumentSettings().Encrypted,
		Public:        document.DocumentSettings().Public,
		Editors:       document.DocumentSettings().Editors,
	}

	return c.JSON(&fiber.Map{
		"success": true,
		"data": &CreateDocumentData{
			content,
			document.Content,
			document.Views,
			links,
			timestamps,
			settings,
		},
	})
}
