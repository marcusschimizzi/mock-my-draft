import axios from 'axios';

const textCorpus = 'The quick brown fox jumps over the lazy dog.';

describe('GET /', () => {
  it('should return a message', async () => {
    console.log('Base url:', axios.defaults.baseURL);
    const res = await axios.get(`/`);

    expect(res.status).toBe(200);
    expect(res.data).toEqual({
      message: 'Welcome to the Text Analysis Service!',
    });
  });
});

describe('GET /health', () => {
  it('should return a status message', async () => {
    const res = await axios.get(`/health`);

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ status: 'ok' });
  });
});

describe('POST /wordcount', () => {
  it('should return word counts', async () => {
    const res = await axios.post(`/wordcount`, { text: textCorpus });

    expect(res.status).toBe(200);
    expect(res.data).toEqual({
      word_count: {
        quick: 1,
        brown: 1,
        fox: 1,
        jumps: 1,
        lazy: 1,
        dog: 1,
      },
    });
  });

  it('should honor custom stop words', async () => {
    const stopWords = ['fox', 'lazy'];
    const res = await axios.post(`/wordcount`, {
      text: textCorpus,
      custom_stopwords: stopWords,
    });

    expect(res.status).toBe(200);
    expect(res.data).toEqual({
      word_count: {
        quick: 1,
        brown: 1,
        jumps: 1,
        dog: 1,
      },
    });
  });
});

describe('POST /analyze/sentiment', () => {
  it('should return sentiment', async () => {
    const res = await axios.post(`/analyze/sentiment`, { text: textCorpus });

    expect(res.status).toBe(200);
    expect(res.data.sentiment).not.toBeNull();
    expect(res.data.sentiment).toHaveProperty('pos');
    expect(res.data.sentiment).toHaveProperty('neg');
    expect(res.data.sentiment).toHaveProperty('neu');
    expect(res.data.sentiment).toHaveProperty('compound');
  });
});
