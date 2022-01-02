package utils

import (
	"bytes"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/aws/aws-sdk-go/service/ses"
)

func SESSession() (*session.Session, error) {
	return session.NewSession(&aws.Config{
		Region:      aws.String(os.Getenv("AWS_REGION")),
		Credentials: credentials.NewStaticCredentials(os.Getenv("AWS_ACCESS_KEY"), os.Getenv("AES_SECRET_KEY"), ""),
	})
}

func SendEmail(template string, to string, data string) (ok bool, err error) {
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

	_, emailErr := svc.SendTemplatedEmail((email))

	if emailErr != nil {
		println("[EMAIL ERROR]", emailErr.Error())

		return false, emailErr
	}

	return true, nil
}

func SaveImage(imageName string, buf []byte) (ok bool, err error) {
	session := session.Must(SESSession())
	uploader := s3manager.NewUploader(session)

	result, err := uploader.Upload(&s3manager.UploadInput{
		Bucket: aws.String("imperial"),
		Key:    aws.String(imageName + ".png"),
		Body:   bytes.NewReader(buf),
	})

	if err != nil && result == nil {
		return false, err
	}

	return true, nil
}
