package models

import "time"

type Document struct {
	ID               string           `json:"id" gorm:"index"`
	Content          string           `json:"content"`
	Creator          *uint            `json:"creator"`
	Gist             *string          `json:"gist_url" gorm:"default:null"`
	Views            int              `json:"views" gorm:"default:0"`
	CreatedAt        time.Time        `json:"created_at"`
	ExpiresAt        *time.Time       `json:"expires_at"`
	DocumentSettings DocumentSettings `json:"settings" gorm:"foreignKey:DocumentID;"`
}

type DocumentSettings struct {
	DocumentID    string   `json:"-" gorm:"primaryKey"`
	Language      string   `json:"language" gorm:"default:plaintext"`
	ImageEmbed    bool     `json:"image_embed" gorm:"default:false"`
	InstantDelete bool     `json:"instant_delete" gorm:"default:false"`
	Encrypted     bool     `json:"encrypted" gorm:"default:false"`
	Public        bool     `json:"public" gorm:"default:false"`
	Editors       []string `json:"editors" gorm:"type:string[]"`
}
