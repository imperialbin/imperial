package user

import (
	"api/prisma/db"
	. "api/utils"
	. "api/v1/commons"
	"context"

	"github.com/gofiber/fiber/v2"
)

func FindUser(c *fiber.Ctx) error {
	var username = c.Params("username")
	client := GetPrisma()
	ctx := context.Background()

	user, err := client.User.FindUnique(
		db.User.Username.Equals(username),
	).Exec(ctx)

	if err != nil {
		return c.Status(404).JSON(Response{
			Success: false,
			Message: "We could not find that user!",
		})
	}

	return c.JSON(Response{
		Success: true,
		Data: &PublicUser{
			Username:   user.Username,
			Icon:       user.Icon,
			MemberPlus: user.MemberPlus,
			Banned:     user.Banned,
		},
	})
}
