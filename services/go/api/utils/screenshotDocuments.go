package utils

import (
	"context"
	"os"

	"github.com/chromedp/chromedp"
	"github.com/getsentry/sentry-go"
)

func ScreenshotDocument(documentID string, userFlag int) {
	ctx, cancel := chromedp.NewContext(
		context.Background(),
	)
	defer cancel()

	var buf []byte
	var quality = 60

	if TestPermission(userFlag, MEMBER_PLUS) {
		quality = 90
	}

	if err := chromedp.Run(ctx, fullScreenshot(os.Getenv("SCREENSHOT_URI")+documentID+"?noNav=true", quality, &buf)); err != nil {
		sentry.CaptureException(err)

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
