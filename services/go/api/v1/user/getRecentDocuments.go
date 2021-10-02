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

	var documentArray []DocumentData

	for _, document := range getDocuments {
		creator, _ := document.Creator()
		gist, _ := document.Gist()

		documentArray = append(documentArray, DocumentData{
			ID:      document.ID,
			Creator: creator,
			Views:   document.Views,
			Links: Links{
				Raw:       c.BaseURL() + "/r/" + document.ID,
				Formatted: c.BaseURL() + "/p/" + document.ID,
			},
			Timestamps: Timestamps{
				Creation:   document.CreationDate.Unix(),
				Expiration: document.ExpirationDate.Unix(),
			},
			Gist: gist,
			Settings: CreatedDocumentSettingsStruct{
				Language:      document.Settings().Language,
				ImageEmbed:    document.Settings().ImageEmbed,
				InstantDelete: document.Settings().InstantDelete,
				Encrypted:     document.Settings().Encrypted,
				Public:        document.Settings().Public,
				Editors:       document.Settings().Editors,
			},
		})
	}

	return c.JSON(Response{
		Success: true,
		Data:    documentArray,
	})
}
