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
	client := utils.GetPrisma()
	ctx := context.Background()

	document, err := client.Document.FindFirst(
		db.Document.DocumentID.Equals(id),
	).With(
		db.Document.DocumentSettings.Fetch(),
	).Exec(ctx)

	if err != nil {
		return c.JSON(&fiber.Map{
			"success": false,
			"message": "We couldn't find that document!",
		})
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
		Password:      "Non",
		Public:        document.DocumentSettings().Public,
		Editors:       document.DocumentSettings().Editors,
	}

	return c.JSON(&fiber.Map{
		"success": true,
		"data": &CreateDocumentData{
			document.DocumentID,
			document.Content,
			document.Views,
			links,
			timestamps,
			settings,
		},
	})
}
