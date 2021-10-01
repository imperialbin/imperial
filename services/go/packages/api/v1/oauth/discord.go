package oauth

import (
	. "api/utils"
	. "api/v1/commons"
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
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
	var botToken = os.Getenv("DISCORD_BOT_TOKEN")
	var guild = os.Getenv("DISCORD_GUILD")
	var roleMember = os.Getenv("DISCORD_ROLE_MEMBER")

	user, err := GetUser(c)
	var code = c.Query("code")
	if err != nil || strings.HasPrefix("IMPERIAL-", GetAuthToken(c)) {
		return c.Status(401).JSON(Response{
			Success: false,
			Message: "You are not authorized!",
		})
	}

	client := http.Client{}

	/* Check valid token */
	getTokenJSON, _ := json.Marshal(map[string]string{
		"client_id":     clientID,
		"client_secret": clientSecret,
		"grant_type":    "authorization_code",
		"code":          code,
		"redirect_uri":  callbackURI,
		"scope":         "identify guilds guilds.join",
	})

	tokenReq, err := http.NewRequest("POST", "https://discord.com/api/oauth2/token", bytes.NewBuffer(getTokenJSON))
	tokenReq.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	tokenRes, err := client.Do(tokenReq)

	var token map[string]interface{}
	json.NewDecoder(tokenRes.Body).Decode(&token)

	if err != nil {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "There was an error whilst enabling oauth on your account!",
		})
	}

	fmt.Sprintln("token: %s", token)

	/* Get user info */

	discordUserReq, err := http.NewRequest("GET", "https://discord.com/api/users/@me", nil)
	discordUserReq.Header.Add("Authorization", fmt.Sprintf("%s", token))

	discordUserRes, err := client.Do(tokenReq)

	var discordUser struct {
		ID string `json:"id"`
	}
	parsed, _ := ioutil.ReadAll(discordUserRes.Body)
	json.Unmarshal(parsed, &discordUser)

	if err != nil {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "There was an error whilst enabling oauth on your account!",
		})
	}

	println(string(parsed))
	println(string(discordUser.ID))

	/* Join server */
	joinServerJSON, _ := json.Marshal(map[string]string{
		"access_token": fmt.Sprint(token["json"]),
	})

	joinServerReq, err := http.NewRequest("PUT", fmt.Sprintf("https://discord.com/api/guilds/%s/members/%s", guild, discordUser.ID), bytes.NewBuffer(joinServerJSON))
	joinServerReq.Header.Set("Content-Type", "application/json")

	client.Do(joinServerReq)

	/* Set name */
	setNameJSON, _ := json.Marshal(map[string]string{
		"nick": user.Username,
	})

	setNameReq, err := http.NewRequest("PATCH", fmt.Sprintf("https://discord.com/api/guilds/%s/members/%s", guild, discordUser.ID), bytes.NewBuffer(setNameJSON))
	setNameReq.Header.Set("Content-Type", "application/json")
	setNameReq.Header.Set("Authorization", fmt.Sprintf("Bot %s", botToken))

	client.Do(setNameReq)

	/* Give role */
	giveRoleReq, err := http.NewRequest("PUT", fmt.Sprintf("https://discord.com/api/guilds/%s/members/%s/roles/%s", guild, discordUser.ID, roleMember), nil)
	giveRoleReq.Header.Set("Content-Type", "application/json")
	giveRoleReq.Header.Set("Authorization", fmt.Sprintf("Bot %s", botToken))

	client.Do(giveRoleReq)

	return c.Redirect("/")
}
