package users

import (
	"newapi/utils"
	. "newapi/v1/commons"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func RegenAPIToken(c *fiber.Ctx) error {
	user, err := utils.GetAuthedUser(c)

	if err != nil || strings.HasPrefix("IMPERIAL-", utils.GetAuthToken(c)) {
		return c.Status(401).JSON(Response{
			Success: false,
			Message: "You are not authorized!",
		})
	}

	token := "IMPERIAL-" + uuid.NewString()

	utils.RedisDel(user.APIToken)

	var client = utils.GetDB()
	if result := client.Model(&user).Update("api_token", token); result.Error != nil {
		return c.Status(500).JSON(Response{
			Success: true,
			Message: "An internal server error occurred",
		})
	}

	utils.RedisSet(token, string(user.ID), 0)

	return c.JSON(Response{
		Success: true,
		Message: "Successfully regenerated your API token!",
		Data: fiber.Map{
			"token": token,
		},
	})
}
