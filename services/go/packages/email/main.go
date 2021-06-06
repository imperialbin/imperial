package main

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ses"
	"github.com/joho/godotenv"
)

const (
	sesRegion = "us-east-1"
)

/* SES Session */

func SESSession() (*session.Session, error) {
	return session.NewSession(&aws.Config{
		Region: aws.String(sesRegion),
	})
}

/* Send Email */

func sendEmail(template string, to string, data string) {
	godotenv.Load()

	config := &aws.Config{
		Region:      aws.String(sesRegion),
		Credentials: credentials.NewEnvCredentials(),
	}
	session := session.Must(session.NewSession((config)))

	svc := ses.New(session)
	from := "no-reply@imperialb.in"

	email := &ses.SendTemplatedEmailInput{
		Source:   &from,
		Template: &template,
		Destination: &ses.Destination{
			ToAddresses: []*string{&to},
		},
		TemplateData: &data,
	}

	svc.SendTemplatedEmail((email))
}

func testEmail() {
	data := "{ \"token\":\"" + "test1234" + "\" }"
	sendEmail("resetPassword", "hello@looskie.com", data)
}

func main() {
	testEmail()
}
