from concurrent.futures import ProcessPoolExecutor
import multiprocessing
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.sentiment import SentimentIntensityAnalyzer
from collections import Counter
from typing import List, Dict, Optional, Tuple

nltk.download('punkt', quiet=True)
nltk.download('punkt_tab', quiet=True)
nltk.download('stopwords', quiet=True)
nltk.download('vader_lexicon', quiet=True)


class SentimentWordCounter:
    def __init__(self):
        self.stop_words = set(stopwords.words('english'))

    @staticmethod
    def process_chunk(chunk: Tuple[List[str], set, bool, Optional[float]]) -> Counter:
        words, stopwords, use_sentiment, sentiment_threshold = chunk
        sia = SentimentIntensityAnalyzer()
        filtered_words = [word for word in words if word.isalnum() and word not in stopwords]
        if use_sentiment:
            sentiment = sentiment_threshold or 0.1
            filtered_words = [
                word for word in filtered_words
                if abs(sia.polarity_scores(word)['compound']) > sentiment
            ]
        return Counter(filtered_words)

    def count_words(
            self,
            text: str,
            custom_stopwords: List[str] = None,
            use_sentiment: bool = False,
            sentiment_threshold: Optional[float] = None,
            chunk_size: int = 10000
    ) -> Dict[str, int]:
        # Tokenize the text and convert to lowercase
        words: list[str] = word_tokenize(text.lower())

        # Combine stopwords
        all_stopwords = self.stop_words.union(set(custom_stopwords or []))

        # Split the words into chunks
        word_chunks = [words[i:i + chunk_size] for i in range(0, len(words), chunk_size)]

        if use_sentiment:
            # Make sure provied sentiment threshold is valid
            # If not, we'll quietly fix it
            if sentiment_threshold is not None and not -1 <= sentiment_threshold <= 1:
                sentiment_threshold = None

        # Prepare the chunks
        process_chunks = [
            (chunk, all_stopwords, use_sentiment, sentiment_threshold)
            for chunk in word_chunks
        ]

        with ProcessPoolExecutor(max_workers=multiprocessing.cpu_count()) as executor:
            chunk_counters = list(executor.map(self.process_chunk, process_chunks))

        # Combine the results from each chunk
        word_counts = sum(chunk_counters, Counter())

        return dict(word_counts)
