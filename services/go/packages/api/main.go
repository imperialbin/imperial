package main

import (
	"api/middleware"
	"api/prisma/db"
	. "api/utils"
	v1 "api/v1"
	. "api/v1/commons"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
)

func setupRoutes(app *fiber.App) {

	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(BaseResponse{
			Success:           true,
			Message:           "You have reached IMPERIAL's API!",
			AvailableVersions: []string{"/v1"},
			Documentation:     "https://docs.imperialb.in/",
		})
	})

	/* VERSION 1 API */

	app.Get("/v1", v1.Introduction)

	/* Authentication */
	app.Post("/v1/auth/login", middleware.CheckNotAuthenticated, v1.PostLogin)
	app.Post("/v1/auth/signup", middleware.CheckNotAuthenticated, v1.PostSignup)
	app.Delete("/v1/auth/logout", middleware.CheckAuthenticated, v1.DeleteLogout)

	/* Users */
	app.Get("/v1/user/@me", middleware.CheckAuthenticated, v1.GetMe)
	app.Get("/v1/user/:username", middleware.CheckAuthenticated, v1.GetUser)

	/* Documents */
	app.Get("/v1/document/:id", v1.GetDocument)
	app.Post("/v1/document", v1.PostDocument)
	app.Patch("/v1/document", middleware.CheckAuthenticated, v1.PatchDocument)
	app.Delete("/v1/document/:id", middleware.CheckAuthenticated, v1.DeleteDocument)
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

	app.Use(logger.New(logger.Config{
		Format: "${time} |   ${cyan}${status} ${reset}|   ${latency} | ${ip} on ${cyan}${ua} ${reset}| ${cyan}${method} ${reset}${path} \n",
	}))

	setupRoutes(app)

	if GetPrisma() == nil {
		SetGlobalDb(db.NewClient())
	}

	if GetRedisDB() == nil {
		SetRedisDB()
	}

	if err := GetPrisma().Prisma.Connect(); err != nil {
		panic(err)
	}

	defer func() {
		if err := GetPrisma().Prisma.Disconnect(); err != nil {
			panic(err)
		}
	}()

	log.Fatal(app.Listen(":" + os.Getenv("PORT")))
}
