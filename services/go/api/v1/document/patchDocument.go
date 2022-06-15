package document

import (
	"api/models"
	"api/utils"
	"api/v1/commons"
	"encoding/json"
	"errors"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func PatchDocument(c *fiber.Ctx) error {
	user, err := utils.GetAuthedUser(c)

	if err != nil {
		return c.Status(404).JSON(commons.Response{
			Success: false,
			Message: "There was an error trying to find your user.",
		})
	}

	req := new(commons.EditDocument)

	if err := c.BodyParser(req); err != nil {
		return c.Status(400).JSON(commons.Response{
			Success: false,
			Message: "You have a type error in your request!",
		})
	}

	/* Find document */
	var client = utils.GetDB()
	var document models.Document

	if result := client.Preload("DocumentSettings").First(&document, "id = ?", req.ID); result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return c.Status(404).JSON(commons.Response{
				Success: false,
				Message: "No document with that ID exists.",
			})
		}

		return c.Status(500).JSON(commons.Response{
			Success: false,
			Message: "An internal server error occurred :(",
		})
	}

	if document.Creator != nil && *document.Creator != user.ID {
		return c.Status(401).JSON(commons.Response{
			Success: false,
			Message: "You do not own this document to edit it.",
		})
	}

	var newDocument = &document

	marshalReq, _ := json.Marshal(req)
	json.Unmarshal(marshalReq, &newDocument)

	if result := client.Updates(&newDocument); result.Error != nil {
		return c.Status(500).JSON(commons.Response{
			Success: false,
			Message: "An internal server error occurred",
		})
	}

	return c.JSON(commons.Response{
		Success: true,
		Data:    newDocument,
	})
}
