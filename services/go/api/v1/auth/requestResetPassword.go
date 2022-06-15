package auth

import (
	"api/models"
	"api/utils"
	. "api/v1/commons"
	"errors"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func RequestResetPassword(c *fiber.Ctx) error {
	req := new(RequestResetPasswordStruct)

	if err := c.BodyParser(req); err != nil {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "You have a type error in your request!",
		})
	}

	reqErrors := utils.ValidateRequest(*req)

	if reqErrors != nil {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "You have a validation error in your request.",
			Errors:  reqErrors,
		})
	}

	client := utils.GetDB()

	var user models.User
	if result := client.First(&user, "email = ?", req.Email); result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return c.Status(404).JSON(Response{
				Success: false,
				Message: "User with that email doesn't exist.",
			})
		}

		return c.Status(500).JSON(Response{
			Success: false,
			Message: "An internal server error occurred",
		})
	}

	token, err := utils.GenerateRandomString(32)

	if err != nil {
		return c.Status(500).JSON(Response{
			Success: false,
			Message: "There was an internal server error",
		})
	}

	utils.RedisSet(token, user.Email, 1)

	_, emailErr := utils.SendEmail("ResetPassword", user.Email, "{ \"token\":\""+token+"\"}")

	if emailErr != nil {
		return c.Status(500).JSON(Response{
			Success: false,
			Message: "There was an error sending an email to your account!",
		})
	}

	return c.JSON(Response{
		Success: true,
		Message: "We have sent you an email to reset your password!",
	})
}
