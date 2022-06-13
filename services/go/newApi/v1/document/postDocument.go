package document

import (
	"encoding/json"
	"newapi/models"
	"newapi/utils"
	. "newapi/v1/commons"
	"time"

	"github.com/creasty/defaults"
	"github.com/gofiber/fiber/v2"
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

	documentRequest := &DocumentStruct{}
	if err := defaults.Set(documentRequest); err != nil {
		panic(err)
	}

	marshalReqq, _ := json.Marshal(req)
	json.Unmarshal([]byte(marshalReqq), &documentRequest)

	if documentRequest.Settings.ShortURLs {
		randomString, _ = utils.GenerateRandomString(32)
	} else if documentRequest.Settings.ShortURLs {
		randomString, _ = utils.GenerateRandomString(4)
	}

	var document = models.Document{
		ID:        randomString,
		Content:   documentRequest.Content,
		Creator:   nil,
		CreatedAt: time.Now(),
		ExpiresAt: nil,
		DocumentSettings: models.DocumentSettings{
			Language:      documentRequest.Settings.Language,
			ImageEmbed:    documentRequest.Settings.ImageEmbed,
			InstantDelete: documentRequest.Settings.InstantDelete,
			Encrypted:     documentRequest.Settings.Encrypted,
			Public:        documentRequest.Settings.Public,
			Editors:       []string{},
		},
	}

	var password string
	if documentRequest.Settings.Encrypted {
		if len(documentRequest.Settings.Password) < 1 {
			randomString, err := utils.GenerateRandomString(8)

			if err != nil {
				c.Status(500).JSON(Response{
					Success: false,
					Message: "An error occurred whilst generating a password for your encrypted document!",
				})
			}

			password = randomString
		} else {
			password = documentRequest.Settings.Password
		}

		content, _ := utils.Encrypt(document.Content, password)

		document.Content = content
	}

	/* 	var gistURL string
	   	if gist && user != nil && len(*user.GithubAccess) > 0 {
	   		reqGist, err := CreateGist(user, randomString, content)

	   		if err == nil {
	   			gistURL = reqGist
	   		}
	   	} */

	if result := client.Create(&document); result.Error != nil {
		return c.JSON(Response{
			Success: false,
			Message: result.Error.Error(),
		})
	}

	return c.JSON(Response{
		Success: true,
		Data: PostDocumentResponse{
			ID:       document.ID,
			Content:  document.Content,
			Password: password,
			Creator:  document.Creator,
			Gist:     document.Gist,
			Views:    0,
			Timestamps: Timestamps{
				Creation:   document.CreatedAt,
				Expiration: document.ExpiresAt,
			},
			Links: Links{
				Raw:       c.BaseURL() + "/r/" + document.ID,
				Formatted: c.BaseURL() + "/p/" + document.ID,
			},
			DocumentSettings: document.DocumentSettings,
		},
	})

}
