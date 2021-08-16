package document

import (
	"api/prisma/db"
	. "api/utils"
	"context"

	"github.com/gofiber/fiber/v2"
)

func Delete(c *fiber.Ctx) error {
	var id = c.Params("id")
	client := GetPrisma()
	ctx := context.Background()

	deletedDocument, err := client.Document.FindUnique(
		db.Document.DocumentID.Equals(id),
	).Delete().Exec(ctx)

	client.DocumentSettings.FindUnique(
		db.DocumentSettings.ID.Equals(deletedDocument.DocumentID),
	).Delete().Exec(ctx)

	if err != nil {
		return c.Status(404).JSON(&fiber.Map{
			"success": false,
			"message": "Couldn't find document",
		})
	}

	return c.JSON(&fiber.Map{
		"success": true,
		"message": "Document has successfully been deleted!",
	})
}
