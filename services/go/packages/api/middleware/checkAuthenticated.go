package middleware

import (
	. "api/utils"
	. "api/v1/commons"
	"github.com/gofiber/fiber/v2"
)

func CheckAuthenticated(c *fiber.Ctx) error {
	authToken := GetAuthToken(c)

	/* If request doesn't have header Authentication */
	if len(authToken) < 1 {
		return c.Status(401).JSON(Response{
			Success: false,
			Message: "You are not authenticated or authenticated correctly!",
		})
	}

	_, err := RedisGet(authToken)

	if err != nil {
		return c.Status(401).JSON(Response{
			Success: false,
			Message: "You are not authenticated or authenticated correctly!",
		})
	}

	return c.Next()
}
