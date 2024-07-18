import nltk
from nltk.sentiment import SentimentIntensityAnalyzer

nltk.download('vader_lexicon', quiet=True)

sia = SentimentIntensityAnalyzer()

def analyze_sentiment(text: str) -> dict[str, float]:
    sentiment_scores = sia.polarity_scores(text)
    return sentiment_scores