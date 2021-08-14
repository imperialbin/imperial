package utils

import (
	"api/prisma/db"
	"context"
	"errors"

	"github.com/gofiber/fiber/v2"
)

func GetUser(c *fiber.Ctx) (*db.UserModel, error) {
	authToken := string(c.Request().Header.Peek("Authentication"))
	userId, ok := RedisGet(authToken)

	if !ok {
		return nil, errors.New("ErrNotFound")
	}
	client := GetPrisma()
	ctx := context.Background()

	user, err := client.User.FindUnique(
		db.User.ID.Equals(userId),
	).With(
		db.User.Settings.Fetch(),
	).Exec(ctx)

	if err != nil {
		return nil, err
	}

	return user, nil

}
