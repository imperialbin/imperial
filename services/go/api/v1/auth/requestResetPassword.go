package auth

import (
	"api/prisma/db"
	. "api/utils"
	. "api/v1/commons"
	"context"

	"github.com/gofiber/fiber/v2"
)

func RequestResetPassword(c *fiber.Ctx) error {
	req := new(RequestResetPasswordStruct)
	client := GetPrisma()
	ctx := context.Background()

	if err := c.BodyParser(req); err != nil {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "You have a type error in your request!",
		})
	}

	errors := ValidateRequest(*req)

	if errors != nil {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "You have a validation error in your request.",
			Errors:  errors,
		})
	}

	user, err := client.User.FindUnique(
		db.User.Email.Equals(req.Email),
	).With(
		db.User.Settings.Fetch(),
	).Exec(ctx)

	if err != nil {
		return c.Status(404).JSON(Response{
			Success: false,
			Message: "That user does not exist!",
		})
	}

	token, err := GenerateRandomString(64)
	RedisSet(token, user.Email, 1)

	_, emailErr := SendEmail("ResetPassword", user.Email, "{ \"token\":\""+token+"\"}")

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
