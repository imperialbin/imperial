package me

import (
	. "api/utils"

	"github.com/gofiber/fiber/v2"
)

func Me(c *fiber.Ctx) error {
	user, err := GetUser(c)
	if err != nil {
		return c.Status(403).JSON(&fiber.Map{
			"success": false,
			"message": "You are not authorized!",
		})
	}

	return c.JSON(&fiber.Map{
		"success": true,
		"data":    user,
	})
}
