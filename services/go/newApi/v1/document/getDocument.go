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
	if result := client.First(&document, "id = ?", id); result.Error != nil {
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

	return c.JSON(Response{
		Success: true,
		Data:    document,
	})
}
