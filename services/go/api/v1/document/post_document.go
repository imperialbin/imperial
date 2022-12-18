package document

import (
	"api/models"
	"api/utils"
	. "api/v1/commons"
	"encoding/json"
	"errors"
	"os"
	"strings"
	"time"

	"github.com/creasty/defaults"
	"github.com/getsentry/sentry-go"
	"github.com/gofiber/fiber/v2"
	"gopkg.in/src-d/enry.v1"
	"gorm.io/gorm"
)

func Post(c *fiber.Ctx) error {
	req := new(DocumentStruct)

	if err := c.BodyParser(req); err != nil {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "You have a type error in your request!",
		})
	}

	client := utils.GetDB()
	randomString, _ := utils.GenerateRandomString(8)
	user, err := utils.GetAuthedUser(c)

	if err != nil {
		sentry.CaptureException(err)
		return c.Status(500).JSON(Response{
			Success: false,
			Message: "An internal server error occurred.",
		})
	}

	documentRequest := &DocumentStruct{}
	if err := defaults.Set(documentRequest); err != nil {
		sentry.CaptureException(err)
		return c.Status(500).JSON(Response{
			Success: false,
			Message: "An internal server error occurred.",
		})
	}

	/* only allow authed users to make settings */
	marshalReq, _ := json.Marshal(req)
	json.Unmarshal([]byte(marshalReq), &documentRequest)
	if user == nil {
		documentRequest.Settings = DocumentSettingsStruct{
			Language:      documentRequest.Settings.Language,
			Expiration:    7,
			ShortURLs:     false,
			LongURLs:      false,
			ImageEmbed:    false,
			InstantDelete: false,
			Encrypted:     false,
			Public:        false,
			Editors:       nil,
			CreateGist:    false,
		}
	}

	if documentRequest.Settings.LongURLs {
		randomString, _ = utils.GenerateRandomString(32)
	} else if documentRequest.Settings.ShortURLs {
		randomString, _ = utils.GenerateRandomString(4)
	}

	var creatorPartial *models.UserPartial
	if user != nil {
		creatorPartial, _ = utils.GetUserPartial(user.Username)
	}

	var creatorID *uint = nil
	if user != nil {
		creatorID = &user.ID
	}

	var document = models.Document{
		ID:        randomString,
		Content:   documentRequest.Content,
		Creator:   creatorID,
		CreatedAt: time.Now(),
		ExpiresAt: nil,
		DocumentSettings: models.DocumentSettings{
			Language:      documentRequest.Settings.Language,
			ImageEmbed:    documentRequest.Settings.ImageEmbed,
			InstantDelete: documentRequest.Settings.InstantDelete,
			Encrypted:     documentRequest.Settings.Encrypted,
			Public:        documentRequest.Settings.Public,
			Editors:       documentRequest.Settings.Editors,
		},
	}

	var password string
	if documentRequest.Settings.Encrypted {
		if len(documentRequest.Settings.Password) < 1 {
			randomString, err := utils.GenerateRandomString(8)

			if err != nil {
				sentry.CaptureException(err)

				c.Status(500).JSON(Response{
					Success: false,
					Message: "An error occurred whilst generating a password for your encrypted document!",
				})
			}

			password = randomString
		} else {
			password = documentRequest.Settings.Password
		}

		var content string

		if strings.HasPrefix(document.Content, "IMPERIAL_ENCRYPTED") {
			content = document.Content
			println("uwu")
		} else {
			encryptedContent, _ := utils.Encrypt(document.Content, password)
			content = encryptedContent
		}

		document.Content = content
	}

	if documentRequest.Settings.CreateGist && user != nil && user.GitHub != nil {
		reqGist, err := utils.CreateGist(user, randomString, document.Content)

		if err == nil {
			document.GistURL = &reqGist
		}
	}

	if documentRequest.Settings.Language == "auto" {
		lang, _ := enry.GetLanguageByClassifier([]byte(document.Content), utils.AvailableLanguages)

		document.DocumentSettings.Language = strings.ToLower(lang)
		println(strings.ToLower(lang))
	}

	println(document.DocumentSettings.Language)

	if result := client.Create(&document); result.Error != nil {
		sentry.CaptureException(result.Error)
		return c.Status(500).JSON(Response{
			Success: false,
			Message: "An internal server error occurred",
		})
	}

	if user != nil {
		client.Model(&user).Update("documents_made", user.DocumentsMade+1)
		creatorPartial.DocumentsMade = creatorPartial.DocumentsMade + 1
	}

	/* 	if document.DocumentSettings.ImageEmbed {
		go utils.ScreenshotDocument(document.ID, user.Flags)
	} */

	var editors = []models.UserPartial{}
	if documentRequest.Settings.Editors != nil {
		for _, userID := range documentRequest.Settings.Editors {
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

	return c.JSON(Response{
		Success: true,
		Data: PostDocumentResponse{
			ID:       document.ID,
			Content:  document.Content,
			Password: password,
			Creator:  creatorPartial,
			GistURL:  document.GistURL,
			Views:    0,
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
				InstantDelete: document.DocumentSettings.ImageEmbed,
				Encrypted:     document.DocumentSettings.Encrypted,
				Public:        document.DocumentSettings.Public,
				Editors:       &editors,
			},
		},
	})

}
