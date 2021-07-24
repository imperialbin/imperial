package main

import (
	v1 "api/v1"

	"github.com/gofiber/fiber/v2"
)

func setupRoutes(app *fiber.App) {

	/* VERSION 1 API */

	app.Get("/v1", v1.Introduction)
	app.Get("/v1/document/:documentId", v1.GetDocument)
	app.Post("/v1/document", v1.CreateDocument)
	app.Patch("/v1/document", v1.EditDocument)
	app.Delete("/v1/document/:documentId", v1.DeleteDocument)
}

func main() {
	app := fiber.New()

	setupRoutes(app)

	app.Listen(":3000")
}
