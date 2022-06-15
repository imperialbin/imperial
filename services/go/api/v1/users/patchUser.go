package users

import (
	"api/utils"
	"api/v1/commons"
	. "api/v1/commons"
	"encoding/json"

	"github.com/gofiber/fiber/v2"
)

type PatchUserRequest struct {
	Icon     *string `json:"icon"`
	Email    *string `json:"email"`
	Settings *struct {
		Clipboard        *bool `json:"clipboard"`
		LongURLS         *bool `json:"long_urls"`
		ShortURLs        *bool `json:"short_urls"`
		InstantDelete    *bool `json:"instant_delete"`
		Encrypted        *bool `json:"encrypted"`
		ImageEmbed       *bool `json:"image_embed"`
		Expiration       *int  `json:"expiration"`
		FontLignatures   *bool `json:"font_lignatures"`
		FontSize         *int  `json:"font_size"`
		RenderWhitespace *bool `json:"render_whitespace"`
		WordWrap         *bool `json:"word_wrap"`
		TabSize          *int  `json:"tab_size"`
		CreateGist       *bool `json:"create_gist"`
	} `json:"settings"`
}

func PatchUser(c *fiber.Ctx) error {
	user, err := utils.GetAuthedUser(c)

	if err != nil {
		return c.Status(404).JSON(commons.Response{
			Success: false,
			Message: "There was an error trying to find your user.",
		})
	}

	if user == nil {
		return c.Status(404).JSON(commons.Response{
			Success: false,
			Message: "There was an error trying to find your user.",
		})
	}

	req := new(PatchUserRequest)

	if err := c.BodyParser(req); err != nil {
		return c.Status(400).JSON(commons.Response{
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

	var newUser = *user
	marshalReq, _ := json.Marshal(req)
	json.Unmarshal(marshalReq, &newUser)

	/* fix this dumb shit */
	if result := client.Updates(&newUser); result.Error != nil {
		return c.Status(500).JSON(commons.Response{
			Success: false,
			Message: "An internal server error occurred",
		})
	}

	return c.JSON(Response{
		Success: true,
		Data: fiber.Map{
			"user": newUser,
		},
	})
}
