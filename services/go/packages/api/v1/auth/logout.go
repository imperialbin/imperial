package auth

import "github.com/gofiber/fiber/v2"

func Logout(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"success": true,
		"message": "nut sack",
	})
}
