import sys
import urllib.request
import json


def healthcheck():
    try:
        url = "http://localhost:8000/health"
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read().decode())
            if response.getcode() == 200:
                if data["status"] == "ok":
                    print("Healthcheck passed")
                    sys.exit(0)
                else:
                    print("Healthcheck failed")
                    sys.exit(1)
    except Exception:
        print("Healthcheck failed")
        sys.exit(1)


if __name__ == "__main__":
    healthcheck()
