package v1

import (
	"api/v1/admin"
	"api/v1/auth"
	. "api/v1/commons"
	"api/v1/document"
	"api/v1/user"

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

func PostLogin(c *fiber.Ctx) error {
	return auth.Login(c)
}

func PostSignup(c *fiber.Ctx) error {
	return auth.Signup(c)
}

func DeleteLogout(c *fiber.Ctx) error {
	return auth.Logout(c)
}

func GetMe(c *fiber.Ctx) error {
	return user.Me(c)
}

func GetUser(c *fiber.Ctx) error {
	return user.FindUser(c)
}

/* Admin stuff */

func GetAdmin(c *fiber.Ctx) error {
	return c.JSON(VersionResponse{
		Success:       true,
		Message:       "Welcome to IMPERIAL's Admin API!",
		Version:       1,
	})
}

func PostBanUser(c *fiber.Ctx) error {
	return admin.BanUser(c)
}
