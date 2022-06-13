package auth

import (
	. "newapi/v1/commons"

	"github.com/gofiber/fiber/v2"
)

func Login(c *fiber.Ctx) error {
	return c.JSON(Response{
		Success: true,
		Message: "Created session",
		Data: fiber.Map{
			"token": "yo",
		},
	})
}
