package oauth

import (
	"fmt"
	. "newapi/v1/commons"
	"os"

	"github.com/gofiber/fiber/v2"
)

func GetDiscord(c *fiber.Ctx) error {
	var clientID = os.Getenv("DISCORD_ID")
	var callbackURI = os.Getenv("DISCORD_CALLBACK")
	return c.Redirect(fmt.Sprintf("https://discord.com/api/oauth2/authorize?client_id=%s&redirect_uri=%s&response_type=code&scope=guilds.join identify guilds", clientID, callbackURI))
}

func GetCallbackDiscord(c *fiber.Ctx) error {
	return c.JSON(Response{
		Success: true,
		Message: "Successfully linked your discord account!",
	})
}
