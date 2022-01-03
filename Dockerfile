FROM golang:1.16-buster as uwu
ARG DATABASE_URL
ARG PORT
WORKDIR /services/go/api

COPY /services/go/api/go.mod .
COPY /services/go/api/go.sum .

RUN go mod download

COPY /services/go/api .

RUN go run github.com/prisma/prisma-client-go db push
RUN go build

EXPOSE ${PORT}

FROM chromedp/headless-shell:latest

RUN apt-get update
RUN apt install tini
ENTRYPOINT ["tini", "--"]

COPY --from=uwu /services/go/api .
CMD ["./api"]
