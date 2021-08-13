package utils

import (
	"context"
	"os"
	"time"

	"github.com/go-redis/redis/v8"
)

var rdb *redis.Client
var ctx = context.Background()

func SetRedisDB() {
	opt, err := redis.ParseURL(os.Getenv("REDIS_URI"))

	if err != nil {
		panic(err)
	}
	rdb = redis.NewClient(opt)
}

func GetRedisDB() *redis.Client {
	return rdb
}

func RedisGet(key string) (value string, ok bool) {
	value, err := rdb.Get(ctx, key).Result()

	if err != nil {
		return "", false
	}

	return value, true
}

func RedisSet(key, value string, expiration int) bool {
	err := rdb.Set(ctx, key, value, time.Duration(expiration)).Err()

	if err != nil {
		println("err!!!", err)
		return false
	}

	return true
}
