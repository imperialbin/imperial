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

func RedisGet(set, key string) (value string, ok bool) {
	value, err := rdb.HGet(ctx, set, key).Result()

	if err != nil {
		return "", false
	}

	return value, true
}

func RedisSet(set, key, value string, expiration int) bool {
	err := rdb.HSet(ctx, set, key, value).Err()
	rdb.Expire(ctx, key, time.Duration(expiration*1000000000*60))

	if err != nil {
		println(err)
		return false
	}

	return true
}
