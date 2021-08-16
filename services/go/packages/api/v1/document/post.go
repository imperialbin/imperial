package document

import (
	"api/prisma/db"
	"api/utils"
	. "api/utils"
	. "api/v1/commons"
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
)

func Post(c *fiber.Ctx) error {
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

	content := documentRequest.Content
	language := documentRequest.Settings.Language.String
	imageEmbed := documentRequest.Settings.ImageEmbed.Bool
	instantDelete := documentRequest.Settings.InstantDelete.Bool
	encrypted := documentRequest.Settings.Encrypted.Bool
	public := documentRequest.Settings.Public.Bool
	editors := documentRequest.Settings.Editors
	password := documentRequest.Settings.Password.String

	/* Check if longer/shorter URLs are enabled */
	var randomString, err = GenerateRandomString(8)

	longURLs := documentRequest.Settings.LongURLs.Bool
	shortURLs := documentRequest.Settings.ShortURLs.Bool

	if longURLs {
		randomString, err = GenerateRandomString(32)
	} else if shortURLs {
		randomString, err = GenerateRandomString(4)
	}

	/* If the user wants encryption */
	var encryptedIv string
	if encrypted {
		if len(password) < 1 {
			randomString, err := GenerateRandomString(8)

			if err != nil {
				c.Status(500).JSON(&fiber.Map{
					"success": false,
					"message": "An error occurred whilst generating a password for your encrypted document!",
				})
			}

			password = randomString
		}

		content, encryptedIv = Encrypt(content, password)
	}

	if err != nil {
		return c.Status(500).JSON(&fiber.Map{
			"success": false,
			"message": "An error occurred whilst creating random string.",
		})
	}

	createdDocumentSettings, err := client.DocumentSettings.CreateOne(
		db.DocumentSettings.Language.Set(language),
		db.DocumentSettings.ImageEmbed.Set(imageEmbed),
		db.DocumentSettings.InstantDelete.Set(instantDelete),
		db.DocumentSettings.Encrypted.Set(encrypted),
		db.DocumentSettings.Public.Set(public),
		db.DocumentSettings.Editors.Set(editors),
	).Exec(ctx)

	createdDocument, err := client.Document.CreateOne(
		db.Document.DocumentID.Set(randomString),
		db.Document.Content.Set(content),
		db.Document.ExpirationDate.Set(time.Now().UTC().AddDate(0, 0, int(documentRequest.Settings.Expiration.Int64))),
		db.Document.DocumentSettings.Link(
			db.DocumentSettings.ID.Equals(createdDocumentSettings.ID),
		),
		db.Document.EncryptedIv.SetIfPresent(&encryptedIv),
	).Exec(ctx)

	if err != nil {
		println(err)
		return c.Status(500).JSON(&fiber.Map{
			"success": false,
			"message": "An internal server error occurred whilst creating that document!",
		},
		)
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
		Password:      password,
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
