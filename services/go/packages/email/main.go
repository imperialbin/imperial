package main

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ses"
	"github.com/joho/godotenv"
	"github.com/streadway/amqp"
)

const (
	AWS_REGION = "us-east-1"
	from       = "no-reply@imperialb.in"
)

/* Structs */

type rabbitMQRequest struct {
	Template string
	To       string
	Data     string
}

/* SES Session */

func SESSession() (*session.Session, error) {
	return session.NewSession(&aws.Config{
		Region:      aws.String(AWS_REGION),
		Credentials: credentials.NewStaticCredentials(os.Getenv("AWS_ACCESS"), os.Getenv("AWS_SECRET"), ""),
	})
}

/* Send Email */

func sendEmail(template string, to string, data string) {
	session := session.Must(SESSession())
	svc := ses.New(session)

	email := &ses.SendTemplatedEmailInput{
		Source:   aws.String(from),
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

	/* Bind the queue to the exchange so we can receive the messages */
	channel.QueueBind("emails", "emails", "emails", false, nil)

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
			var req rabbitMQRequest
			
			/* We're parsing the request here */
			json.Unmarshal([]byte(message.Body), &req)

			sendEmail(req.Template, req.To, req.Data)
		}
	}()

	<-forever
}
