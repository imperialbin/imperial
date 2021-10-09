FROM golang:1.16-alpine

WORKDIR /services/go/api
RUN ls

RUN go build
RUN go run api