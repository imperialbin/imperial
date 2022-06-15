package users

import (
	"errors"
	"newapi/utils"
	. "newapi/v1/commons"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func FindUser(c *fiber.Ctx) error {
	var username = c.Params("username")

	user, err := utils.GetUserPartial(username)

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(404).JSON(Response{
				Success: false,
				Message: "User not found.",
			})
		}

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
