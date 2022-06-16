package models

type User struct {
	ID             uint         `json:"id" gorm:"primaryKey"`
	Username       string       `json:"username"`
	Email          string       `json:"email"`
	Icon           *string      `json:"icon" gorm:"default:null"`
	ConfirmedEmail bool         `json:"confirmed_email"`
	Password       string       `json:"-"`
	DocumentsMade  int          `json:"documents_made" gorm:"default:0"`
	Flags          int          `json:"flags" gorm:"default:1"`
	GithubOAuth    *string      `json:"github_oauth"`
	APIToken       string       `json:"api_token"`
	Banned         bool         `json:"banned" gorm:"default:false"`
	UserSettings   UserSettings `json:"settings" gorm:"foreignKey:UserID;"`
}

type UserSettings struct {
	UserID           uint `json:"-" gorm:"primaryKey"`
	Clipboard        bool `json:"clipboard" gorm:"default:false"`
	LongUrls         bool `json:"long_urls" gorm:"default:false"`
	ShortUrls        bool `json:"short_urls" gorm:"default:false"`
	InstantDelete    bool `json:"instant_delete" gorm:"default:false"`
	Encrypted        bool `json:"encrypted" gorm:"default:false"`
	ImageEmbed       bool `json:"image_embed" gorm:"default:false"`
	Expiration       *int `json:"expiration"  gorm:"default:null"`
	FontLigatures    bool `json:"font_ligatures" gorm:"default:false"`
	FontSize         int  `json:"font_size"  gorm:"default:12"`
	RenderWhitespace bool `json:"render_whitespace" gorm:"default:false"`
	WordWrap         bool `json:"word_wrap" gorm:"default:false"`
	TabSize          int  `json:"tab_size"  gorm:"default:2"`
	CreateGist       bool `json:"create_gist" gorm:"default:false"`
}

type UserPartial struct {
	DocumentID    string  `json:"-" gorm:"primaryKey"`
	UserID        uint    `json:"id"`
	Username      string  `json:"username"`
	DocumentsMade int     `json:"documents_made"`
	Icon          *string `json:"icon"`
	Flags         int     `json:"flags"`
}
