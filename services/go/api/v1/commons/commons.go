package commons

import (
	"api/models"
	"time"
)

type PostDocumentResponse struct {
	ID               string                       `json:"id" gorm:"primaryKey"`
	Content          string                       `json:"content"`
	Password         string                       `json:"password,omitempty"`
	Creator          *models.UserPartial          `json:"creator"`
	GistURL          *string                      `json:"gist_url"`
	Views            int                          `json:"views"`
	EncryptedIv      *string                      `json:"encrypted_iv,omitempty"`
	Links            Links                        `json:"links"`
	Timestamps       Timestamps                   `json:"timestamps"`
	DocumentSettings PostDocumentSettingsResponse `json:"settings"`
}

type PostDocumentSettingsResponse struct {
	DocumentID    string                `json:"-" gorm:"primaryKey"`
	Language      string                `json:"language" gorm:"default:plaintext"`
	ImageEmbed    bool                  `json:"image_embed" gorm:"default:false"`
	InstantDelete bool                  `json:"instant_delete" gorm:"default:false"`
	Encrypted     bool                  `json:"encrypted" gorm:"default:false"`
	Public        bool                  `json:"public" gorm:"default:false"`
	Editors       *[]models.UserPartial `json:"editors"`
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
	Token           string `json:"token" validate:"required,min=32"`
	Password        string `json:"password" validate:"required,min=8"`
	ConfirmPassword string `json:"confirm_password" validate:"required,min=8"`
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
	FailedField string `json:"failed_field"`
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
	AvailableVersions []string `json:"available_versions"`
	Documentation     string   `json:"documentation"`
}
