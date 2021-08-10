package document

import (
	"api/prisma/db"
	"api/utils"
	"context"

	"github.com/gofiber/fiber/v2"
)

func Get(c *fiber.Ctx) error {
	client := utils.GetPrisma()
	ctx := context.Background()

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
