import os
from typing import List, Optional
from fastapi import FastAPI, Query
from pydantic import BaseModel
from app.core.config import settings
from app.services.sentiment_analysis import analyze_sentiment
from app.services.word_count import SentimentWordCounter

app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION)
port = os.getenv("PORT", 3000)
word_counter = SentimentWordCounter()

class TextInput(BaseModel):
    text: str
    custom_stopwords: List[str] = None


@app.get("/")
async def read_root():
    return {"message": "Welcome to the Text Analysis Service!"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/analyze/sentiment")
async def analyze_sentiment_route(input: TextInput):
    print(input.text)
    sentiment = analyze_sentiment(input.text)
    return { "sentiment": sentiment }

@app.post("/wordcount")
async def get_word_counts(
    input: TextInput,
    use_sentiment: bool = Query(False, description="Whether to use sentiment analysis for filtering"),
    sentiment_threshold: Optional[float] = Query(None, description="Sentiment threshold for filtering neutral words")
):
    counts = word_counter.count_words(
        input.text,
        custom_stopwords=input.custom_stopwords,
        use_sentiment=use_sentiment,
        sentiment_threshold=sentiment_threshold
    )
    return { "word_count": counts }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)