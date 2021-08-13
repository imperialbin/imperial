package auth

import (
	"api/prisma/db"
	"api/utils"
	. "api/utils"
	. "api/v1/commons"
	"context"

	"github.com/gofiber/fiber/v2"
)

func Signup(c *fiber.Ctx) error {
	req := new(SignupRequest)
	client := utils.GetPrisma()
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

	if req.Password != req.ConfirmPassword {
		return c.Status(400).JSON(&fiber.Map{
			"success": false,
			"message": "Password does not match confirm password!",
		})
	}

	hashedPassword, err := HashPassword(req.Password)

	if err != nil {
		return c.Status(500).JSON(&fiber.Map{
			"success": false,
			"message": "There was an internal server error while fulfilling your request.",
		})
	}

	createdUserSettings, err := client.UserSettings.CreateOne().Exec(ctx)

	if err != nil {
		return c.Status(500).JSON(&fiber.Map{
			"success": false,
			"message": "An error occurred whilst creating user's settings.",
		})
	}

	createdUser, err := client.User.CreateOne(
		db.User.Username.Set(req.Username),
		db.User.Email.Set(req.Email),
		db.User.Password.Set(hashedPassword),
		db.User.Settings.Link(
			db.UserSettings.ID.Equals(createdUserSettings.ID),
		),
	).Exec(ctx)

	if err != nil {
		return c.Status(500).JSON(&fiber.Map{
			"success": false,
			"message": "An error occurred whilst creating user.",
		})
	}

	/* Generate session */
	token := GenerateJWT(createdUser.ID, 7)
	RedisSet("sessions", createdUser.ID, token, 7)

	println(RedisGet("sessions", createdUser.ID))

	return c.JSON(&fiber.Map{
		"success":   true,
		"message":   "Successfully created your account!",
		"authToken": token,
	})
}
