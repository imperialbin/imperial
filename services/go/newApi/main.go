package main

import (
	"log"
	"newapi/middleware"
	"newapi/utils"
	v1Routes "newapi/v1"
	"newapi/v1/commons"
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
		return c.JSON(commons.BaseResponse{
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
	v1.Post("/auth/requestReset", middleware.CheckNotAuthenticated, v1Routes.PostRequestResetPassword)
	v1.Post("/auth/reset", middleware.CheckNotAuthenticated, v1Routes.PostResetPassword)
	v1.Delete("/auth/logout", middleware.CheckAuthenticated, v1Routes.DeleteLogout)

	/* User(s) */
	v1.Get("/users/@me", middleware.CheckAuthenticated, v1Routes.GetMe)
	v1.Patch("/users/@me", middleware.CheckAuthenticated, v1Routes.PatchMe)
	v1.Post("/users/@me/delete", middleware.CheckAuthenticated, v1Routes.DeleteMe) // We're making this a post because we need a body
	v1.Post("/users/@me/regenAPIToken", middleware.CheckAuthenticated, v1Routes.PostRegenAPIToken)
	v1.Get("/users/:username", middleware.CheckAuthenticated, v1Routes.GetUser)

	/* Documents */
	v1.Get("/document/:id", v1Routes.GetDocument)
	v1.Post("/document", v1Routes.PostDocument)
	v1.Patch("/document", middleware.CheckAuthenticated, v1Routes.PatchDocument)
	v1.Delete("/document/:id", middleware.CheckAuthenticated, v1Routes.DeleteDocument)

	/* OAuth */
	v1.Get("/oauth/discord", v1Routes.GetDiscord)
	v1.Get("/oauth/discord/callback", middleware.CheckAuthenticated, v1Routes.GetDiscordCallback)

	/* Invalid Routes */
	app.Use(v1Routes.InvalidRoute)

}

func main() {
	godotenv.Load()
	utils.InitDB()

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

	app.Use(limiter.New(limiter.Config{
		Max:        80,
		Expiration: 1 * time.Minute,
		LimitReached: func(c *fiber.Ctx) error {
			return c.Status(429).JSON(commons.Response{
				Success: false,
				Message: "You are being rate limited!",
			})
		},
	}))

	setupRoutes(app)

	log.Fatal(app.Listen("127.0.0.1:" + os.Getenv("PORT")))
}
