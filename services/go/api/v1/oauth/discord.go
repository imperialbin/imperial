package oauth

import (
	"api/prisma/db"
	. "api/utils"
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

func GetDiscord(c *fiber.Ctx) error {
	var clientID = os.Getenv("DISCORD_ID")
	var callbackURI = os.Getenv("DISCORD_CALLBACK")
	return c.Redirect(fmt.Sprintf("https://discord.com/api/oauth2/authorize?client_id=%s&redirect_uri=%s&response_type=code&scope=guilds.join identify guilds", clientID, callbackURI))
}

func GetCallbackDiscord(c *fiber.Ctx) error {
	var clientID = os.Getenv("DISCORD_ID")
	var clientSecret = os.Getenv("DISCORD_CLIENT_SECRET")
	var callbackURI = os.Getenv("DISCORD_CALLBACK")
	client := GetPrisma()
	ctx := context.Background()
	/*
		var botToken = os.Getenv("DISCORD_BOT_TOKEN")
		var guild = os.Getenv("DISCORD_GUILD")
		var roleMember = os.Getenv("DISCORD_ROLE_MEMBER")

	*/
	user, err := GetUser(c)
	var code = c.Query("code")

	if err != nil || strings.HasPrefix("IMPERIAL-", GetAuthToken(c)) {
		return c.Status(401).JSON(Response{
			Success: false,
			Message: "You are not authorized!",
		})
	}

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

	_, updateUserErr := client.User.FindUnique(
		db.User.ID.Equals(user.ID),
	).Update(
		db.User.DiscordID.Set(discordUser.ID),
	).Exec(ctx)

	if updateUserErr != nil {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "There was an error whilst enabling oauth on your account!",
		})
	}

	/*

		Join server
		joinServerJSON, _ := json.Marshal(map[string]string{
			"access_token": fmt.Sprint(token["json"]),
		})

		joinServerReq, err := http.NewRequest("PUT", fmt.Sprintf("https://discord.com/api/guilds/%s/members/%s", guild, discordUser.ID), bytes.NewBuffer(joinServerJSON))
		joinServerReq.Header.Set("Content-Type", "application/json")

		client.Do(joinServerReq)

		Set name
		setNameJSON, _ := json.Marshal(map[string]string{
			"nick": user.Username,
		})

		setNameReq, err := http.NewRequest("PATCH", fmt.Sprintf("https://discord.com/api/guilds/%s/members/%s", guild, discordUser.ID), bytes.NewBuffer(setNameJSON))
		setNameReq.Header.Set("Content-Type", "application/json")
		setNameReq.Header.Set("Authorization", fmt.Sprintf("Bot %s", botToken))

		client.Do(setNameReq)

		Give role
		giveRoleReq, err := http.NewRequest("PUT", fmt.Sprintf("https://discord.com/api/guilds/%s/members/%s/roles/%s", guild, discordUser.ID, roleMember), nil)
		giveRoleReq.Header.Set("Content-Type", "application/json")
		giveRoleReq.Header.Set("Authorization", fmt.Sprintf("Bot %s", botToken))

		client.Do(giveRoleReq)

		// work flow please run again
	*/

	return c.JSON(Response{
		Success: true,
		Message: "Successfully linked your discord account!",
	})
}
