package middleware

import (
	. "api/utils"
	. "api/v1/commons"

	"github.com/gofiber/fiber/v2"
)

func CheckAuthenticated(c *fiber.Ctx) error {
	_, err := GetAuthedUser(c)

	if err != nil {
		return c.Status(401).JSON(Response{
			Success: false,
			Message: "You are not authorized!",
		})
	}

	return c.Next()
}
