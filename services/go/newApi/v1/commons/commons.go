package commons

import (
	"newapi/models"
	"time"
)

type PostDocumentResponse struct {
	ID                      string              `json:"id" gorm:"primaryKey"`
	Content                 string              `json:"content"`
	Password                string              `json:"password,omitempty"`
	Creator                 *models.UserPartial `json:"creator"`
	Gist                    *string             `json:"gist"`
	Views                   int                 `json:"views"`
	EncryptedIv             *string             `json:"encrypted_iv,omitempty"`
	Links                   `json:"links"`
	Timestamps              `json:"timestamps"`
	models.DocumentSettings `json:"settings"`
}

type SignupRequest struct {
	Username        string `json:"username" validate:"required,min=3,max=24,alpha"`
	Email           string `json:"email" validate:"required,min=3,email"`
	Password        string `json:"password" validate:"required,min=8"`
	ConfirmPassword string `json:"confirm_password" validate:"required,min=8"`
}

type LoginRequest struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required,min=8"`
}

type RequestResetPasswordStruct struct {
	Email string `json:"email" validate:"required,email"`
}

type ResetPasswordStruct struct {
	Token           string `json:"token" validate:"required,min=16"`
	Password        string `json:"password" validate:"required,min=8"`
	ConfirmPassword string `json:"confirmPassword" validate:"required,min=8"`
}
type ResetPasswordInClientStruct struct {
	CurrentPassword string `json:"currentPassword" validate:"required,min=8"`
	NewPassword     string `json:"newPassword" validate:"required,min=8"`
	ConfirmPassword string `json:"confirmPassword" validate:"required,min=8"`
}

type DeleteAccount struct {
	Password        string `json:"password" validate:"required,min=8"`
	ConfirmPassword string `json:"confirmPassword" validate:"required,min=8"`
}

type EditDocument struct {
	ID       string                     `json:"id" validate:"required"`
	Content  *string                    `json:"content"`
	Settings EditDocumentSettingsStruct `json:"settings"`
}

type EditDocumentSettingsStruct struct {
	Language      *string   `json:"language"`
	Expiration    *int      `json:"expiration"`
	ImageEmbed    *bool     `json:"imageEmbed"`
	InstantDelete *bool     `json:"instantDelete"`
	Encrypted     *bool     `json:"encrypted"`
	Password      *string   `json:"password"`
	Public        *bool     `json:"public"`
	Editors       *[]string `json:"editors"`
}

type EditUserSettings struct {
	Clipboard        *bool `json:"clipboard"`
	LongURLs         *bool `json:"longUrls"`
	ShortURLs        *bool `json:"shortUrls"`
	InstantDelete    *bool `json:"instantDelete"`
	Encrypted        *bool `json:"encrypted"`
	ImageEmbed       *bool `json:"imageEmbed"`
	Expiration       *int  `json:"expiration"`
	FontLignatures   *bool `json:"fontLignatures"`
	FontSize         *int  `json:"fontSize"`
	RenderWhitespace *bool `json:"renderWhitespace"`
	WordWrap         *bool `json:"wordWrap"`
	TabSize          *int  `json:"tabSize"`
}

type ErrorResponse struct {
	FailedField string `json:"failedField"`
	Tag         string
	Value       string
}
type DocumentSettingsStruct struct {
	Language      string   `json:"language" default:"plaintext"`
	Expiration    int      `json:"expiration" default:"7"`
	ShortURLs     bool     `json:"short_urls"  default:"false"`
	LongURLs      bool     `json:"long_urls"  default:"false"`
	ImageEmbed    bool     `json:"image_embed"  default:"false"`
	InstantDelete bool     `json:"instant_delete"  default:"false"`
	Encrypted     bool     `json:"encrypted"  default:"false"`
	Password      string   `json:"password"  default:""`
	Public        bool     `json:"public"  default:"false"`
	Editors       []string `json:"editors"  default:"[]"`
	CreateGist    bool     `json:"create_gist"  default:"false"`
}

type User struct {
	ID                       string       `json:"id"`
	UserID                   int          `json:"userId"`
	Username                 string       `json:"username"`
	Email                    string       `json:"email"`
	Banned                   bool         `json:"banned"`
	Confirmed                bool         `json:"confirmed"`
	Icon                     string       `json:"icon"`
	Password                 string       `json:"-"`
	MemberPlus               bool         `json:"memberPlus"`
	DocumentsMade            int          `json:"documentsMade"`
	ActiveUnlimitedDocuments int          `json:"activeUnlimitedDocuments"`
	DiscordID                *string      `json:"discordId"`
	Admin                    bool         `json:"admin"`
	APIToken                 string       `json:"apiToken"`
	GithubAccess             *string      `json:"githubAccess"`
	Opt                      *string      `json:"opt"`
	UserSettingsID           string       `json:"-"`
	Settings                 UserSettings `json:"settings"`
}

type PublicUser struct {
	Username   string `json:"username"`
	Icon       string `json:"icon"`
	MemberPlus bool   `json:"memberPlus"`
	Banned     bool   `json:"banned"`
}

type UserSettings struct {
	Clipboard        bool `json:"clipboard"`
	LongURLs         bool `json:"longUrls"`
	ShortURLs        bool `json:"shortUrls"`
	InstantDelete    bool `json:"instantDelete"`
	Encrypted        bool `json:"encrypted"`
	ImageEmbed       bool `json:"imageEmbed"`
	Expiration       int  `json:"expiration"`
	FontLignatures   bool `json:"fontLignatures"`
	FontSize         int  `json:"fontSize"`
	RenderWhitespace bool `json:"renderWhitespace"`
	WordWrap         bool `json:"wordWrap"`
	TabSize          int  `json:"tabSize"`
	CreateGist       bool `json:"createGist"`
}

type Links struct {
	Raw       string `json:"raw"`
	Formatted string `json:"formatted"`
}

type Timestamps struct {
	Creation   time.Time  `json:"creation"`
	Expiration *time.Time `json:"expiration"`
}

type CreatedDocumentSettingsStruct struct {
	Language      string   `json:"language"`
	ImageEmbed    bool     `json:"imageEmbed"`
	InstantDelete bool     `json:"instantDelete"`
	Encrypted     bool     `json:"encrypted"`
	Password      *string  `json:"password,omitempty"`
	Public        bool     `json:"public"`
	Editors       []string `json:"editors"`
}
type CreateDocumentData struct {
	ID         string                        `json:"id"`
	Content    string                        `json:"content"`
	Creator    string                        `json:"creator,omitempty"`
	Views      int                           `json:"views"`
	Links      Links                         `json:"links"`
	Timestamps Timestamps                    `json:"timestamps"`
	Gist       string                        `json:"gistURL,omitempty"`
	Settings   CreatedDocumentSettingsStruct `json:"settings"`
}

type CreateResponseStruct struct {
	Success bool               `json:"success"`
	Data    CreateDocumentData `json:"data"`
}

type DocumentStruct struct {
	Content  string                 `json:"content"`
	Settings DocumentSettingsStruct `json:"settings" default:"{}"`
}

type Response struct {
	Success bool             `json:"success"`
	Message string           `json:"message,omitempty"`
	Data    interface{}      `json:"data,omitempty"`
	Errors  []*ErrorResponse `json:"errors,omitempty"`
}

type VersionResponse struct {
	Success       bool   `json:"success"`
	Message       string `json:"message"`
	Version       int    `json:"version"`
	Documentation string `json:"documentation"`
}

type BaseResponse struct {
	Success           bool     `json:"success"`
	Message           string   `json:"message"`
	AvailableVersions []string `json:"availableVersions"`
	Documentation     string   `json:"documentation"`
}
