FROM golang:1.16-alpine
WORKDIR /services/go/api

COPY go.mod ./
COPY go.sum ./

RUN go mod download

COPY / ./
RUN go build

CMD [ "go", "run", "api" ]