package auth

import (
	"api/models"
	"api/utils"
	. "api/v1/commons"
	"fmt"
	"time"

	"github.com/getsentry/sentry-go"
	"github.com/gofiber/fiber/v2"
)

func Login(c *fiber.Ctx) error {
	req := new(LoginRequest)

	if err := c.BodyParser(req); err != nil {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "You have a type error in your request!",
		})
	}

	errors := utils.ValidateRequest(*req)

	if errors != nil {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "You have a validation error in your request.",
			Errors:  errors,
		})
	}

	var client = utils.GetDB()
	var user = models.User{}

	if result := client.Where("username = ?", req.Username).Or("email = ?", req.Username).Find(&user); result.Error != nil {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "Username or password is incorrect!",
		})
	}

	if !utils.CheckHashedPassword(user.Password, req.Password) {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "Username or password is incorrect!",
		})
	}

	/* Generate session */
	token, err := utils.GenerateSessionToken()
	if err != nil {
		sentry.CaptureException(err)
		return c.Status(500).JSON(Response{
			Success: false,
			Message: "An internal server error occurred!",
		})
	}

	utils.RedisSet(token, fmt.Sprint(user.ID), 7)
	var device = models.Device{
		UserID:    user.ID,
		UserAgent: c.Get("User-Agent"),
		IP:        c.IP(),
		AuthToken: token,
	}

	if result := client.Create(&device); result.Error != nil {
		sentry.CaptureException(result.Error)
		return c.Status(500).JSON(Response{
			Success: false,
			Message: "An internal server error occurred",
		})
	}

	utils.SendEmail("NewLogin", user.Email, "{ }")

	cookie := fiber.Cookie{
		Name:     "IMPERIAL-AUTH",
		Value:    token,
		Expires:  time.Now().Add(time.Hour * 168),
		HTTPOnly: true,
		Secure:   false,
		SameSite: "None",
	}

	c.Cookie(&cookie)

	return c.JSON(Response{
		Success: true,
		Message: "Successfully logged in.",
		Data: fiber.Map{
			"token": token,
		},
	})
}
