package document

import (
	"api/prisma/db"
	. "api/utils"
	. "api/v1/commons"
	"context"

	"github.com/gofiber/fiber/v2"
)

func Delete(c *fiber.Ctx) error {
	var id = c.Params("id")
	client := GetPrisma()
	ctx := context.Background()

	user, err := GetUser(c)

	if err != nil {
		return c.Status(404).JSON(Response{
			Success: false,
			Message: "There was an error trying to find your user.",
		})
	}

	document, err := client.Document.FindUnique(
		db.Document.DocumentID.Equals(id),
	).With(
		db.Document.DocumentSettings.Fetch(),
	).Exec(ctx)

	if err != nil {
		return c.Status(404).JSON(Response{
			Success: false,
			Message: "Couldn't find document",
		})
	}

	documentCreator, _ := document.Creator()

	if string(documentCreator) != user.Username {
		return c.Status(401).JSON(Response{
			Success: false,
			Message: "You do not have access to delete this document!",
		})
	}

	deletedDocument, _ := client.Document.FindUnique(
		db.Document.DocumentID.Equals(id),
	).Delete().Exec(ctx)

	client.DocumentSettings.FindUnique(
		db.DocumentSettings.ID.Equals(deletedDocument.DocumentID),
	).Delete().Exec(ctx)

	return c.JSON(Response{
		Success: true,
		Message: "Document has successfully been deleted!",
	})
}
