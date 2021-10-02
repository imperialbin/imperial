package document

import (
	"api/prisma/db"
	. "api/utils"
	. "api/v1/commons"
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
)

func Post(c *fiber.Ctx) error {
	client := GetPrisma()
	ctx := context.Background()

	/* Document stuff */
	documentRequest := new(DocumentStruct)

	if err := c.BodyParser(documentRequest); err != nil {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "You have a type error in your request!",
		})
	}

	user, err := GetUser(c)

	var creator string

	if err != nil {
		creator = ""
	} else {
		creator = user.Username
	}

	content := documentRequest.Content
	language := documentRequest.Settings.Language.String
	imageEmbed := documentRequest.Settings.ImageEmbed.Bool
	instantDelete := documentRequest.Settings.InstantDelete.Bool
	encrypted := documentRequest.Settings.Encrypted.Bool
	public := documentRequest.Settings.Public.Bool
	editors := documentRequest.Settings.Editors
	password := documentRequest.Settings.Password.String

	/* Check if longer/shorter URLs are enabled */
	randomString, err := GenerateRandomString(8)

	longURLs := documentRequest.Settings.LongURLs.Bool
	shortURLs := documentRequest.Settings.ShortURLs.Bool

	gist := documentRequest.Settings.CreateGist.Bool

	if longURLs {
		randomString, err = GenerateRandomString(32)
	} else if shortURLs {
		randomString, err = GenerateRandomString(4)
	}

	var gistURL string
	if gist {
		if len(*user.GithubAccess) > 0 {
			reqGist, err := CreateGist(user, randomString, content)

			if err == nil {
				gistURL = reqGist
			}
		}
	}

	/* If the user wants encryption */
	var encryptedIv string
	if encrypted {
		if len(password) < 1 {
			randomString, err := GenerateRandomString(8)

			if err != nil {
				c.Status(500).JSON(Response{
					Success: false,
					Message: "An error occurred whilst generating a password for your encrypted document!",
				})
			}

			password = randomString
		}

		content, encryptedIv = Encrypt(content, password)
	} else {
		password = ""
	}

	if err != nil {
		return c.Status(500).JSON(Response{
			Success: false,
			Message: "An error occurred whilst creating random string.",
		})
	}

	createdDocumentSettings, _ := client.DocumentSettings.CreateOne(
		db.DocumentSettings.Language.Set(language),
		db.DocumentSettings.ImageEmbed.Set(imageEmbed),
		db.DocumentSettings.InstantDelete.Set(instantDelete),
		db.DocumentSettings.Encrypted.Set(encrypted),
		db.DocumentSettings.Public.Set(public),
		db.DocumentSettings.Editors.Set(editors),
	).Exec(ctx)

	createdDocument, err := client.Document.CreateOne(
		db.Document.ID.Set(randomString),
		db.Document.Content.Set(content),
		db.Document.ExpirationDate.Set(time.Now().UTC().AddDate(0, 0, int(documentRequest.Settings.Expiration.Int64))),
		db.Document.Settings.Link(
			db.DocumentSettings.ID.Equals(createdDocumentSettings.ID),
		),
		db.Document.EncryptedIv.SetIfPresent(&encryptedIv),
		db.Document.Creator.Set(creator),
		db.Document.Gist.SetIfPresent(&gistURL),
	).Exec(ctx)

	if err != nil {
		return c.Status(500).JSON(Response{
			Success: false,
			Message: "An internal server error occurred whilst creating that document!",
		},
		)
	}

	timestamps := Timestamps{
		Creation:   createdDocument.CreationDate.Unix(),
		Expiration: createdDocument.ExpirationDate.Unix(),
	}

	links := Links{
		Raw:       c.BaseURL() + "/r/" + createdDocument.ID,
		Formatted: c.BaseURL() + "/p/" + createdDocument.ID,
	}

	settings := CreatedDocumentSettingsStruct{
		Language:      createdDocumentSettings.Language,
		ImageEmbed:    createdDocumentSettings.ImageEmbed,
		InstantDelete: createdDocumentSettings.InstantDelete,
		Encrypted:     createdDocumentSettings.Encrypted,
		Password:      &password,
		Public:        createdDocumentSettings.Public,
		Editors:       createdDocumentSettings.Editors}

	return c.JSON(Response{
		Success: true,
		Data: &CreateDocumentData{
			ID:         createdDocument.ID,
			Creator:    creator,
			Content:    createdDocument.Content,
			Views:      createdDocument.Views,
			Links:      links,
			Timestamps: timestamps,
			Gist:       gistURL,
			Settings:   settings,
		},
	})

}
