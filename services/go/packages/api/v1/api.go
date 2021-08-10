package v1

import (
	. "api/v1/document"

	"github.com/gofiber/fiber/v2"
)

func Introduction(c *fiber.Ctx) error {
	return c.JSON(&fiber.Map{
		"success":       true,
		"message":       "Welcome to IMPERIAL's API!",
		"version":       1,
		"documentation": "https://docs.imperialb.in/",
	})
}

func GetDocument(c *fiber.Ctx) error {
	return Get(c)
}

func PostDocument(c *fiber.Ctx) error {
	return Post(c)
}

func EditDocument(c *fiber.Ctx) error {
	return Edit(c)
}

func DeleteDocument(c *fiber.Ctx) error {
	return Delete(c)
}
