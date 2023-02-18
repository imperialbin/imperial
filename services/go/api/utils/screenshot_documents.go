package utils

import (
	"context"

	"net/url"

	"github.com/chromedp/chromedp"
	"github.com/getsentry/sentry-go"
)

func ScreenshotDocument(documentID string, documentContent string, userFlag int) {
	ctx, cancel := chromedp.NewContext(
		context.Background(),
	)
	defer cancel()

	var buf []byte
	var quality = 60

	if TestPermission(userFlag, MemberPlus) {
		quality = 90
	}

	// url encode documentContent
	var code = url.QueryEscape(documentContent)
	url := "https://carbon.now.sh/?code=" + code

	println(url)
	if err := chromedp.Run(ctx, fullScreenshot(url, quality, &buf)); err != nil {
		sentry.CaptureException(err)

		return
	}

	println("SAVING IMAGE")
	SaveImage(documentID, buf)
}

func fullScreenshot(url string, quality int, res *[]byte) chromedp.Tasks {
	var carbonTheme = `'[{"id":"theme:837ta3fl5eq","name":"imperial","highlights":{"background":"rgba(31,31,31,1)","text":"rgba(207,207,207,1)","variable":"rgba(200,225,255,1)","attribute":"rgba(207,207,207,1)","definition":"rgba(121,184,255,1)","keyword":"rgba(255,110,110,1)","operator":"#D4D4D4","property":"rgba(200,225,255,1)","number":"#B5CEA8","string":"rgba(121,184,255,1)","comment":"rgba(149,157,165,1)","meta":"rgba(200,225,255,1)","tag":"#569cd6"},"custom":true}]'`
	var carbonState = `'{"paddingVertical":"25px","paddingHorizontal":"25px","backgroundImage":null,"backgroundImageSelection":null,"backgroundMode":"color","backgroundColor":"linear-gradient(144.12deg, #1F1E1E 20.99%, #353535 100.33%);","dropShadow":true,"dropShadowOffsetY":"20px","dropShadowBlurRadius":"68px","theme":"theme:837ta3fl5eq","windowTheme":"none","language":"auto","fontFamily":"JetBrains Mono","fontSize":"15px","lineHeight":"133%","windowControls":true,"widthAdjustment":false,"lineNumbers":false,"firstLineNumber":1,"exportSize":"2x","watermark":false,"squaredImage":false,"hiddenCharacters":false,"name":"","width":"700"}'`

	return chromedp.Tasks{
		chromedp.Navigate(url),
		chromedp.Evaluate("localStorage.setItem('CARBON_THEMES', "+carbonTheme+")", res),
		chromedp.Evaluate("localStorage.setItem('CARBON_STATE', "+carbonState+")", res),
		chromedp.Reload(),
		chromedp.Screenshot("#export-container", res),
	}
}
