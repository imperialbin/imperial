package main

import (
	"api/middleware"
	"api/prisma/db"
	. "api/utils"
	v1Routes "api/v1"
	. "api/v1/commons"
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
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
	v1 := app.Group("/v1")
	v1.Get("/", v1Routes.Introduction)

	/* Authentication */
	v1.Post("/auth/login", middleware.CheckNotAuthenticated, v1Routes.PostLogin)
	v1.Post("/auth/signup", middleware.CheckNotAuthenticated, v1Routes.PostSignup)
	v1.Post("/auth/requestReset", middleware.CheckNotAuthenticated, v1Routes.PostRequestResetPassowrd)
	v1.Post("/auth/reset", middleware.CheckNotAuthenticated, v1Routes.PostResetPassword)
	v1.Patch("/auth/resetInClient", middleware.CheckAuthenticated, v1Routes.PatchResetPasswordInClient)
	v1.Delete("/auth/logout", middleware.CheckAuthenticated, v1Routes.DeleteLogout)

	/* User(s) */
	v1.Get("/user/@me", middleware.CheckAuthenticated, v1Routes.GetMe)
	v1.Patch("/user/@me", middleware.CheckAuthenticated, v1Routes.PatchMe)
	v1.Patch("/user/@me/icon", middleware.CheckAuthenticated, v1Routes.PatchIcon)
	v1.Patch("/user/@me/email", middleware.CheckAuthenticated, v1Routes.PatchEmail)
	v1.Post("/user/@me/regenAPIToken", middleware.CheckAuthenticated, v1Routes.PostRegenAPIToken)
	v1.Get("/user/@me/recentDocuments", middleware.CheckAuthenticated, v1Routes.GetUserDocuments)
	v1.Post("/user/@me", middleware.CheckAuthenticated, v1Routes.DeleteMe) // We're making this a post because we need a body
	v1.Get("/user/:username", middleware.CheckAuthenticated, v1Routes.GetUser)

	/* Documents */
	v1.Get("/document/:id", v1Routes.GetDocument)
	v1.Post("/document", v1Routes.PostDocument)
	v1.Patch("/document", middleware.CheckAuthenticated, v1Routes.PatchDocument)
	v1.Delete("/document/:id", middleware.CheckAuthenticated, v1Routes.DeleteDocument)

	/* Admin */
	v1.Get("/admin", middleware.CheckAdmin, v1Routes.GetAdmin)
	v1.Post("/admin/user", middleware.CheckAdmin, v1Routes.PostBanUser)

	/* OAuth */
	v1.Get("/oauth/discord", middleware.CheckAuthenticated, v1Routes.GetDiscord)
	v1.Get("/oauth/discord/callback", middleware.CheckAuthenticated, v1Routes.GetDiscordCallback)
}

func main() {
	godotenv.Load()

	app := fiber.New(fiber.Config{
		CaseSensitive: false,
		StrictRouting: true,
		ServerHeader:  "IMPERIAL API",
		AppName:       "IMPERIAL API v1.0",
		BodyLimit:     0.25 * 1024 * 1024,
	})

	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
	}))
	app.Use(logger.New(logger.Config{
		Format: "${time} |   ${cyan}${status} ${reset}|   ${latency} | ${ip} on ${cyan}${ua} ${reset}| ${cyan}${method} ${reset}${path} \n",
	}))
	app.Use(recover.New(recover.Config{
		Next:             nil,
		EnableStackTrace: true,
	}))

	app.Use(limiter.New(limiter.Config{
		Max:        80,
		Expiration: 1 * time.Minute,
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
