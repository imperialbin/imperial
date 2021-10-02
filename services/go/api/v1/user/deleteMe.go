package user

import (
	"api/prisma/db"
	. "api/utils"
	. "api/v1/commons"
	"context"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func DeleteMe(c *fiber.Ctx) error {
	user, err := GetUser(c)
	if err != nil || strings.HasPrefix("IMPERIAL-", GetAuthToken(c)) {
		return c.Status(401).JSON(Response{
			Success: false,
			Message: "You are not authorized!",
		})
	}

	req := new(DeleteAccount)
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

	if len(req.Password) < 8 {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "Password must be 8 characters long!",
		})
	}

	if req.ConfirmPassword != req.Password {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "Password does not match confirm password!",
		})
	}

	if !CheckHashedPassword(user.Password, req.Password) {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "Incorrect password!",
		})
	}

	_, userErr := client.User.FindUnique(
		db.User.ID.Equals(user.ID),
	).Delete().Exec(ctx)

	if userErr != nil {
		return c.Status(500).JSON(Response{
			Success: false,
			Message: "There was an error trying to delete your user!",
		})
	}

	_, userSettingsErr := client.UserSettings.FindUnique(
		db.UserSettings.ID.Equals(user.UserSettingsID),
	).Delete().Exec(ctx)

	if userSettingsErr != nil {
		return c.Status(500).JSON(Response{
			Success: false,
			Message: "There was an error trying to delete your user settings!",
		})
	}

	SendEmail("DeletedAccount", user.Email, "{ }")

	return c.JSON(Response{
		Success: true,
		Message: "Your user has been deleted.",
	})
}
