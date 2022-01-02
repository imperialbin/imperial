package utils

import (
	"context"
	"os"

	"github.com/chromedp/chromedp"
)

func ScreenshotDocument(documentID string, memberPlus bool) {
	ctx, cancel := chromedp.NewContext(
		context.Background(),
	)
	defer cancel()

	var buf []byte
	var quality = 60

	if memberPlus {
		quality = 90
	}

	if err := chromedp.Run(ctx, fullScreenshot(os.Getenv("SCREENSHOT_URI")+documentID+"?noNav=true", quality, &buf)); err != nil {
		println(err.Error())
		return
	}

	SaveImage(documentID, buf)
}

func fullScreenshot(urlstr string, quality int, res *[]byte) chromedp.Tasks {
	return chromedp.Tasks{
		chromedp.Navigate(urlstr),
		chromedp.WaitVisible("div.monaco-editor"),
		chromedp.FullScreenshot(res, quality),
	}
}
