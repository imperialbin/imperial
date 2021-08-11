package auth

import "github.com/gofiber/fiber/v2"

func Signup(c *fiber.Ctx) error {
	return c.SendString("what")
}
