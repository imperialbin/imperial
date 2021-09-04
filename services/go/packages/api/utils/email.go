package utils

import (
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ses"
)

func SESSession() (*session.Session, error) {
	return session.NewSession(&aws.Config{
		Region:      aws.String(os.Getenv("AWS_REGION")),
		Credentials: credentials.NewSharedCredentials("", *aws.String((os.Getenv("AWS_PROFILE")))),
	})
}
func SendEmail(template string, to string, data string) {
	session := session.Must(SESSession())
	svc := ses.New(session)

	email := &ses.SendTemplatedEmailInput{
		Source:   aws.String(os.Getenv("AWS_SES_FROM")),
		Template: &template,
		Destination: &ses.Destination{
			ToAddresses: []*string{aws.String(to)},
		},
		TemplateData: &data,
	}

	_, err := svc.SendTemplatedEmail((email))

	if err != nil {
		println("[EMAIL ERROR]", err.Error())
	}
}
