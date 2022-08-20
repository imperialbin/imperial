package utils

import (
	"api/v1/commons"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/limiter"
)

func RateLimit(amountOfReqs int) func(*fiber.Ctx) error {
	return limiter.New(limiter.Config{
		Max:        amountOfReqs,
		Expiration: 1 * time.Minute,
		LimitReached: func(c *fiber.Ctx) error {
			return c.Status(429).JSON(commons.Response{
				Success: false,
				Message: "You are being rate limited!",
			})
		},
	})
}
