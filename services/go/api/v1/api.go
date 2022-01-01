package v1

import (
	"api/v1/admin"
	"api/v1/auth"
	. "api/v1/commons"
	"api/v1/document"
	"api/v1/oauth"
	"api/v1/user"

	"github.com/gofiber/fiber/v2"
)
// why did this fail to build
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
	return document.Edit(c)
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

func PatchResetPasswordInClient(c *fiber.Ctx) error {
	return auth.ResetPasswordInClient(c)
}

func DeleteLogout(c *fiber.Ctx) error {
	return auth.Logout(c)
}

/* User things */

func GetMe(c *fiber.Ctx) error {
	return user.Me(c)
}

func PatchMe(c *fiber.Ctx) error {
	return user.EditMe(c)
}

func PatchEmail(c *fiber.Ctx) error {
	return user.ChangeEmail(c)
}

func PostRegenAPIToken(c *fiber.Ctx) error {
	return user.RegenApiToken(c)
}

func DeleteMe(c *fiber.Ctx) error {
	return user.DeleteMe(c)
}

func GetUser(c *fiber.Ctx) error {
	return user.FindUser(c)
}

func PatchIcon(c *fiber.Ctx) error {
	return user.ChangeIcon(c)
}

func GetUserDocuments(c *fiber.Ctx) error {
	return user.GetRecentDocuments(c)
}

/* Admin stuff */

func GetAdmin(c *fiber.Ctx) error {
	return c.JSON(VersionResponse{
		Success: true,
		Message: "Welcome to IMPERIAL's Admin API!",
		Version: 1,
	})
}

func PostBanUser(c *fiber.Ctx) error {
	return admin.BanUser(c)
}

/* OAuth */

func GetDiscord(c *fiber.Ctx) error {
	return oauth.GetDiscord(c)
}

func GetDiscordCallback(c *fiber.Ctx) error {
	return oauth.GetCallbackDiscord(c)
}
