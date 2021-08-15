package auth

import (
	. "api/utils"

	"github.com/gofiber/fiber/v2"
)

func Logout(c *fiber.Ctx) error {
	authToken := GetAuthToken(c)

	_, err := RedisDel(authToken)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": "There was an internal server error whilst deleting your token!",
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Successfully deleted your session!",
	})
}
