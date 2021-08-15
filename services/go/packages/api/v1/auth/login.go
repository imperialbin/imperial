package auth

import (
	"api/prisma/db"
	. "api/utils"
	. "api/v1/commons"
	"context"

	"github.com/gofiber/fiber/v2"
)

func Login(c *fiber.Ctx) error {
	req := new(LoginRequest)
	client := GetPrisma()
	ctx := context.Background()

	if err := c.BodyParser(req); err != nil {
		return c.JSON(&fiber.Map{
			"success": false,
			"message": "You have a type error in your request!",
		})
	}

	errors := ValidateRequest(*req)

	if errors != nil {
		return c.Status(400).JSON(&fiber.Map{
			"success": false,
			"message": "You have a validation error in your request.",
			"errors":  errors,
		})
	}

	user, err := client.User.FindFirst(
		db.User.Or(
			db.User.Username.Equals(req.Username),
			db.User.Email.Equals(req.Username),
		),
	).Exec(ctx)

	if err != nil || !CheckHashedPassword(user.Password, req.Password) {
		return c.Status(400).JSON(&fiber.Map{
			"success": false,
			"message": "Username or password is incorrect!",
		})
	}

	/* Generate session */
	token, _ := GenerateSessionToken()
	RedisSet(token, user.ID, 7)
	RedisSet(user.APIToken, user.ID, 0)

	return c.JSON(&fiber.Map{
		"success": true,
		"message": "Created session",
		"token":   token,
	})
}
