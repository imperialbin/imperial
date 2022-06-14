package auth

import (
	"api/prisma/db"
	. "api/utils"
	. "api/v1/commons"
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func Signup(c *fiber.Ctx) error {
	req := new(SignupRequest)
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

	if req.Password != req.ConfirmPassword {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "Password does not match confirm password!",
		})
	}

	_, emailErr := client.User.FindUnique(
		db.User.Email.Equals(req.Email),
	).Exec(ctx)

	if emailErr == nil {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "That email already has an account",
		})
	}

	_, usernameErr := client.User.FindUnique(
		db.User.Username.Equals(req.Username),
	).Exec(ctx)

	if usernameErr == nil {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "That username is taken!",
		})
	}

	hashedPassword, err := HashPassword(req.Password)

	if err != nil {
		return c.Status(500).JSON(Response{
			Success: false,
			Message: "There was an internal server error while fulfilling your request.",
		})
	}

	createdUserSettings, err := client.UserSettings.CreateOne().Exec(ctx)

	if err != nil {
		return c.Status(500).JSON(Response{
			Success: false,
			Message: "An error occurred whilst creating user's settings.",
		})
	}

	createdUser, err := client.User.CreateOne(
		db.User.Username.Set(req.Username),
		db.User.Email.Set(req.Email),
		db.User.Password.Set(hashedPassword),
		db.User.APIToken.Set("IMPERIAL-"+uuid.NewString()),
		db.User.Settings.Link(
			db.UserSettings.ID.Equals(createdUserSettings.ID),
		),
	).Exec(ctx)

	if err != nil {
		return c.Status(500).JSON(Response{
			Success: false,
			Message: "An error occurred whilst creating user.",
		})
	}

	/* Generate session */
	token, _ := GenerateSessionToken()
	RedisSet(token, createdUser.ID, 7)
	RedisSet(createdUser.APIToken, createdUser.ID, 0)

	cookie := fiber.Cookie{
		Name:     "IMPERIAL-AUTH",
		Value:    token,
		Expires:  time.Now().Add(time.Hour * 168),
		HTTPOnly: true,
		Secure:   false,
		SameSite: "None",
	}

	c.Cookie(&cookie)

	return c.JSON(Response{
		Success: true,
		Message: "Successfully created your account!",
		Data: fiber.Map{
			"authToken": token,
		},
	})
}