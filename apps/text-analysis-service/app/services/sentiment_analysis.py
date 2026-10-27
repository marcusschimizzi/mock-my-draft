from nltk.sentiment import SentimentIntensityAnalyzer


sia = SentimentIntensityAnalyzer()


def analyze_sentiment(text: str) -> dict[str, float]:
    sentiment_scores = sia.polarity_scores(text)
    return sentiment_scores
