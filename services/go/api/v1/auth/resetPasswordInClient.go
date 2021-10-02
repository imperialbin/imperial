package auth

import (
	"api/prisma/db"
	. "api/utils"
	. "api/v1/commons"
	"context"

	"github.com/gofiber/fiber/v2"
)

func ResetPasswordInClient(c *fiber.Ctx) error {
	user, err := GetUser(c)

	if err != nil {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "You are not authorized!",
		})
	}

	req := new(ResetPasswordInClientStruct)
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

	if len(req.CurrentPassword) < 8 || len(req.NewPassword) < 8 || len(req.ConfirmPassword) < 8 {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "Your password must be 8 characters long!",
		})
	}

	if req.ConfirmPassword != req.NewPassword {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "New password does not match confirm password!",
		})
	}

	if !CheckHashedPassword(user.Password, req.CurrentPassword) {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "Password is incorrect!",
		})
	}

	hashedPassword, err := HashPassword(req.NewPassword)

	if err != nil {
		return c.Status(500).JSON(Response{
			Success: false,
			Message: "There was an internal server error while fulfilling your request.",
		})
	}

	_, changePasswordErr := client.User.FindUnique(
		db.User.ID.Equals(user.ID),
	).Update(
		db.User.Password.Set(hashedPassword),
	).Exec(ctx)

	if changePasswordErr != nil {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "There was an error trying to set your password.",
		})
	}

	return c.JSON(Response{
		Success: true,
		Message: "Successfully reset your password!",
	})
}
