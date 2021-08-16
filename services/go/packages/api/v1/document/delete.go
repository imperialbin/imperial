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

	user, err := GetUser(c)

	if err != nil {
		return c.Status(404).JSON(&fiber.Map{
			"success": false,
			"message": "There was an error trying to find your user.",
		})
	}

	document, err := client.Document.FindUnique(
		db.Document.DocumentID.Equals(id),
	).With(
		db.Document.DocumentSettings.Fetch(),
	).Exec(ctx)

	if err != nil {
		return c.Status(404).JSON(&fiber.Map{
			"success": false,
			"message": "Couldn't find document",
		})
	}

	documentCreator, _ := document.Creator()

	println(string(documentCreator))
	if string(documentCreator) != user.Username {
		return c.Status(401).JSON(&fiber.Map{
			"success": false,
			"message": "You do not have access to delete this document!",
		})
	}

	deletedDocument, err := client.Document.FindUnique(
		db.Document.DocumentID.Equals(id),
	).Delete().Exec(ctx)

	client.DocumentSettings.FindUnique(
		db.DocumentSettings.ID.Equals(deletedDocument.DocumentID),
	).Delete().Exec(ctx)

	return c.JSON(&fiber.Map{
		"success": true,
		"message": "Document has successfully been deleted!",
	})
}
