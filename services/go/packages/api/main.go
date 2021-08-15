package main

import (
	middleware "api/middleware"
	"api/prisma/db"
	"api/utils"
	v1 "api/v1"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
)

func setupRoutes(app *fiber.App) {

	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(&fiber.Map{
			"success":           true,
			"message":           "You have reached IMPERIAL's API!",
			"availableVersions": [1]string{"/v1"},
			"documentation":     "https://docs.imperialb.in/",
		})
	})

	/* VERSION 1 API */

	app.Get("/v1", v1.Introduction)

	/* Authentication */
	app.Post("/v1/auth/login", middleware.CheckNotAuthenticated, v1.PostLogin)
	app.Post("/v1/auth/signup", middleware.CheckNotAuthenticated, v1.PostSignup)
	app.Delete("/v1/auth/logout", middleware.CheckAuthenticated, v1.DeleteLogout)

	/* @me */
	app.Get("/v1/@me", middleware.CheckAuthenticated, v1.GetMe)

	/* Documents */
	app.Get("/v1/document/:id", v1.GetDocument)
	app.Post("/v1/document", v1.PostDocument)
	app.Patch("/v1/document", v1.PatchDocument)
	app.Delete("/v1/document/:id", v1.DeleteDocument)
}

func main() {
	godotenv.Load()

	app := fiber.New(fiber.Config{
		CaseSensitive: false,
		StrictRouting: true,
		ServerHeader:  "IMPERIAL API",
		AppName:       "IMPERIAL API v1.0",
		BodyLimit:     0.5 * 1024 * 1024,
	})

	app.Use(logger.New())

	setupRoutes(app)

	if utils.GetPrisma() == nil {
		utils.SetGlobalDb(db.NewClient())
	}

	if utils.GetRedisDB() == nil {
		utils.SetRedisDB()
	}

	if err := utils.GetPrisma().Connect(); err != nil {
		panic(err)
	}

	defer func() {
		if err := utils.GetPrisma().Disconnect(); err != nil {
			panic(err)
		}
	}()

	app.Listen(":3000")
}
