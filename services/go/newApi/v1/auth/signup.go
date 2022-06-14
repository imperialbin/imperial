package auth

import (
	"errors"
	"newapi/models"
	"newapi/utils"
	. "newapi/v1/commons"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func Signup(c *fiber.Ctx) error {
	req := new(SignupRequest)

	if err := c.BodyParser(req); err != nil {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "You have a type error in your request!",
		})
	}

	validationErrors := utils.ValidateRequest(*req)

	if validationErrors != nil {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "You have a validation error in your request.",
			Errors:  validationErrors,
		})
	}

	if req.Password != req.ConfirmPassword {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "Password does not match confirm password!",
		})
	}

	var client = utils.GetDB()
	var userWithEmail = true

	/* Check if user with email exists */
	if result := client.First(&models.User{}, "email = ?", req.Email); result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			userWithEmail = false
		}
	}

	if userWithEmail {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "User with this email already has an account!",
		})
	}

	/* Check if user with username exists */
	var userWithUsername = true
	if result := client.First(&models.User{}, "username = ?", req.Username); result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			userWithUsername = false
		}
	}

	if userWithUsername {
		return c.Status(400).JSON(Response{
			Success: false,
			Message: "Username has been taken!",
		})
	}

	hashedPassword, err := utils.HashPassword(req.Password)

	if err != nil {
		return c.Status(500).JSON(Response{
			Success: false,
			Message: "An internal server error occurred!",
		})
	}

	if result := client.Create(&models.User{
		Username:       req.Username,
		Email:          req.Email,
		ConfirmedEmail: false,
		Password:       hashedPassword,
		DocumentsMade:  0,
		Flags:          0,
		GithubOAuth:    nil,
		APIToken:       "IMPERIAL-" + uuid.NewString(),
		UserSettings: models.UserSettings{
			Clipboard:        false,
			LongUrls:         false,
			ShortUrls:        false,
			InstantDelete:    false,
			Encrypted:        false,
			ImageEmbed:       false,
			Expiration:       nil,
			FontLignatures:   false,
			FontSize:         14,
			RenderWhitespace: false,
			WordWrap:         false,
			TabSize:          2,
			CreateGist:       false,
		},
	}); result.Error != nil {
		return c.JSON(Response{
			Success: false,
			Message: result.Error.Error(),
		})
	}

	return c.JSON(Response{
		Success: true,
		Message: "Successfully created your account!",
		Data:    hashedPassword,
	})
}
