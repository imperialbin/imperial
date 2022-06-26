package auth

import (
	"api/utils"
	. "api/v1/commons"

	"github.com/getsentry/sentry-go"
	"github.com/gofiber/fiber/v2"
)

func ResetPassword(c *fiber.Ctx) error {
	req := new(ResetPasswordStruct)

	if err := c.BodyParser(req); err != nil {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "You have a type error in your request!",
		})
	}

	reqErrors := utils.ValidateRequest(*req)

	if reqErrors != nil {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "You have a validation error in your request.",
			Errors:  reqErrors,
		})
	}

	user, err := utils.GetAuthedUser(c)
	if err != nil {
		sentry.CaptureException(err)

		return c.Status(500).JSON(Response{
			Success: false,
			Message: "An error occurred whilst getting your user",
		})
	}

	if req.Password != req.ConfirmPassword {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "Your passwords do not match",
		})
	}

	hashedPassword, err := utils.HashPassword(req.Password)

	if err != nil {
		sentry.CaptureException(err)

		return c.Status(500).JSON(Response{
			Success: false,
			Message: "An internal error occurred whilst resetting your password.",
		})
	}

	var client = utils.GetDB()
	if result := client.Model(&user).Update("password = ?", hashedPassword); result.Error != nil {
		sentry.CaptureException(result.Error)

		return c.Status(500).JSON(Response{
			Success: false,
			Message: "An internal error occurred",
		})
	}

	return c.JSON(Response{
		Success: true,
		Message: "Successfully reset your password!",
	})
}
