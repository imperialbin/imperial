deps:
	cd services/go/api && go get -d ./
	cd services/node/app && yarn

api_dev:
	docker-compose up -d
	cd services/go/api && air

app_dev:
	cd services/node/app && yarn dev

build:
	cd services/go/api && go build
	cd services/node/app && yarn build
