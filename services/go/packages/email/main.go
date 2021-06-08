package main

import (
	"fmt"
	"log"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ses"
	"github.com/joho/godotenv"
	"github.com/streadway/amqp"
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
	config := &aws.Config{
		Region:      aws.String(sesRegion),
		Credentials: credentials.NewStaticCredentials(os.Getenv("AWS_ACCESS"), os.Getenv("AWS_SECRET"), ""),
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

	_, err := svc.SendTemplatedEmail((email))

	if err != nil {
		fmt.Println("error", err)
	}
}

func testResetPasswordEmail() {
	data := "{ \"token\":\"TestToken\"  }"
	sendEmail("ResetPassword", "hello@looskie.com", data)
}

func testNewLoginEmail() {
	data := "{ }"
	sendEmail("NewLogin", "hello@looskie.com", data)
}

func testConfirmEmail() {
	data := "{ \"emailToken\":\"TestToken\"  }"
	sendEmail("ConfirmEmail", "hello@looskie.com", data)
}

func testAll() {
	testResetPasswordEmail()
	testNewLoginEmail()
	testConfirmEmail()
}

func main() {
	godotenv.Load()

	fmt.Println("Connecting to RabbitMQ")
	conn, err := amqp.Dial(os.Getenv("RABBITMQ_URI"))

	if err != nil {
		fmt.Println("error", err)
		panic(err)
	}

	defer conn.Close()

	fmt.Println("Connected to RabbitMQ")

	channel, err := conn.Channel()
	if err != nil {
		fmt.Println("error", err)
		panic(err)
	}
	defer channel.Close()

	messages, err := channel.Consume(
		"emails",
		"",
		true,
		false,
		false,
		false,
		nil,
	)

	fmt.Println("[*] - RabbitMQ idling for messages")

	forever := make(chan bool)

	go func() {
		for message := range messages {
			log.Printf(" > Received message: %s\n", message.Body)
		}
	}()

	<-forever
}
