FROM golang:1.16-buster
ARG DATABASE_URL
WORKDIR /services/go/api

COPY /services/go/api/go.mod .
COPY /services/go/api/go.sum .

RUN go mod download

COPY /services/go/api .

RUN go run github.com/prisma/prisma-client-go db push
RUN go build

CMD ["/main"]