# syntax=docker/dockerfile:1
FROM golang:1.18-buster as uwu
WORKDIR /api

COPY go.mod ./
COPY go.sum ./

RUN go mod download

COPY *.go ./

RUN go build
RUN ls


EXPOSE ${PORT}

FROM chromedp/headless-shell:latest

RUN apt-get update
RUN apt install tini
ENTRYPOINT ["tini", "--"]
RUN apt install -y ca-certificates && rm -rf /var/cache/apk/*

COPY --from=uwu /api .
CMD ["./api"]
