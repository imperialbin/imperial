package user

import (
	"api/prisma/db"
	. "api/utils"
	. "api/v1/commons"
	"context"
	"net/mail"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func ChangeEmail(c *fiber.Ctx) error {
	user, err := GetUser(c)
	if err != nil || strings.HasPrefix("IMPERIAL-", GetAuthToken(c)) {
		return c.Status(401).JSON(Response{
			Success: false,
			Message: "You are not authorized!",
		})
	}

	req := new(ChangeEmailStruct)
	client := GetPrisma()
	ctx := context.Background()

	if err := c.BodyParser(req); err != nil {
		return c.JSON(Response{
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

	_, emailErr := mail.ParseAddress(req.NewEmail)

	if emailErr != nil {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "You must provide a valid email!",
		})
	}

	_, updatedUserErr := client.User.FindUnique(
		db.User.ID.Equals(user.ID),
	).Update(
		db.User.Email.Set(req.NewEmail),
	).Exec(ctx)

	if updatedUserErr != nil {
		return c.Status(500).JSON(Response{
			Success: false,
			Message: "An internal server error occurred!",
		})
	}

	newUser, err := GetUser(c)

	return c.JSON(Response{
		Success: true,
		Message: "Successfully changed your email!",
		Data:    newUser,
	})
}
