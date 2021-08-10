package v1

import (
	"api/prisma/db"
	"api/utils"
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/guregu/null"
)

type DocumentSettingsStruct struct {
	Language      null.String `json:"language"`
	Expiration    null.Int    `json:"expiration"`
	ShortURLs     null.Bool   `json:"shortUrls"`
	LongURLs      null.Bool   `json:"longUrls"`
	ImageEmbed    null.Bool   `json:"imageEmbed"`
	InstantDelete null.Bool   `json:"instantDelete"`
	Encrypted     null.Bool   `json:"encrypted"`
	Password      null.String `json:"password"`
	Public        null.Bool   `json:"public"`
	Editors       []string    `json:"editors"`
}

type Links struct {
	Raw       string `json:"raw"`
	Formatted string `json:"formatted"`
}

type Timestamps struct {
	Creation   time.Time `json:"creation"`
	Expiration time.Time `json:"expiration"`
}
type CreatedDocumentSettingsStruct struct {
	Language      string   `json:"language"`
	ImageEmbed    bool     `json:"imageEmbed"`
	InstantDelete bool     `json:"instantDelete"`
	Encrypted     bool     `json:"encrypted"`
	Password      string   `json:"password"`
	Public        bool     `json:"public"`
	Editors       []string `json:"editors"`
}
type CreateDocumentData struct {
	Id         string                        `json:"id"`
	Content    string                        `json:"content"`
	Views      int                           `json:"views"`
	Links      Links                         `json:"links"`
	Timestamps Timestamps                    `json:"timestamps"`
	Settings   CreatedDocumentSettingsStruct `json:"settings"`
}

type CreateResponseStruct struct {
	Success bool               `json:"success"`
	Data    CreateDocumentData `json:"data"`
}

type DocumentStruct struct {
	Content  string                 `json:"content"`
	Settings DocumentSettingsStruct `json:"settings"`
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
		Creation:   createdDocument.CreationDate,
		Expiration: createdDocument.ExpirationDate,
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

func EditDocument(c *fiber.Ctx) error {
	return c.SendString("Editing deez nuts")
}

func DeleteDocument(c *fiber.Ctx) error {
	return c.SendString("Deleting deez nuts")
}
