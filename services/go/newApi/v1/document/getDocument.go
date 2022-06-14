package document

import (
	"errors"
	"newapi/models"
	"newapi/utils"
	. "newapi/v1/commons"

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

	return c.JSON(Response{
		Success: true,
		Data: PostDocumentResponse{
			ID:      document.ID,
			Content: document.Content,
			Creator: creatorPartial,
			Gist:    document.Gist,
			Views:   0,
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
