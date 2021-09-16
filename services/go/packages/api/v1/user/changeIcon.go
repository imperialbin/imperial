package user

import (
	"api/prisma/db"
	. "api/utils"
	. "api/v1/commons"
	"context"
	"strings"

	"github.com/drexedam/gravatar"
	"github.com/gofiber/fiber/v2"
)

func ChangeIcon(c *fiber.Ctx) error {
	user, err := GetUser(c)
	if err != nil || strings.HasPrefix("IMPERIAL-", GetAuthToken(c)) {
		return c.Status(401).JSON(Response{
			Success: false,
			Message: "You are not authorized!",
		})
	}

	req := new(ChangeIconStruct)
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

	var icon = req.URL
	if req.Method == "gravatar" {
		icon = gravatar.New(req.URL).URL()
	} else {
		icon = req.URL
	}

	_, updatedUserErr := client.User.FindUnique(
		db.User.ID.Equals(user.ID),
	).Update(
		db.User.Icon.Set(icon),
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
		Message: "Successfully regenerated your API token!",
		Data:    newUser,
	})
}
