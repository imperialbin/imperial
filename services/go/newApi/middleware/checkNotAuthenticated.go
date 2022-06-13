package middleware

import (
	. "newapi/utils"
	. "newapi/v1/commons"

	"github.com/gofiber/fiber/v2"
)

func CheckNotAuthenticated(c *fiber.Ctx) error {
	authToken := GetAuthToken(c)

	/* If request doesn't have Authentication */
	if len(authToken) < 1 {
		return c.Next()
	}

	_, err := RedisGet(authToken)

	if err != nil {
		return c.Next()
	}

	return c.Status(401).JSON(Response{
		Success: false,
		Message: "You can not be authenticated in this route!",
	})
}
