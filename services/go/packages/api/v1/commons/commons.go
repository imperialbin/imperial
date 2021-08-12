package commons

import "github.com/guregu/null"

type SignupRequest struct {
	Username        string `json:"username" validate:"required,min=3,max=24"`
	Email           string `json:"email" validate:"required,min=3"`
	Password        string `json:"password" validate:"required,min=8"`
	ConfirmPassword string `json:"confirmPassword" validate:"required,min=8"`
}

type ErrorResponse struct {
	FailedField string `json:"failedField"`
	Tag         string
	Value       string
}
type DocumentSettingsStruct struct {
	Language      null.String `json:"language"`
	Expiration    null.Int    `json:"expiration"`
	ShortURLs     null.Bool   `json:"shortUrls"`
	LongURLs      null.Bool   `json:"longUrls"`
	ImageEmbed    null.Bool   `json:"imageEmbed"`
	InstantDelete null.Bool   `json:"instantDelete"`
	Encrypted     null.Bool   `json:"encrypted"`
	Password      null.String `json:"password"`
	Public        null.Bool   `json:"public"`
	Editors       []string    `json:"editors"`
}

type Links struct {
	Raw       string `json:"raw"`
	Formatted string `json:"formatted"`
}

type Timestamps struct {
	Creation   int64 `json:"creation"`
	Expiration int64 `json:"expiration"`
}
type CreatedDocumentSettingsStruct struct {
	Language      string   `json:"language"`
	ImageEmbed    bool     `json:"imageEmbed"`
	InstantDelete bool     `json:"instantDelete"`
	Encrypted     bool     `json:"encrypted"`
	Password      string   `json:"password"`
	Public        bool     `json:"public"`
	Editors       []string `json:"editors"`
}
type CreateDocumentData struct {
	Id         string                        `json:"id"`
	Content    string                        `json:"content"`
	Views      int                           `json:"views"`
	Links      Links                         `json:"links"`
	Timestamps Timestamps                    `json:"timestamps"`
	Settings   CreatedDocumentSettingsStruct `json:"settings"`
}

type CreateResponseStruct struct {
	Success bool               `json:"success"`
	Data    CreateDocumentData `json:"data"`
}

type DocumentStruct struct {
	Content  string                 `json:"content"`
	Settings DocumentSettingsStruct `json:"settings"`
}
