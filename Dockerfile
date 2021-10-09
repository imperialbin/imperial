FROM golang:1.16-alpine

COPY /services/go/api/go.mod .
COPY /services/go/api/go.sum .
RUN go get

COPY /services/go/api .

RUN go build

CMD [ "go", "run", "api" ]