package v1

import (
	"api/prisma/db"
	"api/utils"
	. "api/v1/post"
	"context"

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

func PostDocument(c *fiber.Ctx) error {
	return CreateDocument(c)
}

func EditDocument(c *fiber.Ctx) error {
	return c.SendString("Editing deez nuts")
}

func DeleteDocument(c *fiber.Ctx) error {
	return c.SendString("Deleting deez nuts")
}
