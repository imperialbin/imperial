package auth

import (
	. "newapi/utils"
	. "newapi/v1/commons"

	"github.com/gofiber/fiber/v2"
)

func Logout(c *fiber.Ctx) error {
	authToken := GetAuthToken(c)

	_, err := RedisDel(authToken)

	if err != nil {
		return c.Status(500).JSON(Response{
			Success: false,
			Message: "There was an internal server error whilst deleting your token!",
		})
	}

	return c.JSON(Response{
		Success: true,
		Message: "Successfully deleted your session!",
	})
}
