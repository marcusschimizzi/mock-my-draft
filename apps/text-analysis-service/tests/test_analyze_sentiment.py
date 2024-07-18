import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.sentiment_analysis import analyze_sentiment


# Mock the nltk sentiment analyzer for predictable results
def mock_polarity_scores(text):
    return {
        'neg': 0.0,
        'neu': 0.0,
        'pos': 1.0,
        'compound': 0.8402
    }


def mock_sentiment_analyzer():
    return mock_polarity_scores


@pytest.fixture
def client():
    return TestClient(app)


# Unit tests for sentiment analysis
def test_analyze_sentiment():
    text = "I love this amazing product! It's incredibly helpful."
    sentiment = analyze_sentiment(text)
    assert sentiment['compound'] > 0


def test_analyze_sentiment_negative():
    text = "I hate this terrible product! It's incredibly unhelpful."
    sentiment = analyze_sentiment(text)
    assert sentiment['compound'] < 0


def test_analyze_sentiment_return_type():
    text = "I love this amazing product! It's incredibly helpful."
    sentiment = analyze_sentiment(text)
    assert isinstance(sentiment, dict)
    assert 'neg' in sentiment
    assert 'neu' in sentiment
    assert 'pos' in sentiment
    assert 'compound' in sentiment


# Integration tests
def test_analyze_sentiment_route(client, mocker):
    mocker.patch('nltk.sentiment.SentimentIntensityAnalyzer.polarity_scores', side_effect=mock_sentiment_analyzer())
    response = client.post("/analyze/sentiment", json={
        "text": "I love this amazing product! It's incredibly helpful."
    })
    assert response.status_code == 200
    assert response.json() == {
        "sentiment": {
            'neg': 0.0,
            'neu': 0.0,
            'pos': 1.0,
            'compound': 0.8402
        }
    }
