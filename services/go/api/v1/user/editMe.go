package user

import (
	"api/prisma/db"
	. "api/utils"
	. "api/v1/commons"
	"context"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func EditMe(c *fiber.Ctx) error {
	user, err := GetUser(c)
	if err != nil || strings.HasPrefix("IMPERIAL-", GetAuthToken(c)) {
		return c.Status(401).JSON(Response{
			Success: false,
			Message: "You are not authorized!",
		})
	}

	req := new(EditUserSettings)
	client := GetPrisma()
	ctx := context.Background()

	if err := c.BodyParser(req); err != nil {
		return c.JSON(Response{
			Success: false,
			Message: "You have a type error in your request!",
		})
	}

	errors := ValidateRequest(*req)

	if errors != nil {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "You have a validation error in your request.",
			Errors:  errors,
		})
	}

	_, updateUserError := client.UserSettings.FindUnique(
		db.UserSettings.ID.Equals(user.UserSettingsID),
	).Update(
		db.UserSettings.Clipboard.SetIfPresent(req.Clipboard),
		db.UserSettings.LongURLs.SetIfPresent(req.LongURLs),
		db.UserSettings.ShortURLs.SetIfPresent(req.ShortURLs),
		db.UserSettings.InstantDelete.SetIfPresent(req.InstantDelete),
		db.UserSettings.Encrypted.SetIfPresent(req.Encrypted),
		db.UserSettings.ImageEmbed.SetIfPresent(req.ImageEmbed),
		db.UserSettings.Expiration.SetIfPresent(req.Expiration),
		db.UserSettings.FontLignatures.SetIfPresent(req.FontLignatures),
		db.UserSettings.FontSize.SetIfPresent(req.FontSize),
		db.UserSettings.RenderWhitespace.SetIfPresent(req.RenderWhitespace),
		db.UserSettings.WordWrap.SetIfPresent(req.WordWrap),
		db.UserSettings.TabSize.SetIfPresent(req.TabSize),
	).Exec(ctx)

	if updateUserError != nil {
		return c.Status(500).JSON(Response{
			Success: false,
			Message: "There was an error trying to change your users settings!",
		})
	}

	/* In the future lets remove this call and auto assume that everything went well */
	updatedUser, _ := GetUser(c)

	return c.JSON(Response{
		Success: true,
		Data:    updatedUser,
	})
}
