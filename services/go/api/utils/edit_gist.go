package utils

import (
	"api/models"
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"

	"github.com/getsentry/sentry-go"
)

func EditGist(user *models.User, gistID, content string) (gist string, err error) {
	client := http.Client{}
	body, _ := json.Marshal("")

	req, err := http.NewRequest("PATCH", "https://api.github.com/gists/"+gistID, bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "token "+*&user.GitHub.OAuthToken)

	if err != nil {
		sentry.CaptureException(err)

		return "", err
	}

	makeReq, err := client.Do(req)

	if err != nil {
		sentry.CaptureException(err)

		return "", err
	}

	res := struct {
		ID string `json:"id"`
	}{}
	parsed, reqErr := ioutil.ReadAll(makeReq.Body)
	json.Unmarshal(parsed, &res)

	if reqErr != nil {
		sentry.CaptureException(err)

		return "", err
	}

	return string(res.ID), nil
}
