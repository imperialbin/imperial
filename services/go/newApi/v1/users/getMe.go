package users

import (
	"newapi/utils"
	. "newapi/v1/commons"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func Me(c *fiber.Ctx) error {
	user, err := utils.GetAuthedUser(c)
	if err != nil || strings.HasPrefix("IMPERIAL-", utils.GetAuthToken(c)) {
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
