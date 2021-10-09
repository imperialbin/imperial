FROM golang:1.16-alpine

WORKDIR /services/go/api
RUN ls
RUN rm -rf ./go.mod

RUN go build
RUN go run api