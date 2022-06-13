package auth

import (
	. "newapi/v1/commons"

	"github.com/gofiber/fiber/v2"
)

func RequestResetPassword(c *fiber.Ctx) error {
	return c.JSON(Response{
		Success: true,
		Message: "We have sent you an email to reset your password!",
	})
}
