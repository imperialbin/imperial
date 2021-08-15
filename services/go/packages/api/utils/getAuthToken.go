package utils

import "github.com/gofiber/fiber/v2"

func GetAuthToken(c *fiber.Ctx) string {
	return string(c.Request().Header.Peek("Authentication"))
}
