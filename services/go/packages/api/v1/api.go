package v1

import "github.com/gofiber/fiber/v2"

func Introduction(c *fiber.Ctx) error {
	return c.JSON(&fiber.Map{
		"success":       true,
		"message":       "Welcome to IMPERIAL's API!",
		"version":       1,
		"documentation": "https://docs.imperialb.in/",
	})
}

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
