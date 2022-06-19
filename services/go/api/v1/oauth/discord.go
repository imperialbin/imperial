package oauth

import (
	"api/models"
	"api/utils"
	. "api/v1/commons"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"strings"

	"github.com/getsentry/sentry-go"
	"github.com/gofiber/fiber/v2"
	"github.com/ravener/discord-oauth2"
	"golang.org/x/oauth2"
)

func GetDiscordOAuth(c *fiber.Ctx) error {
	var clientID = os.Getenv("DISCORD_CLIENT_ID")
	var callbackURI = os.Getenv("DISCORD_CALLBACK")
	return c.Redirect(fmt.Sprintf("https://discord.com/api/oauth2/authorize?client_id=%s&redirect_uri=%s&response_type=code&scope=guilds.join identify guilds", clientID, callbackURI))
}

func GetDiscordOAuthCallback(c *fiber.Ctx) error {
	var clientID = os.Getenv("DISCORD_CLIENT_ID")
	var clientSecret = os.Getenv("DISCORD_CLIENT_SECRET")
	var callbackURI = os.Getenv("DISCORD_CALLBACK")

	user, err := utils.GetAuthedUser(c)

	if err != nil || user == nil || strings.HasPrefix("IMPERIAL-", utils.GetAuthToken(c)) {
		return c.Status(401).JSON(Response{
			Success: false,
			Message: "You are not authorized!",
		})
	}

	var code = c.Query("code")
	config := &oauth2.Config{
		Endpoint:     discord.Endpoint,
		Scopes:       []string{discord.ScopeIdentify, discord.ScopeGuilds, discord.ScopeGuildsJoin},
		RedirectURL:  callbackURI,
		ClientID:     clientID,
		ClientSecret: clientSecret,
	}

	token, err := config.Exchange(context.Background(), code)

	if err != nil {
		sentry.CaptureException(err)
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "There was an error whilst enabling oauth on your account!",
		})
	}

	tokenRes, err := config.Client(context.Background(), token).Get("https://discord.com/api/users/@me")

	if err != nil {
		sentry.CaptureException(err)

		return c.Status(400).JSON(Response{
			Success: false,
			Message: "There was an error whilst enabling oauth on your account!",
		})
	}
	defer tokenRes.Body.Close()

	body, err := ioutil.ReadAll(tokenRes.Body)
	if err != nil {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "There was an error whilst enabling oauth on your account!",
		})
	}

	var discordUser models.DiscordUser
	json.Unmarshal(body, &discordUser)

	user.Discord = &discordUser

	client := utils.GetDB()
	if result := client.Updates(&user); result.Error != nil {
		sentry.CaptureException(result.Error)

		return c.JSON(Response{
			Success: false,
			Message: "An error occurred whilst updating your user.",
		})
	}

	return c.JSON(Response{
		Success: true,
		Message: "yo",
		Data:    discordUser,
	})
}
