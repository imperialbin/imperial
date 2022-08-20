package users

import (
	"api/utils"
	. "api/v1/commons"
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

	if user == nil {
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
