package models

import (
	"time"
)

type Device struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	UserID    uint      `json:"user_id"`
	UserAgent string    `json:"user_agent"`
	IP        string    `json:"ip"`
	AuthToken string    `json:"-"`
	CreatedAt time.Time `json:"created_at"`
}
