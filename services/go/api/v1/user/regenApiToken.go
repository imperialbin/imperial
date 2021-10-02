package user

import (
	"api/prisma/db"
	. "api/utils"
	. "api/v1/commons"
	"context"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func RegenApiToken(c *fiber.Ctx) error {
	user, err := GetUser(c)
	if err != nil || strings.HasPrefix("IMPERIAL-", GetAuthToken(c)) {
		return c.Status(401).JSON(Response{
			Success: false,
			Message: "You are not authorized!",
		})
	}

	token := "IMPERIAL-" + uuid.NewString()
	client := GetPrisma()
	ctx := context.Background()

	RedisDel(user.APIToken)

	updatedUser, updatedUserErr := client.User.FindUnique(
		db.User.ID.Equals(user.ID),
	).Update(
		db.User.APIToken.Set(token),
	).Exec(ctx)

	if updatedUserErr != nil {
		return c.Status(500).JSON(Response{
			Success: false,
			Message: "An internal server error occurred!",
		})
	}

	RedisSet(updatedUser.APIToken, user.ID, 0)

	/* In the future dont make another request and instead just replace the old with the new */
	newUser, _ := GetUser(c)

	return c.JSON(Response{
		Success: true,
		Message: "Successfully regenerated your API token!",
		Data:    newUser,
	})
}
