import json

import redis

from app.core.config import settings

try:
    redis_client = redis.Redis.from_url(settings.redis_url, decode_responses=True)
    redis_client.ping()
except Exception:
    redis_client = None


def cache_get(key: str):
    if redis_client is None:
        return None
    raw = redis_client.get(key)
    return json.loads(raw) if raw else None


def cache_set(key: str, value: dict, ttl: int = 900):
    if redis_client is None:
        return
    redis_client.setex(key, ttl, json.dumps(value))
