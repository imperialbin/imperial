package utils

import (
	"api/models"
	"log"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var globalDB *gorm.DB

func InitDB() *gorm.DB {
	var dbURL = os.Getenv("DATABASE_URL")

	db, err := gorm.Open(postgres.Open(dbURL), &gorm.Config{
		FullSaveAssociations: true,
		Logger: logger.New(
			log.New(os.Stdout, "\r\n", log.LstdFlags), // io writer
			logger.Config{
				SlowThreshold:             time.Second, // Slow SQL threshold
				LogLevel:                  logger.Info, // Log level
				Colorful:                  true,        // Disable color
			},
		),
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
		&models.Device{},
	)

	globalDB = db
	return db
}

func GetDB() *gorm.DB {
	return globalDB
}
