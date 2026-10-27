"""Offline HTTP smoke test for both built images (run with --network none)."""
import json
import subprocess
import sys
import time
from urllib.error import URLError
from urllib.request import Request, urlopen


def request(path, payload=None):
    data = None if payload is None else json.dumps(payload).encode()
    req = Request("http://127.0.0.1:8000" + path, data=data,
                  headers={"Content-Type": "application/json"})
    with urlopen(req, timeout=10) as response:
        return json.load(response)


def main():
    server = subprocess.Popen([
        sys.executable, "-m", "uvicorn", "app.main:app",
        "--host", "127.0.0.1", "--port", "8000",
    ])
    try:
        for _ in range(100):
            try:
                assert request("/health") == {"status": "ok"}
                break
            except URLError:
                if server.poll() is not None:
                    raise RuntimeError("API exited before becoming healthy")
                time.sleep(0.1)
        else:
            raise RuntimeError("API did not become healthy")
        for _ in range(2):
            assert request("/wordcount", {
                "text": "The good team is good.", "custom_stopwords": ["team"],
            }) == {"word_count": {"good": 2}}
            assert request("/wordcount?use_sentiment=true&sentiment_threshold=0.1", {
                "text": "love table",
            }) == {"word_count": {"love": 1}}
        assert request("/wordcount", {"text": ""}) == {"word_count": {}}
        assert request("/analyze/sentiment", {"text": "I love this!"})["sentiment"]["compound"] > 0
        print("Offline container API smoke passed")
    finally:
        server.terminate()
        server.wait(timeout=10)


if __name__ == "__main__":
    main()
