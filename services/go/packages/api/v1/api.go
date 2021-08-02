package v1

import (
	"api/prisma/db"
	"api/utils"
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
)

type DocumentSettingsStruct struct {
	Language      *string   `json:"language"`
	Expiration    *int      `json:"expiration"`
	ShortURLs     *bool     `json:"shortUrls"`
	LongURLs      *bool     `json:"longUrls"`
	ImageEmbed    *bool     `json:"imageEmbed"`
	InstantDelete *bool     `json:"instantDelete"`
	Encrypted     *bool     `json:"encrypted"`
	Password      *string   `json:"password"`
	Public        *bool     `json:"public"`
	Editors       *[]string `json:"editors"`
}

type DocumentInfoStruct struct {
	content          string
	creationDate     time.Time
	expirationDate   time.Time
	documentSettings DocumentSettingsStruct
}

type DocumentStruct struct {
	Content          string                 `json:"content"`
	DocumentSettings DocumentSettingsStruct `json:"documentSettings"`
}

func Introduction(c *fiber.Ctx) error {
	return c.JSON(&fiber.Map{
		"success":       true,
		"message":       "Welcome to IMPERIAL's API!",
		"version":       1,
		"documentation": "https://docs.imperialb.in/",
	})
}

func GetDocument(c *fiber.Ctx) error {
	client := utils.GetPrisma()
	ctx := context.Background()

	/* Document stuff */

	document, err := client.Document.FindFirst(
		db.Document.DocumentID.Equals("what"),
	).Exec(ctx)

	if err != nil {
		return c.JSON(&fiber.Map{
			"success": false,
			"message": "We couldn't find that document!",
		})
	}

	return c.SendString(document.Content)
}

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

	createdDocumentSettings, err := client.DocumentSettings.CreateOne(
		db.DocumentSettings.ImageEmbed.Set(false),
		db.DocumentSettings.InstantDelete.Set(false),
		db.DocumentSettings.Encrypted.Set(false),
		db.DocumentSettings.Public.Set(false),
		db.DocumentSettings.Language.Set("typescript"),
		db.DocumentSettings.Editors.Set([]string{""}),
	).Exec(ctx)

	createdDocument, err := client.Document.CreateOne(
		db.Document.DocumentID.Set("what"),
		db.Document.Content.Set("deez nuts"),
		db.Document.ExpirationDate.Set(time.Now().UTC().AddDate(0, 0, 5)),
		db.Document.DocumentSettings.Link(
			db.DocumentSettings.ID.Equals(createdDocumentSettings.ID),
		),
		db.Document.Views.Set(0),
	).Exec(ctx)

	if err != nil {
		println(err)
	}

	return c.JSON(&fiber.Map{
		"success": true,
		"data": {
			"id":      createdDocument.DocumentID,
			"content": createdDocument.Content,
			"timestamps": {
				"creation":   createdDocument.CreationDate,
				"expiration": createdDocument.ExpirationDate,
			},
			"settings": {
				"language":      createdDocumentSettings.Language,
				"imageEmbed":    createdDocumentSettings.ImageEmbed,
				"instantDelete": createdDocumentSettings.InstantDelete,
				"encrypted":     createdDocumentSettings.Encrypted,
				"public":        createdDocumentSettings.Public,
				"editors":       createdDocumentSettings.Editors,
			},
		},
	})
}

func EditDocument(c *fiber.Ctx) error {
	return c.SendString("Editing deez nuts")
}

func DeleteDocument(c *fiber.Ctx) error {
	return c.SendString("Deleting deez nuts")
}
