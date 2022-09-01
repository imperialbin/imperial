package utils

import (
	"api/models"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var globalDB *gorm.DB

func InitDB() *gorm.DB {
	var dbURL = os.Getenv("DATABASE_URL")

	time.Sleep(150 * time.Millisecond)

	db, err := gorm.Open(postgres.Open(dbURL), &gorm.Config{
		FullSaveAssociations: true,
	})

	if err != nil {
		println(err)
		return nil
	}

	db.AutoMigrate(
		&models.User{},
		&models.UserSettings{},
		&models.DiscordUser{},
		&models.GitHubUser{},
		&models.Document{},
		&models.DocumentSettings{},
	)

	globalDB = db
	return db
}

func GetDB() *gorm.DB {
	return globalDB
}
