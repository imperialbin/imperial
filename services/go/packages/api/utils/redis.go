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

func RedisSet(key, value string, days int) bool {
	/* This long number basically converts the nanoseconds to days, you're welcome */
	err := rdb.Set(ctx, key, value, time.Duration(days*86400000000000)).Err()

	if err != nil {
		return false
	}

	return true
}
