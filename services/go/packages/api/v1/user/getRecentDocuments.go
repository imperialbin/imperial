package user

import (
	"api/prisma/db"
	. "api/utils"
	. "api/v1/commons"
	"context"

	"github.com/gofiber/fiber/v2"
)

type DocumentData struct {
	ID         string                        `json:"id"`
	Creator    string                        `json:"creator"`
	Views      int                           `json:"views"`
	Links      Links                         `json:"links"`
	Timestamps Timestamps                    `json:"timestamps"`
	Gist       string                        `json:"gistURL"`
	Settings   CreatedDocumentSettingsStruct `json:"settings"`
}

func GetRecentDocuments(c *fiber.Ctx) error {
	user, err := GetUser(c)
	if err != nil {
		return c.Status(401).JSON(Response{
			Success: false,
			Message: "You are not authorized!",
		})
	}

	client := GetPrisma()
	ctx := context.Background()

	getDocuments, err := client.Document.FindMany(
		db.Document.Creator.Equals(user.Username),
	).With(
		db.Document.Settings.Fetch(),
	).OrderBy(db.Document.CreationDate.Order(db.ASC)).Take(5).Exec(ctx)

	if err != nil {
		return c.Status(500).JSON(Response{
			Success: false,
			Message: "An error occurred whilst getting documents!",
		})
	}

	return c.JSON(Response{
		Success: true,
		Data:    getDocuments,
	})
}
