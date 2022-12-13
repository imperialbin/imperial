package users

import (
	"api/models"
	"api/utils"
	. "api/v1/commons"
	"strings"

	"github.com/getsentry/sentry-go"
	"github.com/gofiber/fiber/v2"
)

func SearchUsers(c *fiber.Ctx) error {
	var username = c.Params("username")

	client := utils.GetDB()

	var users []models.User
	if result := client.Find(&users, "username LIKE ? ", "%"+strings.ToLower(username)+"%"); result.Error != nil {
		sentry.CaptureException(result.Error)

		return c.Status(500).JSON(Response{
			Success: false,
			Message: "An internal server error occurred",
		})
	}

	var userPartials []models.UserPartial
	for _, user := range users {
		userPartials = append(userPartials, models.UserPartial{
			UserID:        user.ID,
			Username:      user.Username,
			DocumentsMade: user.DocumentsMade,
			Icon:          user.Icon,
			Flags:         user.Flags,
		})
	}

	return c.JSON(Response{
		Success: true,
		Data:    userPartials,
	})
}
