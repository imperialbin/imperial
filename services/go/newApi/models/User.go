package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	ID             uint   `json:"id" gorm:"primaryKey"`
	Username       string `json:"username"`
	Email          string `json:"email"`
	ConfirmedEmail bool   `json:"confirmed_email"`
	Password       string `json:"password"`
	DocumentsMade  int    `json:"documents_made"`
	Flags          int    `json:"flags"`
	GithubAccess   string
	UserSettingsID uint
	UserSettings   UserSettings `json:"settings" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}

type UserSettings struct {
	ID               uint
	Clipboard        bool `json:"clipboard"`
	LongUrls         bool `json:"long_urls"`
	ShortUrls        bool `json:"short_urls"`
	InstantDelete    bool `json:"instant_delete"`
	Encrypted        bool `json:"encrypted"`
	ImageEmbed       bool `json:"image_embed"`
	Expiration       int  `json:"expiration"`
	FontLignatures   bool `json:"font_lignatures"`
	FontSize         int  `json:"font_size"`
	RenderWhitespace bool `json:"render_whitespace"`
	WordWrap         bool `json:"word_wrap"`
	TabSize          int  `json:"tab_size"`
	CreateGist       bool `json:"create_gist"`
	UserID           uint
}

type UserPartial struct {
	DocumentID string `json:"-" gorm:"primaryKey"`
	UserID     uint   `json:"user_id"`
	Icon       string `json:"icon"`
	Flags      int    `json:"flags"`
}
