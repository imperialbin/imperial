package utils

import (
	"api/models"
	"errors"
	"fmt"
	"strings"

	"github.com/getsentry/sentry-go"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func GetAuthedUser(c *fiber.Ctx) (*models.User, error) {
	authToken := GetAuthToken(c)
	userID, err := RedisGet(authToken)
	var client = GetDB()

	// Dear lord help me as i've commited a sin and nested a bunch of ifs together
	if err != nil {
		// if request is an API token
		if !strings.Contains(authToken, "IMPERIAL-AUTH") {
			var apiToken models.User
			if result := client.First(&apiToken, "api_token = ? ", authToken).Select("api_token"); result.Error != nil {
				println(err.Error())
				if errors.Is(result.Error, gorm.ErrRecordNotFound) {
					return nil, nil
				}

				sentry.CaptureException(result.Error)
				return nil, nil
			}

			RedisSet(apiToken.APIToken, fmt.Sprint(apiToken.ID), -1)
			userID = fmt.Sprint(apiToken.ID)
		}
	}

	var user models.User
	if result := client.Preload("UserSettings").Preload("Discord").Preload("GitHub").First(&user, "id = ? ", userID); result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, nil
		}

		return nil, result.Error
	}

	return &user, nil
}
