package document

import (
	"newapi/v1/commons"

	"github.com/gofiber/fiber/v2"
)

func Delete(c *fiber.Ctx) error {

	return c.JSON(commons.Response{
		Success: true,
		Message: "Document has successfully been deleted!",
	})
}
