FROM golang:1.16-alpine

COPY ./services/go/api .
RUN go build
RUN go run api