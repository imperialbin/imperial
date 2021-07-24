package v1

import "github.com/gofiber/fiber/v2"

func GetDocument(c *fiber.Ctx) error {
	return c.SendString("Getting deez nuts")
}

func CreateDocument(c *fiber.Ctx) error {
	return c.SendString("Creating deez nuts")
}

func EditDocument(c *fiber.Ctx) error {
	return c.SendString("Editing deez nuts")
}

func DeleteDocument(c *fiber.Ctx) error {
	return c.SendString("Deleting deez nuts")
}
