package post

import (
	"api/prisma/db"
	"api/utils"
	. "api/v1/commons"
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
)

func CreateDocument(c *fiber.Ctx) error {
	client := utils.GetPrisma()
	ctx := context.Background()

	/* Document stuff */
	documentRequest := new(DocumentStruct)

	if err := c.BodyParser(documentRequest); err != nil {
		return c.JSON(&fiber.Map{
			"success": false,
			"message": "You have a type error in your request!",
		})
	}

	language := documentRequest.Settings.Language.String
	imageEmbed := documentRequest.Settings.ImageEmbed.Bool
	instantDelete := documentRequest.Settings.InstantDelete.Bool
	encrypted := documentRequest.Settings.Encrypted.Bool
	public := documentRequest.Settings.Public.Bool
	editors := documentRequest.Settings.Editors

	createdDocumentSettings, err := client.DocumentSettings.CreateOne(
		db.DocumentSettings.Language.Set(language),
		db.DocumentSettings.ImageEmbed.Set(imageEmbed),
		db.DocumentSettings.InstantDelete.Set(instantDelete),
		db.DocumentSettings.Encrypted.Set(encrypted),
		db.DocumentSettings.Public.Set(public),
		db.DocumentSettings.Editors.Set(editors),
	).Exec(ctx)

	createdDocument, err := client.Document.CreateOne(
		db.Document.DocumentID.Set("what"),
		db.Document.Content.Set(documentRequest.Content),
		db.Document.ExpirationDate.Set(time.Now().UTC().AddDate(0, 0, int(documentRequest.Settings.Expiration.Int64))),
		db.Document.DocumentSettings.Link(
			db.DocumentSettings.ID.Equals(createdDocumentSettings.ID),
		),
		db.Document.Views.Set(0),
	).Exec(ctx)

	if err != nil {
		println(err)
	}

	timestamps := Timestamps{
		Creation:   createdDocument.CreationDate.Unix(),
		Expiration: createdDocument.ExpirationDate.Unix(),
	}

	links := Links{
		Raw:       "https://imperialb.in/r/" + createdDocument.DocumentID,
		Formatted: "https://imperialb.in/p/" + createdDocument.DocumentID,
	}

	settings := CreatedDocumentSettingsStruct{
		Language:      createdDocumentSettings.Language,
		ImageEmbed:    createdDocumentSettings.ImageEmbed,
		InstantDelete: createdDocumentSettings.InstantDelete,
		Encrypted:     createdDocumentSettings.Encrypted,
		Password:      "Non",
		Public:        createdDocumentSettings.Public,
		Editors:       createdDocumentSettings.Editors,
	}

	return c.JSON(&fiber.Map{
		"success": true,
		"data": &CreateDocumentData{
			createdDocument.DocumentID,
			createdDocument.Content,
			createdDocument.Views,
			links,
			timestamps,
			settings,
		},
	})

}
