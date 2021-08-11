package document

import (
	"api/prisma/db"
	"api/utils"
	"context"

	"github.com/gofiber/fiber/v2"
)

func Delete(c *fiber.Ctx) error {
	var id = c.Params("id")
	client := utils.GetPrisma()
	ctx := context.Background()

	deleted, err := client.Document.FindMany(
		db.Document.DocumentID.Equals(id),
	).With(
		db.Document.DocumentSettings.Fetch(),
	).Delete().Exec(ctx)

	if err != nil {
		return c.Status(500).JSON(&fiber.Map{
			"success": false,
			"message": "An internal server error occurred whilst creating that document!",
		})
	}

	if deleted.Count == 0 {
		return c.Status(404).JSON(&fiber.Map{
			"success": false,
			"message": "Document does not exist!",
		})
	}

	return c.JSON(&fiber.Map{
		"success": true,
		"message": "Document has successfully been deleted!",
	})
}
