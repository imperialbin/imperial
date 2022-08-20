package users

import (
	"api/utils"
	"api/v1/commons"
	. "api/v1/commons"

	"github.com/getsentry/sentry-go"
	"github.com/gofiber/fiber/v2"
)

type DeleteUserRequest struct {
	Password        string `json:"password"`
	ConfirmPassword string `json:"confirm_password"`
}

func DeleteMe(c *fiber.Ctx) error {
	user, err := utils.GetAuthedUser(c)

	if err != nil {
		return c.Status(404).JSON(commons.Response{
			Success: false,
			Message: "There was an error trying to find your user.",
		})
	}

	if user == nil {
		return c.Status(404).JSON(commons.Response{
			Success: false,
			Message: "There was an error trying to find your user.",
		})
	}

	req := new(DeleteUserRequest)
	if err := c.BodyParser(req); err != nil {
		return c.Status(400).JSON(commons.Response{
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

	if req.Password != req.ConfirmPassword {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "Your passwords do not match.",
		})
	}

	if !utils.CheckHashedPassword(user.Password, req.Password) {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "Incorrect password.",
		})
	}

	var client = utils.GetDB()
	if result := client.Select("UserSettings").Delete(&user); result.Error != nil {
		sentry.CaptureException(result.Error)
		return c.Status(500).JSON(Response{
			Success: false,
			Message: "An internal server error occurred",
		})
	}

	return c.JSON(Response{
		Success: true,
		Message: "Your user has been deleted.",
	})
}
