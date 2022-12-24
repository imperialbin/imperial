package devices

import (
	"api/models"
	"api/utils"
	. "api/v1/commons"

	"github.com/gofiber/fiber/v2"
)

type DeleteDeviceRequest struct {
	Password string `json:"password"`
}

func DeleteDevice(c *fiber.Ctx) error {
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

	req := new(DeleteDeviceRequest)
	if err := c.BodyParser(req); err != nil {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "You have a type error in your request!",
		})
	}

	errors := utils.ValidateRequest(*req)

	if errors != nil {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "You have a validation error in your request.",
			Errors:  errors,
		})
	}

	if !utils.CheckHashedPassword(user.Password, req.Password) {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "Incorrect password.",
		})
	}

	var deviceID = c.Params("id")
	var client = utils.GetDB()
	var device models.Device

	if result := client.First(&device, "id = ? AND user_id = ?", deviceID, user.ID); result.Error != nil {
		return c.Status(404).JSON(Response{
			Success: false,
			Message: "Device not found!",
		})
	}

	if result := client.Delete(&device); result.Error != nil {
		return c.Status(500).JSON(Response{
			Success: false,
			Message: "An internal server error occurred :(",
		})
	}

	utils.RedisDel(device.AuthToken)

	return c.JSON(Response{
		Success: true,
		Message: "Successfully deleted device!",
	})
}
