package oauth

import (
	"api/utils"
	. "api/v1/commons"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"strings"

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
		println(err.Error())
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "There was an error whilst enabling oauth on your account!",
		})
	}

	tokenRes, err := config.Client(context.Background(), token).Get("https://discord.com/api/users/@me")

	if err != nil {
		println(err.Error())
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "There was an error whilst enabling oauth on your account!",
		})
	}
	defer tokenRes.Body.Close()

	discordUser := struct {
		ID string `json:"id"`
	}{}

	body, err := ioutil.ReadAll(tokenRes.Body)

	if err != nil {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "There was an error whilst enabling oauth on your account!",
		})
	}

	json.Unmarshal(body, &discordUser)

	println(discordUser.ID) // we need to do this

	return c.JSON(Response{
		Success: true,
		Message: "Successfully linked your discord account!",
	})
}
