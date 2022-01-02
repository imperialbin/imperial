package utils

import (
	. "api/v1/commons"
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

type BodyStruct struct {
	Description string `json:"description"`
	Files       Files  `json:"files"`
}

type Files struct {
	Document Document `json:"IMPERIAL-Document"`
}

type Document struct {
	Content string `json:"content"`
}

func CreateGist(user *User, id, content string) (gist string, err error) {
	client := http.Client{}
	body, _ := json.Marshal(BodyStruct{
		Description: fmt.Sprintf("IMPERIAL Document %s made by %s. Automatically generated by IMPERIAL", id, user.Username),
		Files: Files{
			Document: Document{
				Content: content,
			},
		},
	})

	req, err := http.NewRequest("POST", "https://api.github.com/gists", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "token "+*user.GithubAccess)

	if err != nil {
		println(err.Error())
		return "", err
	}

	makeReq, err := client.Do(req)

	if err != nil {
		println(err.Error())
		return "", err
	}

	res := struct {
		ID string `json:"id"`
	}{}
	parsed, reqErr := ioutil.ReadAll(makeReq.Body)
	json.Unmarshal(parsed, &res)

	if reqErr != nil {
		println(err.Error())
		return "", err
	}

	return string(res.ID), nil
}