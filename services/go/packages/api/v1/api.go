package v1

import (
	"api/prisma/db"
	"api/utils"
	"context"
	"errors"

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
	document, err := client.Document.FindFirst(db.Document.DocumentID.Equals("deez")).Exec(ctx)

	if errors.Is(err, db.ErrNotFound) {
		return c.JSON(&fiber.Map{
			"success": false,
			"message": "Could not find that document!",
		})
	} else if err != nil {
		println(err)
		return c.JSON(&fiber.Map{
			"success": false,
			"message": "There was an internal error whilst getting that document!",
		})
	}

	println(document)

	return c.SendString("Getting deez nuts")
}

func CreateDocument(c *fiber.Ctx) error {
	return c.SendString("Creating deez nuts")
}

func EditDocument(c *fiber.Ctx) error {
	return c.SendString("Editing deez nuts")
}

func DeleteDocument(c *fiber.Ctx) error {
	return c.SendString("Deleting deez nuts")
}
