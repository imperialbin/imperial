package admin

import (
	. "api/utils"
	. "api/v1/commons"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func BanUser(c *fiber.Ctx) error {

	/* Not finished */
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
