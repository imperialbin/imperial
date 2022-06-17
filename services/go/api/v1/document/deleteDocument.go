package document

import (
	"api/models"
	"api/utils"
	"api/v1/commons"
	"errors"

	"github.com/getsentry/sentry-go"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func Delete(c *fiber.Ctx) error {
	var id = c.Params("id")
	user, err := utils.GetAuthedUser(c)

	if err != nil {
		return c.Status(404).JSON(commons.Response{
			Success: false,
			Message: "There was an error trying to find your user.",
		})
	}

	/* Find document */
	var client = utils.GetDB()

	var document models.Document
	if result := client.Preload("DocumentSettings").First(&document, "id = ?", id); result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return c.Status(404).JSON(commons.Response{
				Success: false,
				Message: "No document with that ID exists.",
			})
		}

		sentry.CaptureException(result.Error)
		return c.Status(500).JSON(commons.Response{
			Success: false,
			Message: "An internal server error occurred :(",
		})
	}

	if document.Creator != nil && *document.Creator != user.ID {
		return c.Status(401).JSON(commons.Response{
			Success: false,
			Message: "You do not own this document to delete it.",
		})
	}

	if result := client.Select("DocumentSettings").Delete(&document); result.Error != nil {
		println(result.Error.Error())
		sentry.CaptureException(result.Error)
		return c.Status(500).JSON(commons.Response{
			Success: false,
			Message: "An error occurred deleting this document :(",
		})
	}

	return c.JSON(commons.Response{
		Success: true,
		Message: "Document has successfully been deleted!",
	})
}
