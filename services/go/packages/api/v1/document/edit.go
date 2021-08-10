package document

import "github.com/gofiber/fiber/v2"

func Edit(c *fiber.Ctx) error {
	return c.SendString("Editing deez nuts")
}
