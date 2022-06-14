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
	user, err := utils.GetAuthedUser(c)

	if err != nil {
		return c.Status(500).JSON(Response{
			Success: false,
			Message: "An internal server error occurred.",
		})
	}

	documentRequest := &DocumentStruct{}
	if err := defaults.Set(documentRequest); err != nil {
		return c.Status(500).JSON(Response{
			Success: false,
			Message: "An internal server error occurred.",
		})
	}

	/* only allow authed users to make settings */
	if user != nil {
		marshalReq, _ := json.Marshal(req)
		json.Unmarshal([]byte(marshalReq), &documentRequest)
	}

	if documentRequest.Settings.ShortURLs {
		randomString, _ = utils.GenerateRandomString(32)
	} else if documentRequest.Settings.ShortURLs {
		randomString, _ = utils.GenerateRandomString(4)
	}

	var creatorPartial *models.UserPartial

	if user != nil {
		creatorPartial, _ = utils.GetUserPartial(user.Username)
	}

	if err != nil {
		println(err.Error())
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

	if documentRequest.Settings.CreateGist && user != nil && user.GithubOAuth != nil && len(*user.GithubOAuth) > 0 {
		reqGist, err := utils.CreateGist(user, randomString, document.Content)

		if err == nil {
			document.Gist = &reqGist
		}
	}

	if result := client.Create(&document); result.Error != nil {
		return c.JSON(Response{
			Success: false,
			Message: result.Error.Error(),
		})
	}

	if user != nil {
		client.Model(&user).Update("documents_made", user.DocumentsMade+1)
		creatorPartial.DocumentsMade = creatorPartial.DocumentsMade + 1
	}

	return c.JSON(Response{
		Success: true,
		Data: PostDocumentResponse{
			ID:       document.ID,
			Content:  document.Content,
			Password: password,
			Creator:  creatorPartial,
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
