package devices

import (
	"api/models"
	"api/utils"
	. "api/v1/commons"

	"github.com/gofiber/fiber/v2"
)

func GetMeDevices(c *fiber.Ctx) error {
	user, err := utils.GetAuthedUser(c)

	if err != nil {
		return c.Status(401).JSON(Response{
			Success: false,
			Message: "You are not authorized!",
		})
	}

	if user == nil {
		return c.Status(401).JSON(Response{
			Success: false,
			Message: "You are not authorized!",
		})
	}

	var client = utils.GetDB()
	var devices []models.Device

	if result := client.Limit(20).Find(&devices, "user_id = ?", user.ID); result.Error != nil {
		return c.Status(500).JSON(Response{
			Success: false,
			Message: "An internal server error occurred :(",
		})
	}

	return c.JSON(Response{
		Success: true,
		Data:    devices,
	})
}
