package middleware

import (
	. "api/utils"

	"github.com/gofiber/fiber/v2"
)

func CheckAuthenticated(c *fiber.Ctx) error {
	authToken := string(c.Request().Header.Peek("Authentication"))

	/* If request doesn't have header Authentication */
	if len(authToken) < 1 {
		return c.Status(401).JSON(&fiber.Map{
			"success": false,
			"message": "You are not authenticated or authenticated correctly!",
		})
	}

	_, err := RedisGet(authToken)

	if err != nil {
		return c.Status(401).JSON(&fiber.Map{
			"success": false,
			"message": "You are not authenticated or authenticated correctly!",
		})
	}

	return c.Next()
}
