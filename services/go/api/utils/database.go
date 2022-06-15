package utils

import (
	"api/models"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var globalDB *gorm.DB

func InitDB() *gorm.DB {
	var dbURL = os.Getenv("DATABASE_URL")

	db, err := gorm.Open(postgres.Open(dbURL), &gorm.Config{
		FullSaveAssociations: true,
	})

	if err != nil {
		log.Fatalln(err)
	}

	db.AutoMigrate(&models.User{}, &models.UserSettings{}, &models.Document{}, &models.DocumentSettings{})

	globalDB = db
	return db
}

func GetDB() *gorm.DB {
	return globalDB
}
