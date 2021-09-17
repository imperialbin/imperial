package utils

import (
	"api/prisma/db"
	. "api/v1/commons"
	"context"
	"errors"

	"github.com/gofiber/fiber/v2"
)

func GetUser(c *fiber.Ctx) (*User, error) {
	authToken := GetAuthToken(c)
	userId, err := RedisGet(authToken)

	if err != nil {
		return nil, errors.New("ErrNotFound")
	}

	client := GetPrisma()
	ctx := context.Background()

	user, err := client.User.FindUnique(
		db.User.ID.Equals(userId),
	).With(
		db.User.Settings.Fetch(),
	).Exec(ctx)

	if err != nil {
		return nil, err
	}

	var formattedUserSettings = UserSettings{
		Clipboard:        user.Settings().Clipboard,
		LongURLs:         user.Settings().LongURLs,
		ShortURLs:        user.Settings().ShortURLs,
		InstantDelete:    user.Settings().InstantDelete,
		Encrypted:        user.Settings().Encrypted,
		ImageEmbed:       user.Settings().ImageEmbed,
		Expiration:       user.Settings().Expiration,
		FontLignatures:   user.Settings().FontLignatures,
		FontSize:         user.Settings().FontSize,
		RenderWhitespace: user.Settings().RenderWhitespace,
		WordWrap:         user.Settings().WordWrap,
		TabSize:          user.Settings().TabSize,
		CreateGist:       user.Settings().CreateGist,
	}

	var discordId, _ = user.DiscordID()
	var gitHubAccess, _ = user.GithubAccess()
	var opt, _ = user.Opt()

	var formattedUser = User{
		ID:                       user.ID,
		UserID:                   user.UserID,
		Username:                 user.Username,
		Email:                    user.Email,
		Banned:                   user.Banned,
		Confirmed:                user.Confirmed,
		Icon:                     user.Icon,
		Password:                 user.Password,
		MemberPlus:               user.MemberPlus,
		DocumentsMade:            user.DocumentsMade,
		ActiveUnlimitedDocuments: user.ActiveUnlimitedDocuments,
		DiscordID:                &discordId,
		Admin:                    user.Admin,
		APIToken:                 user.APIToken,
		GithubAccess:             &gitHubAccess,
		Opt:                      &opt,
		UserSettingsID:           user.UserSettingsID,
		Settings:                 formattedUserSettings,
	}

	return &formattedUser, nil
}
