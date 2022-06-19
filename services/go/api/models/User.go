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
	APIToken       string       `json:"api_token"`
	Banned         bool         `json:"banned" gorm:"default:false"`
	GitHub         *GitHubUser  `json:"github" gorm:"foreignKey:UserID;default:null;"`
	Discord        *DiscordUser `json:"discord" gorm:"foreignKey:UserID;default:null;"`
	UserSettings   UserSettings `json:"settings" gorm:"foreignKey:UserID;"`
}

type UserSettings struct {
	UserID           uint  `json:"-" gorm:"primaryKey"`
	Clipboard        bool  `json:"clipboard" gorm:"default:false"`
	LongUrls         bool  `json:"long_urls" gorm:"default:false"`
	ShortUrls        bool  `json:"short_urls" gorm:"default:false"`
	InstantDelete    bool  `json:"instant_delete" gorm:"default:false"`
	Encrypted        bool  `json:"encrypted" gorm:"default:false"`
	ImageEmbed       bool  `json:"image_embed" gorm:"default:false"`
	Expiration       *int8 `json:"expiration"  gorm:"default:null"`
	FontLigatures    bool  `json:"font_ligatures" gorm:"default:false"`
	FontSize         int8  `json:"font_size"  gorm:"default:12"`
	RenderWhitespace bool  `json:"render_whitespace" gorm:"default:false"`
	WordWrap         bool  `json:"word_wrap" gorm:"default:false"`
	TabSize          int8  `json:"tab_size"  gorm:"default:2"`
	CreateGist       bool  `json:"create_gist" gorm:"default:false"`
}

type DiscordUser struct {
	UserID           uint    `json:"-" gorm:"primaryKey"`
	ID               string  `json:"id"`
	Username         string  `json:"username"`
	Avatar           *string `json:"avatar"`
	AvatarDecoration *string `json:"avatar_decoration"`
	Discriminator    string  `json:"discriminator"`
	PublicFlags      int     `json:"public_flags"`
	Flags            int     `json:"flags"`
	Banner           *string `json:"banner"`
	BannerColor      *string `json:"banner_color"`
	AccentColor      *string `json:"accent_color"`
	Locale           string  `json:"locale"`
	MFAEnabled       bool    `json:"mfa_enabled"`
	PremiumType      *int8   `json:"premium_type"`
}

type GitHubUser struct {
	UserID                  uint    `json:"-" gorm:"primaryKey"`
	Login                   string  `json:"login"`
	ID                      int     `json:"id"`
	AvatarURL               string  `json:"avatar_url"`
	GravatarID              string  `json:"gravatar_id"`
	Type                    string  `json:"type"`
	Name                    *string `json:"name"`
	Location                *string `json:"location"`
	Email                   *string `json:"email"`
	Hireable                *bool   `json:"hireable"`
	Bio                     *string `json:"bio"`
	TwitterUsername         *string `json:"twitter_username"`
	PublicGists             int     `json:"public_gists"`
	PrivateGists            int     `json:"private_gists"`
	TwoFactorAuthentication bool    `json:"two_factor_authentication"`
	OAuthToken              string  `json:"-"`
}

type UserPartial struct {
	DocumentID    string  `json:"-" gorm:"primaryKey"`
	UserID        uint    `json:"id"`
	Username      string  `json:"username"`
	DocumentsMade int     `json:"documents_made"`
	Icon          *string `json:"icon"`
	Flags         int     `json:"flags"`
}
