package oauth

import (
	"api/models"
	"api/utils"
	"api/v1/commons"
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/getsentry/sentry-go"
	"github.com/gofiber/fiber/v2"
)

func GetGitHubOAuth(c *fiber.Ctx) error {
	var clientID = os.Getenv("GITHUB_CLIENT_ID")
	var callbackURI = os.Getenv("GITHUB_CALLBACK")

	return c.Redirect(fmt.Sprintf("https://github.com/login/oauth/authorize?client_id=%s&redirect_uri=%s&scope=gist read:user", clientID, callbackURI))
}

func GetGitHubOAuthCallback(c *fiber.Ctx) error {
	var code = c.Query("code")

	if len(code) == 0 {
		return c.JSON(commons.Response{
			Success: true,
			Message: "An error occurred.",
		})
	}

	user, err := utils.GetAuthedUser(c)

	if err != nil || user == nil || strings.HasPrefix("IMPERIAL-", utils.GetAuthToken(c)) {
		return c.Status(401).JSON(commons.Response{
			Success: false,
			Message: "You are not authorized!",
		})
	}

	githubAccessToken, err := getGithubAccessToken(code)
	if err != nil {
		return c.JSON(commons.Response{
			Success: false,
			Message: "An unknown error occurred",
		})
	}

	data, err := getGithubData(*githubAccessToken)

	if err != nil || data == nil {
		return c.JSON(commons.Response{
			Success: false,
			Message: "An unknown error occurred",
		})
	}

	user.GitHub = data
	user.GitHub.OAuthToken = *githubAccessToken

	client := utils.GetDB()
	if result := client.Updates(&user); result.Error != nil {
		sentry.CaptureException(result.Error)

		return c.JSON(commons.Response{
			Success: false,
			Message: "An error occurred whilst updating your user.",
		})
	}

	return c.JSON(commons.Response{
		Success: true,
		Message: "hey",
		Data:    data,
	})
}

func getGithubAccessToken(code string) (*string, error) {
	var clientID = os.Getenv("GITHUB_CLIENT_ID")
	var clientSecret = os.Getenv("GITHUB_CLIENT_SECRET")

	requestBodyMap := map[string]string{
		"client_id":     clientID,
		"client_secret": clientSecret,
		"code":          code,
	}
	requestJSON, _ := json.Marshal(requestBodyMap)

	req, reqerr := http.NewRequest(
		"POST",
		"https://github.com/login/oauth/access_token",
		bytes.NewBuffer(requestJSON),
	)
	if reqerr != nil {
		log.Panic("Request creation failed")
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

	resp, resperr := http.DefaultClient.Do(req)
	if resperr != nil {
		return nil, resperr
	}

	if resp.StatusCode > 200 {
		return nil, errors.New("an error occurred")
	}

	respbody, _ := ioutil.ReadAll(resp.Body)

	type githubAccessTokenResponse struct {
		AccessToken string `json:"access_token"`
		TokenType   string `json:"token_type"`
		Scope       string `json:"scope"`
	}

	var ghresp githubAccessTokenResponse
	json.Unmarshal(respbody, &ghresp)

	return &ghresp.AccessToken, nil
}

func getGithubData(accessToken string) (*models.GitHubUser, error) {
	req, reqerr := http.NewRequest(
		"GET",
		"https://api.github.com/user",
		nil,
	)
	if reqerr != nil {
		log.Panic("API Request creation failed")
	}

	authorizationHeaderValue := fmt.Sprintf("token %s", accessToken)
	req.Header.Set("Authorization", authorizationHeaderValue)

	resp, resperr := http.DefaultClient.Do(req)

	if resp.StatusCode > 200 {
		return nil, errors.New("an error occurred")
	}

	if resperr != nil {
		return nil, resperr
	}

	var githubUser = models.GitHubUser{}
	respbody, _ := ioutil.ReadAll(resp.Body)

	json.Unmarshal(respbody, &githubUser)

	return &githubUser, nil
}
