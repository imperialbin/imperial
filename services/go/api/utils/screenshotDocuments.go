package utils

import (
	"context"
	"os"

	"github.com/chromedp/chromedp"
)

func ScreenshotDocument(documentID string, memberPlus bool) {
	println("bruhh")
	ctx, cancel := chromedp.NewContext(
		context.Background(),
	)

	println("bruhh444")
	defer cancel()


	println("MATE")

	var buf []byte
	var quality = 60

	if memberPlus {
		quality = 90
	}

	println("llll")
	if err := chromedp.Run(ctx, fullScreenshot(os.Getenv("SCREENSHOT_URI")+documentID+"?noNav=true", quality, &buf)); err != nil {
		println(err.Error())
		return
	}

	println("SAVING IMAGE")
	SaveImage(documentID, buf)
}

func fullScreenshot(urlstr string, quality int, res *[]byte) chromedp.Tasks {
	return chromedp.Tasks{
		chromedp.Navigate(urlstr),
		chromedp.WaitVisible("div.monaco-editor"),
		chromedp.FullScreenshot(res, quality),
	}
}
