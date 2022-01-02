package utils

import (
	"context"

	"github.com/chromedp/chromedp"
)

func ScreenshotDocument(documentID string, memberPlus bool) {
	ctx, cancel := chromedp.NewContext(
		context.Background(),
	)
	defer cancel()

	var buf []byte

	if err := chromedp.Run(ctx, fullScreenshot(`http://localhost:3000/`+documentID+"?noNav=true", 80, &buf)); err != nil {
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
