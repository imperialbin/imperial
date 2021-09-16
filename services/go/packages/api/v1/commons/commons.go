package commons

import "github.com/guregu/null"

type ChangeIconStruct struct {
	Method string `json:"method" validate:"required"`
	URL    string `json:"url" validate:"required"`
}
type SignupRequest struct {
	Username        string `json:"username" validate:"required,min=3,max=24"`
	Email           string `json:"email" validate:"required,min=3"`
	Password        string `json:"password" validate:"required,min=8"`
	ConfirmPassword string `json:"confirmPassword" validate:"required,min=8"`
}

type LoginRequest struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type RequestResetPasswordStruct struct {
	Email string `json:"email" validate:"required"`
}

type ResetPasswordStruct struct {
	Token           string `json:"token" validate:"required"`
	Password        string `json:"password" validate:"required"`
	ConfirmPassword string `json:"confirmPassword" validate:"required"`
}

type DeleteAccount struct {
	Password        string `json:"password", validate:"required"`
	ConfirmPassword string `json:"confirmPassword", validate:"required"`
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
	Password      *string  `json:"password"`
	Public        bool     `json:"public"`
	Editors       []string `json:"editors"`
}
type CreateDocumentData struct {
	ID         string                        `json:"id"`
	Content    string                        `json:"content"`
	Creator    string                        `json:"creator"`
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
