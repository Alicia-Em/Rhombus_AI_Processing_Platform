import redis
r = redis.Redis(
    host="locathost",
    port=6379,
    db=0,
    decode_responses=True
)