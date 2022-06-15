package v1

import (
	"api/v1/auth"
	. "api/v1/commons"
	"api/v1/document"
	"api/v1/oauth"
	"api/v1/users"

	"github.com/gofiber/fiber/v2"
)

func Introduction(c *fiber.Ctx) error {
	return c.JSON(VersionResponse{
		Success:       true,
		Message:       "Welcome to IMPERIAL's API!",
		Version:       1,
		Documentation: "https://docs.imperialb.in/",
	})
}

func InvalidRoute(c *fiber.Ctx) error {
	return c.Status(404).JSON(Response{
		Success: false,
		Message: c.Path() + " isn't a valid route!",
	})
}

/* Document things */

func GetDocument(c *fiber.Ctx) error {
	return document.Get(c)
}

func PostDocument(c *fiber.Ctx) error {
	return document.Post(c)
}

func PatchDocument(c *fiber.Ctx) error {
	return document.PatchDocument(c)
}

func DeleteDocument(c *fiber.Ctx) error {
	return document.Delete(c)
}

/* Auth things */

func PostLogin(c *fiber.Ctx) error {
	return auth.Login(c)
}

func PostSignup(c *fiber.Ctx) error {
	return auth.Signup(c)
}

func PostRequestResetPassword(c *fiber.Ctx) error {
	return auth.RequestResetPassword(c)
}

func PostResetPassword(c *fiber.Ctx) error {
	return auth.ResetPassword(c)
}

func DeleteLogout(c *fiber.Ctx) error {
	return auth.Logout(c)
}

/* User things */

func GetMe(c *fiber.Ctx) error {
	return users.Me(c)
}

func PatchMe(c *fiber.Ctx) error {
	return users.PatchUser(c)
}

func PostRegenAPIToken(c *fiber.Ctx) error {
	return users.RegenAPIToken(c)
}

func DeleteMe(c *fiber.Ctx) error {
	return users.DeleteMe(c)
}

func GetUser(c *fiber.Ctx) error {
	return users.FindUser(c)
}

/* OAuth */

func GetDiscordOAuth(c *fiber.Ctx) error {
	return oauth.GetDiscordOAuth(c)
}

func GetDiscordOAuthCallback(c *fiber.Ctx) error {
	return oauth.GetDiscordOAuthCallback(c)
}

func GetGitHubOAuth(c *fiber.Ctx) error {
	return oauth.GetGitHubOAuth(c)
}

func GetGitHubOAuthCallback(c *fiber.Ctx) error {
	return oauth.GetGitHubOAuthCallback(c)
}
