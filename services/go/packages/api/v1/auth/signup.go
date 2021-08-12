package auth

import (
	. "api/utils"
	. "api/v1/commons"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func Signup(c *fiber.Ctx) error {
	req := new(SignupRequest)

	if err := c.BodyParser(req); err != nil {
		return c.JSON(&fiber.Map{
			"success": false,
			"message": "You have a type error in your request!",
		})
	}

	errors := ValidateRequest(*req)

	if errors != nil {
		return c.Status(400).JSON(&fiber.Map{
			"success": false,
			"message": "You have a validation error in your request",
			"errors":  errors,
		})
	}

	if req.Password != req.ConfirmPassword {
		return c.Status(400).JSON(&fiber.Map{
			"success": false,
			"message": "Password does not match confirm password!",
		})
	}

	hashedPassword, err := HashPassword(req.Password)

	if err != nil {
		return c.Status(500).JSON(&fiber.Map{
			"success": false,
			"message": "There was an internal server error while fulfilling your request",
		})
	}

	fmt.Printf(hashedPassword)

	return c.JSON(&fiber.Map{
		"success": true,
		"message": "Successfully created your account!",
	})
}
