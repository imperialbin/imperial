package document

import (
	"api/models"
	"api/utils"
	. "api/v1/commons"
	"errors"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func Get(c *fiber.Ctx) error {
	var id = c.Params("id")

	client := utils.GetDB()

	var document models.Document
	if result := client.Preload("DocumentSettings").First(&document, "id = ?", id); result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return c.Status(404).JSON(Response{
				Success: false,
				Message: "No document with that ID exists.",
			})
		}

		return c.Status(500).JSON(Response{
			Success: false,
			Message: "An internal server error occurred :(",
		})
	}

	var creatorPartial *models.UserPartial
	if document.Creator != nil {
		creatorPartial, _ = utils.GetUserPartialByID(*document.Creator)
	}

	client.Model(&document).Update("views", document.Views+1)

	return c.JSON(Response{
		Success: true,
		Data: PostDocumentResponse{
			ID:      document.ID,
			Content: document.Content,
			Creator: creatorPartial,
			GistURL: document.GistURL,
			Views:   document.Views,
			Timestamps: Timestamps{
				Creation:   document.CreatedAt,
				Expiration: document.ExpiresAt,
			},
			Links: Links{
				Raw:       c.BaseURL() + "/r/" + document.ID,
				Formatted: c.BaseURL() + "/p/" + document.ID,
			},
			DocumentSettings: document.DocumentSettings,
		},
	})
}
