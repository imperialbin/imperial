FROM golang:1.16-alpine
WORKDIR /services/go/api

COPY /services/go/api/go.mod .
COPY /services/go/api/go.sum .

RUN go mod download

COPY /services/go/api .
RUN go build

CMD [ "go", "run", "api" ]