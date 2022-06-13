package users

import (
	. "newapi/v1/commons"

	"github.com/gofiber/fiber/v2"
)

func DeleteMe(c *fiber.Ctx) error {
	return c.JSON(Response{
		Success: true,
		Message: "Your user has been deleted.",
	})
}
