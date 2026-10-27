"""Exercise real fresh interpreters, including every spawned pool worker."""
import os
from pathlib import Path
import subprocess
import sys
import textwrap


def test_spawned_counts_without_downloads_or_network(tmp_path):
    # sitecustomize is loaded in the subprocess AND its spawn children, unlike
    # pytest monkeypatches in the parent. Fail even when a download would hit cache.
    (tmp_path / "sitecustomize.py").write_text(textwrap.dedent("""
        import socket
        import nltk
        from nltk.downloader import Downloader

        def forbidden(*args, **kwargs):
            raise AssertionError("runtime download/network access forbidden")

        nltk.download = forbidden
        Downloader.download = forbidden
        socket.socket.connect = forbidden
        socket.create_connection = forbidden
    """))
    script = tmp_path / "exercise.py"
    script.write_text(textwrap.dedent("""
        import multiprocessing
        import os
        from concurrent.futures import ProcessPoolExecutor
        import nltk
        from app.services.word_count import SentimentWordCounter
        from app.services.sentiment_analysis import analyze_sentiment

        def check_child():
            # Prove the guard is active inside a real spawn child.
            try:
                nltk.download("stopwords")
            except AssertionError:
                return os.getpid()
            raise AssertionError("child download guard missing")

        if __name__ == "__main__":
            with ProcessPoolExecutor(
                max_workers=1, mp_context=multiprocessing.get_context("spawn")
            ) as pool:
                assert pool.submit(check_child).result() != os.getpid()
            counter = SentimentWordCounter()
            for _ in range(2):
                assert counter.count_words(
                    "The good team is good.", custom_stopwords=["team"], chunk_size=2
                ) == {"good": 2}
                assert counter.count_words("") == {}
                assert counter.count_words(
                    "love table", use_sentiment=True, sentiment_threshold=0.1
                ) == {"love": 1}
                assert counter.count_words(
                    "love table", use_sentiment=True, sentiment_threshold=1.0
                ) == {}
                for threshold in (None, 0.0, 2.0, -2.0):
                    assert counter.count_words(
                        "love table", use_sentiment=True, sentiment_threshold=threshold
                    ) == {"love": 1}
            assert analyze_sentiment("I love this!")["compound"] > 0
    """))
    root = Path(__file__).resolve().parents[1]
    env = dict(os.environ)
    env["PYTHONPATH"] = os.pathsep.join([str(tmp_path), str(root)])
    result = subprocess.run(
        [sys.executable, str(script)], cwd=root, env=env,
        capture_output=True, text=True, timeout=120,
    )
    assert result.returncode == 0, result.stdout + result.stderr
