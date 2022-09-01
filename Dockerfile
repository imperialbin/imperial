FROM golang:1.18-buster as uwu
WORKDIR /services/go/api

COPY /services/go/api/go.mod .
COPY /services/go/api/go.sum .

RUN go mod download

COPY /services/go/api .

RUN go mod download github.com/orisano/pixelmatch

RUN go build

FROM chromedp/headless-shell:latest

RUN apt-get update
RUN apt install tini
ENTRYPOINT ["tini", "--"]
RUN apt install -y ca-certificates && rm -rf /var/cache/apk/*

COPY --from=uwu /services/go/api .
CMD ["./api"]