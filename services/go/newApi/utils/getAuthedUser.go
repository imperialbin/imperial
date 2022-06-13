package utils

import (
	"errors"
	"newapi/models"

	"github.com/gofiber/fiber/v2"
)

func GetAuthedUser(c *fiber.Ctx) (*models.User, error) {
	authToken := GetAuthToken(c)
	userID, err := RedisGet(authToken)

	if err != nil {
		return nil, errors.New("ErrNotFound")
	}

	client := GetDB()

	var user models.User
	client.First(&user, userID)

	return &user, nil
}
