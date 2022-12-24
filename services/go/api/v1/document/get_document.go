package document

import (
	"api/models"
	"api/utils"
	. "api/v1/commons"
	"errors"
	"os"

	"github.com/getsentry/sentry-go"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func Get(c *fiber.Ctx) error {
	var id = c.Params("id")
	var password = c.Query("password")

	client := utils.GetDB()

	var document models.Document
	if result := client.Preload("DocumentSettings").First(&document, "id = ?", id); result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return c.Status(404).JSON(Response{
				Success: false,
				Message: "No document with that ID exists.",
			})
		}

		sentry.CaptureException(result.Error)
		return c.Status(500).JSON(Response{
			Success: false,
			Message: "An internal server error occurred :(",
		})
	}

	var creatorPartial *models.UserPartial
	if document.Creator != nil {
		creatorPartial, _ = utils.GetUserPartialByID(*document.Creator)
	}

	client.Model(&document).Update("views", document.Views+1)

	var editors = []models.UserPartial{}
	if document.DocumentSettings.Editors != nil {
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
	}

	/* Todo: finish this */
	if document.DocumentSettings.Encrypted && len(password) != 0 {
		decryptedValue, _ := utils.Decrypt(password, document.Content, "")
		document.Content = decryptedValue
	}

	return c.JSON(Response{
		Success: true,
		Data: PostDocumentResponse{
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
		},
	})
}
