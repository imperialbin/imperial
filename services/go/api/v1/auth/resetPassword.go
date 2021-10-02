package auth

import (
	"api/prisma/db"
	. "api/utils"
	. "api/v1/commons"
	"context"

	"github.com/gofiber/fiber/v2"
)

func ResetPassword(c *fiber.Ctx) error {
	req := new(ResetPasswordStruct)
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

	email, err := RedisGet(req.Token)

	if err != nil {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "Your token is invalid!",
		})
	}

	if len(req.Password) < 8 {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "Your password must be 8 characters long!",
		})
	}

	if req.ConfirmPassword != req.Password {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "Password does not match confirm password!",
		})
	}

	_, emailErr := client.User.FindUnique(
		db.User.Email.Equals(email),
	).Exec(ctx)

	/* This will never happen, but better safe than sorry */
	if emailErr != nil {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "There was an error trying to find your user.",
		})
	}

	hashedPassword, err := HashPassword(req.Password)

	if err != nil {
		return c.Status(500).JSON(Response{
			Success: false,
			Message: "There was an internal server error while fulfilling your request.",
		})
	}

	_, changePasswordErr := client.User.FindUnique(
		db.User.Email.Equals(email),
	).Update(
		db.User.Password.Set(hashedPassword),
	).Exec(ctx)

	if changePasswordErr != nil {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "There was an error trying to set your password.",
		})
	}

	RedisDel(req.Token)

	return c.JSON(Response{
		Success: true,
		Message: "Successfully reset your password!",
	})
}
