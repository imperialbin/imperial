package auth

import (
	. "newapi/v1/commons"

	"github.com/gofiber/fiber/v2"
)

func ResetPassword(c *fiber.Ctx) error {
	return c.JSON(Response{
		Success: true,
		Message: "Successfully reset your password!",
	})
}
