package middleware

import (
	"api/utils"
	. "api/utils"
	. "api/v1/commons"

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

	user, err := GetAuthedUser(c)

	if err != nil {
		return c.Status(401).JSON(Response{
			Success: false,
			Message: "You are not authenticated or authenticated correctly!",
		})
	}

	if !TestPermission(user.Flags, utils.Admin) {
		return c.Status(401).JSON(Response{
			Success: false,
			Message: "You are not an admin!",
		})
	}

	return c.Next()
}
