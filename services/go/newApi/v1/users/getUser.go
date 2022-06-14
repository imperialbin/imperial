package users

import (
	"newapi/utils"
	. "newapi/v1/commons"

	"github.com/gofiber/fiber/v2"
)

func FindUser(c *fiber.Ctx) error {
	var username = c.Params("username")

	user, err := utils.GetUserPartial(username)

	if err != nil {
		return c.Status(500).JSON(Response{
			Success: false,
			Message: err.Error(),
		})
	}

	return c.JSON(Response{
		Success: true,
		Data:    user,
	})
}
