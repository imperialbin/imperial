package main

import (
	"api/middleware"
	"api/utils"
	v1Routes "api/v1"
	"api/v1/commons"
	"log"
	"os"
	"time"

	"github.com/getsentry/sentry-go"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"
)

const (
	APIRelease = "api@0.0.3"
)

func setupRoutes(app *fiber.App) {
	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(commons.BaseResponse{
			Success:           true,
			Message:           "You have reached IMPERIAL's API!",
			AvailableVersions: []string{"/v1"},
			Documentation:     "https://docs.imperialb.in/",
		})
	})

	/* VERSION 1 API */
	v1 := app.Group("/v1")
	v1.Get("/", utils.RateLimit(200), v1Routes.Introduction)

	/* Authentication */
	v1.Post("/auth/login", middleware.CheckNotAuthenticated, utils.RateLimit(20), v1Routes.PostLogin)
	v1.Post("/auth/signup", middleware.CheckNotAuthenticated, utils.RateLimit(20), v1Routes.PostSignup)
	v1.Post("/auth/request_reset", middleware.CheckNotAuthenticated, utils.RateLimit(20), v1Routes.PostRequestResetPassword)
	v1.Post("/auth/reset", middleware.CheckNotAuthenticated, utils.RateLimit(80), v1Routes.PostResetPassword)
	v1.Delete("/auth/logout", middleware.CheckAuthenticated, utils.RateLimit(20), v1Routes.DeleteLogout)

	/* User(s) */
	v1.Get("/users/@me", middleware.CheckAuthenticated, utils.RateLimit(200), v1Routes.GetMe)
	v1.Get("/users/@me/recent_documents", middleware.CheckAuthenticated, utils.RateLimit(200), v1Routes.GetRecentDocuments)
	v1.Get("/users/:username", middleware.CheckAuthenticated, utils.RateLimit(200), v1Routes.GetUser)
	v1.Get("/users/search/:username", middleware.CheckAuthenticated, utils.RateLimit(200), v1Routes.SearchUsers)
	v1.Patch("/users/@me", middleware.CheckAuthenticated, utils.RateLimit(20), v1Routes.PatchMe)
	v1.Post("/users/@me/delete", middleware.CheckAuthenticated, utils.RateLimit(20), v1Routes.DeleteMe) // We're making this a post because we need a body
	v1.Post("/users/@me/regenAPIToken", middleware.CheckAuthenticated, utils.RateLimit(20), v1Routes.PostRegenAPIToken)

	/* Documents */
	v1.Get("/document/:id", utils.RateLimit(200), v1Routes.GetDocument)
	v1.Post("/document", utils.RateLimit(80), v1Routes.PostDocument)
	v1.Patch("/document", middleware.CheckAuthenticated, utils.RateLimit(20), v1Routes.PatchDocument)
	v1.Delete("/document/:id", middleware.CheckAuthenticated, utils.RateLimit(20), v1Routes.DeleteDocument)

	/* OAuth */
	v1.Get("/oauth/discord", utils.RateLimit(200), v1Routes.GetDiscordOAuth)
	v1.Get("/oauth/discord/callback", utils.RateLimit(200), middleware.CheckAuthenticated, v1Routes.GetDiscordOAuthCallback)
	v1.Get("/oauth/github", utils.RateLimit(200), v1Routes.GetGitHubOAuth)
	v1.Get("/oauth/github/callback", utils.RateLimit(200), middleware.CheckAuthenticated, v1Routes.GetGitHubOAuthCallback)

	/* Devices */
	v1.Get("/devices/@me", middleware.CheckAuthenticated, utils.RateLimit(200), v1Routes.GetDevices)
	v1.Delete("/devices/:id", middleware.CheckAuthenticated, utils.RateLimit(20), v1Routes.DeleteDevice)

	/* Invalid Routes */
	app.Use(v1Routes.InvalidRoute)
}

func main() {
	godotenv.Load()
	utils.InitDB()

	if err := sentry.Init(sentry.ClientOptions{
		Dsn:              os.Getenv("SENTRY_DSN"),
		Environment:      os.Getenv("SENTRY_ENVIRONMENT"),
		TracesSampleRate: 1.0,
		Release:          APIRelease,
	}); err != nil {
		log.Fatalf("sentry.Init: %s", err)
	}

	// Flush buffered events before the program terminates.
	defer sentry.Flush(2 * time.Second)

	if utils.GetRedisDB() == nil {
		utils.SetRedisDB()
	}

	app := fiber.New(fiber.Config{
		CaseSensitive: false,
		StrictRouting: false,
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

	setupRoutes(app)

	log.Fatal(app.Listen(":" + os.Getenv("PORT")))
}
