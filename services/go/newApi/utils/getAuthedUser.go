package utils

import (
	"errors"
	"newapi/models"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func GetAuthedUser(c *fiber.Ctx) (*models.User, error) {
	authToken := GetAuthToken(c)
	userID, err := RedisGet(authToken)

	if err != nil {
		return nil, nil
	}

	client := GetDB()

	var user models.User
	if result := client.First(&user, "id = ? ", userID); result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, nil
		}

		return nil, result.Error
	}

	return &user, nil
}
