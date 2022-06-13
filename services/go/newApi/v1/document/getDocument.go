package document

import (
	. "newapi/v1/commons"

	"github.com/gofiber/fiber/v2"
)

func Get(c *fiber.Ctx) error {
	return c.JSON(Response{
		Success: true,

		Message: "yo",
	})
}
