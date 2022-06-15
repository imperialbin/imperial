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
	GistURL                 *string             `json:"gist_url"`
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
	ID       string                      `json:"id" validate:"required"`
	Content  *string                     `json:"content"`
	Settings *EditDocumentSettingsStruct `json:"settings"`
}

type EditDocumentSettingsStruct struct {
	Language      *string   `json:"language" default:"plaintext"`
	Expiration    *int      `json:"expiration" default:"7"`
	ImageEmbed    *bool     `json:"image_embed"  default:"false"`
	InstantDelete *bool     `json:"instant_delete"  default:"false"`
	Public        *bool     `json:"public"  default:"false"`
	Editors       *[]string `json:"editors"  default:"[]"`
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

type Links struct {
	Raw       string `json:"raw"`
	Formatted string `json:"formatted"`
}

type Timestamps struct {
	Creation   time.Time  `json:"creation"`
	Expiration *time.Time `json:"expiration"`
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
