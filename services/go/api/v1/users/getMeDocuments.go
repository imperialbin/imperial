package users

import (
	"api/models"
	"api/utils"
	. "api/v1/commons"
	"strings"

	"github.com/getsentry/sentry-go"
	"github.com/gofiber/fiber/v2"
)

func GetMeDocuments(c *fiber.Ctx) error {
	user, err := utils.GetAuthedUser(c)
	if err != nil || strings.HasPrefix("IMPERIAL-", utils.GetAuthToken(c)) {
		return c.Status(401).JSON(Response{
			Success: false,
			Message: "You are not authorized!",
		})
	}

	if user == nil {
		return c.Status(401).JSON(Response{
			Success: false,
			Message: "You are not authorized!",
		})
	}

	var client = utils.GetDB()
	var documents []models.Document

	if result := client.Limit(10).Find(&documents).Where("creator = ?", user.ID); result.Error != nil {
		sentry.CaptureException(result.Error)
		return c.Status(500).JSON(Response{
			Success: false,
			Message: "An error occured whilst getting your documents",
		})
	}

	// todo finish this
	return c.JSON(Response{
		Success: true,
		Data: fiber.Map{
			"documents": documents,
		},
	})
}
