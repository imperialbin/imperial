package users

import (
	. "newapi/v1/commons"

	"github.com/gofiber/fiber/v2"
)

func RegenApiToken(c *fiber.Ctx) error {
	return c.JSON(Response{
		Success: true,
		Message: "Successfully regenerated your API token!",
	})
}
