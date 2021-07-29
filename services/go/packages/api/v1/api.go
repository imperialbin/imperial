package v1

import (
	"api/prisma/db"
	"api/utils"
	"context"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

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

	document, err := client.Document.FindFirst(
		db.Document.DocumentID.Equals("deez"),
	).Exec(ctx)

	if err != nil {
		return c.JSON(&fiber.Map{
			"success": false,
			"message": "We couldn't find that document!",
		})
	}

	println(document)

	return c.SendString("Getting deez nuts")
}

func CreateDocument(c *fiber.Ctx) error {
	client := utils.GetPrisma()
	ctx := context.Background()

	createdDocumentSettings, err := client.DocumentSettings.CreateOne(
		db.DocumentSettings.ImageEmbed.Set(false),
		db.DocumentSettings.InstantDelete.Set(false),
		db.DocumentSettings.Encrypted.Set(false),
		db.DocumentSettings.Public.Set(false),
		db.DocumentSettings.Language.Set("typescript"),
		db.DocumentSettings.Editors.Set([]string{""}),
	).Exec(ctx)

	if err != nil {
		println(err)
	}

	fmt.Print("Not deez nut!", createdDocumentSettings)

	/* 	createdDocument, err := client.Document.CreateOne(
	   		db.Document.DocumentID.Set("deez"),
	   		db.Document.Content.Set("deez"),
	   		db.Document.ExpirationDate.Set(int(time.Now().UTC().UnixNano())),
	   		db.DocumentSettings.language.Set("typescript"),
	   		db.Document.DocumentSettings.Link(
	   			db.DocumentSettings.language.
	   		)

	   	 		db.Document.Content.Set("Deez"),
	   	   		db.Document.DocumentID.Set("deeze"),
	   	   		db.Document.ExpirationDate.Set(1627285015440),
	   	   		db.DocumentSettings.Language.Set("typeshit"),
	   	   		db.DocumentSettings.ImageEmbed.Set(false),
	   	   		db.DocumentSettings.InstantDelete.Set(false),
	   	   		db.DocumentSettings.Encrypted.Set(false),
	   	   		db.DocumentSettings.Editors.Set([0]string),
	   	   		db.DocumentSettings.Public.Set(false),
	   	).Exec(ctx)

	*/

	if err != nil {
		println("deez nut!", err)
	}

	return c.SendString("balls")

	/* 	println(createdDocument) */
}

func EditDocument(c *fiber.Ctx) error {
	return c.SendString("Editing deez nuts")
}

func DeleteDocument(c *fiber.Ctx) error {
	return c.SendString("Deleting deez nuts")
}
