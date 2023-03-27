package users

import (
	"api/models"
	"api/utils"
	. "api/v1/commons"
	"errors"
	"os"
	"strings"

	"github.com/getsentry/sentry-go"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func GetMeDocuments(c *fiber.Ctx) error {
	user, err := utils.GetAuthedUser(c)
	if err != nil || strings.HasPrefix("IMPERIAL-", utils.GetAuthToken(c)) {
		return c.Status(401).JSON(Response{
			Success: false,
			Message: "You are not authorized!",
		})
	}

	if user == nil {
		return c.Status(401).JSON(Response{
			Success: false,
			Message: "You are not authorized!",
		})
	}

	var client = utils.GetDB()
	var documents []models.Document

	if result := client.Limit(10).Find(&documents).Where("creator = ?", user.ID).Order("created_at desc"); result.Error != nil {
		sentry.CaptureException(result.Error)
		return c.Status(500).JSON(Response{
			Success: false,
			Message: "An error occured whilst getting your documents",
		})
	}

	var parsedDocuments []PostDocumentResponse

	for _, document := range documents {
		/* Fetch creators partial */
		creatorPartial, err := utils.GetUserPartialByID(*document.Creator)

		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				continue
			}

			sentry.CaptureException(err)
			continue
		}

		/* Fetch editors partial */
		var editors = []models.UserPartial{}
		for _, userID := range document.DocumentSettings.Editors {
			partial, err := utils.GetUserPartial(userID)

			if err != nil {
				if errors.Is(err, gorm.ErrRecordNotFound) {
					continue
				}

				sentry.CaptureException(err)
				continue
			}

			editors = append(editors, *partial)
		}

		parsedDocuments = append(parsedDocuments, PostDocumentResponse{
			ID:      document.ID,
			Content: document.Content,
			Creator: creatorPartial,
			GistURL: document.GistURL,
			Views:   document.Views,
			Timestamps: Timestamps{
				Creation:   document.CreatedAt,
				Expiration: document.ExpiresAt,
			},
			Links: Links{
				Raw:       os.Getenv("FRONTEND_URL") + "r/" + document.ID,
				Formatted: os.Getenv("FRONTEND_URL") + document.ID,
			},
			DocumentSettings: PostDocumentSettingsResponse{
				Language:      document.DocumentSettings.Language,
				ImageEmbed:    document.DocumentSettings.ImageEmbed,
				InstantDelete: document.DocumentSettings.InstantDelete,
				Encrypted:     document.DocumentSettings.Encrypted,
				Public:        document.DocumentSettings.Public,
				Editors:       &editors,
			},
		})
	}

	return c.JSON(Response{
		Success: true,
		Data: fiber.Map{
			"documents": parsedDocuments,
		},
	})
}
