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
		user.Settings().Clipboard,
		user.Settings().LongURLs,
		user.Settings().ShortURLs,
		user.Settings().InstantDelete,
		user.Settings().Encrypted,
		user.Settings().ImageEmbed,
		user.Settings().Expiration,
		user.Settings().FontLignatures,
		user.Settings().FontSize,
		user.Settings().RenderWhitespace,
		user.Settings().WordWrap,
	}

	var discordId, _ = user.DiscordID()
	var gitHubAccess, _ = user.GithubAccess()
	var opt, _ = user.Opt()

	var formattedUser = User{
		user.ID,
		user.UserID,
		user.Username,
		user.Email,
		user.Banned,
		user.Confirmed,
		user.Icon,
		user.Password,
		user.MemberPlus,
		user.DocumentsMade,
		user.ActiveUnlimitedDocuments,
		&discordId,
		user.Admin,
		user.APIToken,
		&gitHubAccess,
		&opt,
		user.UserSettingsID,
		formattedUserSettings,
	}

	return &formattedUser, nil
}
