package auth

import (
	"api/models"
	. "api/utils"
	. "api/v1/commons"
	"errors"

	"github.com/getsentry/sentry-go"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func Logout(c *fiber.Ctx) error {
	authToken := GetAuthToken(c)
	client := GetDB()

	var device models.Device

	if result := client.First(&device, "auth_token = ? ", authToken); result.Error != nil {
		if !errors.Is(result.Error, gorm.ErrRecordNotFound) {
			sentry.CaptureException(result.Error)
			return c.Status(500).JSON(Response{
				Success: false,
				Message: "There was an internal server error whilst logging you out!",
			})
		}
	}

	if result := client.Delete(&device); result.Error != nil {
		if !errors.Is(result.Error, gorm.ErrRecordNotFound) {
			sentry.CaptureException(result.Error)
			return c.Status(500).JSON(Response{
				Success: false,
				Message: "There was an internal server error whilst logging you out!",
			})
		}
	}

	_, err := RedisDel(authToken)

	if err != nil {
		sentry.CaptureException(err)
		return c.Status(500).JSON(Response{
			Success: false,
			Message: "There was an internal server error whilst deleting your token!",
		})
	}

	return c.JSON(Response{
		Success: true,
		Message: "Successfully deleted your session!",
	})
}
