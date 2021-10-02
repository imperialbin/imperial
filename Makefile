api_dev:
	docker-compose up -d
	cd services/go/api/prisma && go run github.com/prisma/prisma-client-go db push
	cd services/go/api && air

deps:
	cd services/go/api && go get -d ./
	cd services/node/app && yarn

app_dev:
	cd services/node/app && yarn dev

build:
	cd services/go/api && go build
	cd services/node/app && yarn build
