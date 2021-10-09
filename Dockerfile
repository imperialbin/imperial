FROM golang:1.16-alpine
WORKDIR /services/go/api

COPY go.mod \
  go.sum /services/go/api/

RUN go get

RUN go build

CMD [ "go", "run", "api" ]