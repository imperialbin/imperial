package middleware

import (
	. "newapi/utils"
	. "newapi/v1/commons"

	"github.com/gofiber/fiber/v2"
)

func CheckAdmin(c *fiber.Ctx) error {
	authToken := GetAuthToken(c)

	/* If request doesn't have header Authentication */
	if len(authToken) < 1 {
		return c.Status(401).JSON(Response{
			Success: false,
			Message: "You are not authenticated or authenticated correctly!",
		})
	}

	_, err := GetAuthedUser(c)

	if err != nil {
		return c.Status(401).JSON(Response{
			Success: false,
			Message: "You are not authenticated or authenticated correctly!",
		})
	}

	/* 	if !user.Admin {
		return c.Status(401).JSON(Response{
			Success: false,
			Message: "You are not an admin!",
		})
	} */

	return c.Next()
}