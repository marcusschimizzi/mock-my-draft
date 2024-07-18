import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.word_count import SentimentWordCounter

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def word_counter():
    return SentimentWordCounter()

# Unit tests for word counter
def test_word_counter(word_counter):
    text = "This is a test sentence. It is a very good test sentence."
    counts = word_counter.count_words(text)
    assert counts == {
        'test': 2,
        'sentence': 2,
        'good': 1
    }

def test_word_counter_with_stopwords(word_counter):
    text = "This is a test sentence. It is a very good test sentence."
    counts = word_counter.count_words(text, custom_stopwords=["is", "a"])
    assert counts == {
        'test': 2,
        'sentence': 2,
        'good': 1
    }

def test_word_counter_with_sentiment(word_counter):
    text = "I love this amazing product! It's incredibly helpful."
    counts = word_counter.count_words(text, use_sentiment=True, sentiment_threshold=0.1)
    assert 'love' in counts
    assert 'amazing' in counts
    assert 'helpful' in counts

# Integration tests
def test_word_count_route(client):
    response = client.post("/wordcount", json={
        "text": "This is a test sentence. It is a very good test sentence."
    })
    assert response.status_code == 200
    assert response.json() == {
        "word_count": {
            'test': 2,
            'sentence': 2,
            'good': 1
        }
    }

def test_word_count_route_with_stopwords(client):
    response = client.post("/wordcount", json={
        "text": "This is a test sentence. It is a very good test sentence.",
        "custom_stopwords": ["is", "a"]
    })
    assert response.status_code == 200
    assert response.json() == {
        "word_count": {
            'test': 2,
            'sentence': 2,
            'good': 1
        }
    }

def test_word_count_route_with_sentiment(client):
    response = client.post("/wordcount", json={
        "text": "I love this amazing product! It's incredibly helpful.",
        "use_sentiment": True,
        "sentiment_threshold": 0.1
    })
    assert response.status_code == 200
    assert 'love' in response.json()["word_count"]
    assert 'amazing' in response.json()["word_count"]
    assert 'helpful' in response.json()["word_count"]

def test_word_count_route_empty_text(client):
    response = client.post("/wordcount", json={
        "text": ""
    })
    assert response.status_code == 200
    assert response.json() == {
        "word_count": {}
    }

def test_word_count_route_invalid_sentiment_threshold(client):
    # When the sentiment threshold is invalid, it should fallback to the default value of 0.1
    response = client.post("/wordcount", json={
        "text": "I love this amazing product! It's incredibly helpful.",
        "use_sentiment": True,
        "sentiment_threshold": 2.0
    })
    assert response.status_code == 200
    assert 'love' in response.json()["word_count"]
    assert 'amazing' in response.json()["word_count"]
    assert 'helpful' in response.json()["word_count"]

def test_word_count_route_invalid_input(client):
    response = client.post("/wordcount", json={})
    assert response.status_code == 422
