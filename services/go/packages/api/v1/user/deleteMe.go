package user

import (
	. "api/utils"
	. "api/v1/commons"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func DeleteMe(c *fiber.Ctx) error {
	user, err := GetUser(c)
	if err != nil || strings.HasPrefix("IMPERIAL-", GetAuthToken(c)) {
		return c.Status(401).JSON(Response{
			Success: false,
			Message: "You are not authorized!",
		})
	}

	return c.JSON(Response{
		Success: true,
		Data:    user,
	})
}
