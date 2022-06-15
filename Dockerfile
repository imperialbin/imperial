FROM golang:1.18-buster as uwu
WORKDIR "/services/go/api"

COPY /services/go/api .

RUN go mod download
RUN go build
RUN ls
COPY /services/go/api/api .


EXPOSE ${PORT}

FROM chromedp/headless-shell:latest

RUN apt-get update
RUN apt install tini
ENTRYPOINT ["tini", "--"]
RUN apt install -y ca-certificates && rm -rf /var/cache/apk/*

COPY --from=uwu /services/go/api .
CMD ["./api"]
