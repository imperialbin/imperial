package main

import (
	"log"

	"github.com/mxschmitt/playwright-go"
)

func main() {

}

func screenshot(url string, quality int) {
	pw, err := playwright.Run()
	if err != nil {
		log.Fatalf("Failed to launch instance: %v", err)
	}

	browser, err := pw.Chromium.Launch()

	if err != nil {
		log.Fatalf("Failed to launch browser instance: %v", err)
	}

	page, err := browser.NewPage();

	if err != nil {
		log.Fatalf("could not create page: %v", err)
	}


}
