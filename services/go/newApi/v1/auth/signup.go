package auth

import (
	"newapi/models"
	"newapi/utils"
	. "newapi/v1/commons"

	"github.com/gofiber/fiber/v2"
)

func Signup(c *fiber.Ctx) error {
	req := new(SignupRequest)

	if err := c.BodyParser(req); err != nil {
		return c.JSON(Response{
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
			Message: "Password does not match confirm password!",
		})
	}

	client := utils.GetDB()

	item := models.User{}
	client.First(&item, "email = ?", req.Email)
	

	return c.JSON(Response{
		Success: true,
		Message: "Successfully created your account!",
		Data: fiber.Map{
			"authToken": "y",
		},
	})
}
